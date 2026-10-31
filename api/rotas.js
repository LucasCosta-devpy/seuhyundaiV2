import { randomUUID } from 'node:crypto'
import { requireAuth } from './_lib/auth.js'
import { rotasStore } from './_lib/rotasStore.js'
import { gerarSenha, hashSenha, slugUsuario } from './_lib/senha.js'

// Admin das rotas dos clientes (só com o token do admin). Tudo por POST { action, ... }.
// A senha do cliente só existe em texto puro na resposta de "create" e "reset-password";
// no banco fica apenas o hash.

const MAX_HTML = 2 * 1024 * 1024
const MAX_FILE = 3 * 1024 * 1024
const FILE_TYPES = {
  pdf: 'application/pdf',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export const config = {
  api: { bodyParser: { sizeLimit: '4.5mb' } },
}

function publicRoute(r) {
  return {
    id: r.id,
    routeName: r.routeName,
    clientName: r.clientName,
    username: r.username,
    revoked: r.revoked,
    lockedUntil: r.lockedUntil && r.lockedUntil > Date.now() ? r.lockedUntil : null,
    lastAccess: r.lastAccess,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    htmlSize: r.htmlSize ?? (r.html || '').length,
    files: r.files,
  }
}

const text = (v, max = 120) => String(v ?? '').trim().slice(0, max)

function checkHtml(html) {
  if (typeof html !== 'string' || !/<html|<body|<!doctype/i.test(html)) return 'Envie um arquivo HTML válido.'
  if (Buffer.byteLength(html) > MAX_HTML) return 'HTML muito grande (máx. 2 MB). Reduza imagens embutidas.'
  return null
}

function cleanUsername(v) {
  return slugUsuario(v)
}

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store')
    if (!requireAuth(req)) return res.status(401).json({ error: 'Não autorizado' })
    const store = rotasStore()

    if (req.method === 'GET') {
      const { id } = req.query || {}
      if (id) {
        const route = await store.get(String(id))
        if (!route) return res.status(404).json({ error: 'Rota não encontrada' })
        return res.status(200).json({ route: { ...publicRoute(route), html: route.html } })
      }
      return res.status(200).json({ routes: (await store.list()).map(publicRoute) })
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })
    const body = req.body || {}
    const { action } = body

    if (action === 'create') {
      const routeName = text(body.routeName)
      const clientName = text(body.clientName)
      if (!routeName || !clientName) return res.status(400).json({ error: 'Informe o nome da rota e o nome do cliente.' })
      const htmlError = checkHtml(body.html)
      if (htmlError) return res.status(400).json({ error: htmlError })
      const base = cleanUsername(body.username || clientName)
      const password = gerarSenha()
      const route = { id: randomUUID(), routeName, clientName, username: base, passwordHash: hashSenha(password), html: body.html }
      // Usuário repetido: acrescenta número (só quando o usuário não digitou um específico).
      for (let n = 0; ; n++) {
        route.username = n === 0 ? base : `${base}-${n + 1}`
        try {
          await store.insert(route)
          break
        } catch (err) {
          if (err.code !== '23505') throw err
          if (body.username) return res.status(409).json({ error: 'Esse usuário já existe. Escolha outro.' })
          if (n > 50) throw err
        }
      }
      return res.status(200).json({ route: publicRoute(await store.get(route.id)), password })
    }

    const route = body.id ? await store.get(String(body.id)) : null
    if (!route) return res.status(404).json({ error: 'Rota não encontrada' })

    if (action === 'update') {
      const patch = {}
      if (body.routeName !== undefined) patch.routeName = text(body.routeName)
      if (body.clientName !== undefined) patch.clientName = text(body.clientName)
      if (!patch.routeName && 'routeName' in patch) return res.status(400).json({ error: 'O nome da rota não pode ficar vazio.' })
      if (!patch.clientName && 'clientName' in patch) return res.status(400).json({ error: 'O nome do cliente não pode ficar vazio.' })
      if (body.html !== undefined) {
        const htmlError = checkHtml(body.html)
        if (htmlError) return res.status(400).json({ error: htmlError })
        patch.html = body.html
      }
      if (body.username !== undefined) {
        const username = cleanUsername(body.username)
        if (username !== route.username) {
          patch.username = username
          patch.tokenVersion = route.tokenVersion + 1 // trocar o usuário derruba os acessos abertos
        }
      }
      if (body.revoked !== undefined) {
        patch.revoked = !!body.revoked
        if (patch.revoked) patch.tokenVersion = route.tokenVersion + 1
      }
      try {
        await store.update(route.id, patch)
      } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: 'Esse usuário já existe. Escolha outro.' })
        throw err
      }
      return res.status(200).json({ route: publicRoute(await store.get(route.id)) })
    }

    if (action === 'reset-password') {
      const password = gerarSenha()
      await store.update(route.id, {
        passwordHash: hashSenha(password),
        tokenVersion: route.tokenVersion + 1, // derruba os acessos abertos com a senha antiga
        failedAttempts: 0,
        lockedUntil: null,
      })
      return res.status(200).json({ route: publicRoute(await store.get(route.id)), password })
    }

    if (action === 'delete') {
      await store.remove(route.id)
      return res.status(200).json({ ok: true })
    }

    if (action === 'add-file') {
      const fileName = text(body.fileName, 150)
      const ext = fileName.split('.').pop()?.toLowerCase() || ''
      const type = FILE_TYPES[ext]
      if (!type) return res.status(400).json({ error: 'Formato não aceito. Use PDF, PowerPoint, Word ou Excel.' })
      const match = /^data:[^;,]*;base64,(.+)$/.exec(body.dataUrl || '')
      if (!match) return res.status(400).json({ error: 'Arquivo inválido.' })
      const data = Buffer.from(match[1], 'base64')
      if (!data.length) return res.status(400).json({ error: 'Arquivo vazio.' })
      if (data.length > MAX_FILE) return res.status(400).json({ error: 'Arquivo muito grande (máx. 3 MB).' })
      await store.insertFile({ id: randomUUID(), routeId: route.id, name: fileName, type, size: data.length, data })
      return res.status(200).json({ route: publicRoute(await store.get(route.id)) })
    }

    if (action === 'delete-file') {
      await store.removeFile(route.id, String(body.fileId || ''))
      return res.status(200).json({ route: publicRoute(await store.get(route.id)) })
    }

    return res.status(400).json({ error: 'Ação inválida' })
  } catch (err) {
    console.error('Erro em /api/rotas:', err)
    return res.status(500).json({ error: 'Erro no servidor: ' + err.message })
  }
}
