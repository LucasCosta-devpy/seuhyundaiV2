import { createHmac, timingSafeEqual } from 'node:crypto'

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET não configurado')
  return secret
}

function sign(payload) {
  return createHmac('sha256', getSecret()).update(payload).digest('hex')
}

export function createToken() {
  const exp = Date.now() + THIRTY_DAYS_MS
  const payload = String(exp)
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false
  let expected
  try {
    expected = sign(payload)
  } catch {
    return false
  }
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  const exp = Number(payload)
  return Number.isFinite(exp) && exp > Date.now()
}

export function requireAuth(request) {
  const header = request.headers.get('authorization') || ''
  const token = header.replace(/^Bearer\s+/i, '')
  return verifyToken(token)
}

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    status: init.status || 200,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
}
