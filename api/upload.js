import { requireAuth } from './_lib/auth.js'
import { uploadImage, deleteImage } from './_lib/storage.js'

const MAX_BYTES = 5 * 1024 * 1024

export const config = {
  api: { bodyParser: { sizeLimit: '7mb' } },
}

export default async function handler(req, res) {
  try {
    if (!requireAuth(req)) return res.status(401).json({ error: 'Não autorizado' })

    if (req.method === 'DELETE') {
      const { url } = req.body || {}
      if (!url) return res.status(400).json({ error: 'URL de imagem inválida' })
      await deleteImage(url)
      return res.status(200).json({ ok: true })
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

    const { dataUrl, fileName } = req.body || {}
    const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl || '')
    if (!match) return res.status(400).json({ error: 'Arquivo inválido, envie uma imagem' })

    const contentType = match[1]
    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.length > MAX_BYTES) return res.status(400).json({ error: 'Imagem muito grande (máx. 5MB)' })

    const ext = (fileName || '').split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
    const url = await uploadImage(buffer, contentType, ext)

    return res.status(200).json({ url })
  } catch (err) {
    console.error('Erro em /api/upload:', err)
    return res.status(500).json({ error: 'Erro no servidor: ' + err.message })
  }
}
