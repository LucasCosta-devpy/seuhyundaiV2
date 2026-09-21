import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'node:crypto'

const BUCKET = 'images'
let client

function getClient() {
  if (!client) {
    const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
    if (!url || !key) throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY não configurados')
    client = createClient(url, key)
  }
  return client
}

export async function uploadImage(buffer, contentType, ext) {
  const supabase = getClient()
  const key = `${randomUUID()}.${ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(key, buffer, { contentType, upsert: false })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(key)
  return data.publicUrl
}

export async function deleteImage(url) {
  const supabase = getClient()
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = (url || '').indexOf(marker)
  if (idx === -1) return
  const key = url.slice(idx + marker.length)
  if (!key) return
  await supabase.storage.from(BUCKET).remove([key])
}
