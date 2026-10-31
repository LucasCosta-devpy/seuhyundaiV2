import { bearerToken, createClientToken, readClientToken } from './_lib/auth.js'
import { rotasStore } from './_lib/rotasStore.js'
import { conferirSenha } from './_lib/senha.js'

// Acesso do cliente à própria rota. Cada token só abre a rota do próprio cliente.
//   POST { username, password }  -> { token }
//   GET  (Bearer token)          -> { routeName, clientName, html, files, updatedAt }
//   GET  ?file=ID (Bearer token) -> o arquivo anexado

const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000
const HOUR_MS = 60 * 60 * 1000

async function routeFromToken(req, store) {
  const claims = readClientToken(bearerToken(req))
  if (!claims) return null
  const route = await store.get(claims.routeId)
  if (!route || route.revoked || route.tokenVersion !== claims.version) return null
  return route
}

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store')
    const store = rotasStore()

    if (req.method === 'POST') {
      const username = String(req.body?.username || '').trim().toLowerCase()
      const password = String(req.body?.password || '')
      if (!username || !password) return res.status(400).json({ error: 'Informe usuário e senha.' })

      const route = await store.getByUsername(username)
      if (route?.lockedUntil && route.lockedUntil > Date.now()) {
        return res.status(429).json({ error: 'Muitas tentativas erradas. Tente de novo em alguns minutos.' })
      }
      const ok = conferirSenha(password, route?.passwordHash)
      if (!route || !ok) {
        if (route) {
          const failedAttempts = route.failedAttempts + 1
          const lock = failedAttempts >= MAX_ATTEMPTS
          await store.update(route.id, { failedAttempts: lock ? 0 : failedAttempts, lockedUntil: lock ? Date.now() + LOCK_MS : null })
        }
        return res.status(401).json({ error: 'Usuário ou senha incorretos.' })
      }
      if (route.revoked) return res.status(403).json({ error: 'Este acesso foi desativado. Fale com a Rumo Mais Uma Rota.' })

      await store.update(route.id, { failedAttempts: 0, lockedUntil: null, lastAccess: Date.now() })
      return res.status(200).json({ token: createClientToken(route.id, route.tokenVersion) })
    }

    if (req.method === 'GET') {
      const route = await routeFromToken(req, store)
      if (!route) return res.status(401).json({ error: 'Acesso encerrado. Entre novamente.' })

      const fileId = req.query?.file
      if (fileId) {
        const file = await store.getFile(route.id, String(fileId))
        if (!file) return res.status(404).json({ error: 'Arquivo não encontrado' })
        res.setHeader('Content-Type', file.type)
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`)
        return res.status(200).send(file.data)
      }

      if (!route.lastAccess || Date.now() - route.lastAccess > HOUR_MS) await store.update(route.id, { lastAccess: Date.now() })
      return res.status(200).json({
        routeName: route.routeName,
        clientName: route.clientName,
        html: route.html,
        files: route.files,
        updatedAt: route.updatedAt,
      })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (err) {
    console.error('Erro em /api/minha-rota:', err)
    return res.status(500).json({ error: 'Erro no servidor' })
  }
}
