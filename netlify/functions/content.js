import { requireAuth, json } from './_shared/auth.js'
import { readContent, writeContent } from './_shared/db.js'

export default async (request) => {
  try {
    if (request.method === 'GET') {
      const data = await readContent()
      return json(data)
    }

    if (request.method === 'PUT') {
      if (!requireAuth(request)) return json({ error: 'Não autorizado' }, { status: 401 })
      const data = await request.json().catch(() => null)
      if (!data || typeof data !== 'object') return json({ error: 'Conteúdo inválido' }, { status: 400 })
      await writeContent(data)
      return json({ ok: true })
    }

    return json({ error: 'Método não permitido' }, { status: 405 })
  } catch (err) {
    console.error('Erro em /api/content:', err)
    return json({ error: 'Erro no servidor: ' + err.message }, { status: 500 })
  }
}

export const config = { path: '/api/content' }
