import { createToken, json } from './_shared/auth.js'

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Método não permitido' }, { status: 405 })

  const { password } = await request.json().catch(() => ({}))
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return json({ error: 'ADMIN_PASSWORD não configurado no servidor' }, { status: 500 })
  }
  if (password !== adminPassword) {
    return json({ error: 'Senha incorreta' }, { status: 401 })
  }

  return json({ token: createToken() })
}

export const config = { path: '/api/login' }
