import { getStore } from '@netlify/blobs'

export default async (request, context) => {
  const key = context.params.key
  if (!key) return new Response('Não encontrado', { status: 404 })

  const store = getStore({ name: 'images', consistency: 'strong' })
  const result = await store.getWithMetadata(key, { type: 'arrayBuffer' })
  if (!result) return new Response('Não encontrado', { status: 404 })

  const contentType = result.metadata?.contentType || 'application/octet-stream'
  return new Response(result.data, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

export const config = { path: '/api/image/:key' }
