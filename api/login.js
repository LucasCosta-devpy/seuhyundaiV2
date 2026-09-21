import { createToken } from './_lib/auth.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' })

  const { password } = req.body || {}
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD não configurado no servidor' })
  }
  if (password !== adminPassword) {
    return res.status(401).json({ error: 'Senha incorreta' })
  }

  return res.status(200).json({ token: createToken() })
}
