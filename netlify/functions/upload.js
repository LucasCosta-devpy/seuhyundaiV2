import { getStore } from '@netlify/blobs'
import { randomUUID } from 'node:crypto'
import { requireAuth, json } from './_shared/auth.js'

const MAX_BYTES = 5 * 1024 * 1024

export default async (request) => {
  if (!requireAuth(request)) return json({ error: 'Não autorizado' }, { status: 401 })

  if (request.method === 'DELETE') {
    const { url } = await request.json().catch(() => ({}))
    const key = (url || '').split('/api/image/')[1]
    if (!key) return json({ error: 'URL de imagem inválida' }, { status: 400 })

    const store = getStore({ name: 'images', consistency: 'strong' })
    await store.delete(key)
    return json({ ok: true })
  }

  if (request.method !== 'POST') return json({ error: 'Método não permitido' }, { status: 405 })

  const { dataUrl, fileName } = await request.json().catch(() => ({}))
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl || '')
  if (!match) return json({ error: 'Arquivo inválido, envie uma imagem' }, { status: 400 })

  const contentType = match[1]
  const buffer = Buffer.from(match[2], 'base64')
  if (buffer.length > MAX_BYTES) return json({ error: 'Imagem muito grande (máx. 5MB)' }, { status: 400 })

  const ext = (fileName || '').split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const key = `${randomUUID()}.${ext}`

  const store = getStore({ name: 'images', consistency: 'strong' })
  await store.set(key, buffer, { metadata: { contentType } })

  return json({ url: `/api/image/${key}` })
}

export const config = { path: '/api/upload' }
