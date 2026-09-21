import { put, del } from '@vercel/blob'
import { randomUUID } from 'node:crypto'

export async function uploadImage(buffer, contentType, ext) {
  const key = `${randomUUID()}.${ext}`
  const blob = await put(key, buffer, { access: 'public', contentType })
  return blob.url
}

export async function deleteImage(url) {
  if (!url) return
  await del(url)
}
