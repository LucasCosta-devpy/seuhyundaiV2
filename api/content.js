import { requireAuth } from './_lib/auth.js'
import { readContent, writeContent } from './_lib/db.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const data = await readContent()
      return res.status(200).json(data)
    }

    if (req.method === 'PUT') {
      if (!requireAuth(req)) return res.status(401).json({ error: 'Não autorizado' })
      const data = req.body
      if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Conteúdo inválido' })
      await writeContent(data)
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Método não permitido' })
  } catch (err) {
    console.error('Erro em /api/content:', err)
    return res.status(500).json({ error: 'Erro no servidor: ' + err.message })
  }
}
