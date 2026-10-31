import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto'

// Sem 0/O, 1/I/L pra não confundir quando o cliente digita no celular.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

// Senha legível em 3 grupos de 4: K7M2-Q9XP-4TRN (60 bits de aleatoriedade).
export function gerarSenha() {
  const pick = () => Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
  return `${pick()}-${pick()}-${pick()}`
}

// Maiúsculas e sem traço/espaço: "k7m2 q9xp-4trn" vale igual a "K7M2-Q9XP-4TRN".
export function normalizarSenha(senha) {
  return String(senha || '').toUpperCase().replace(/[\s-]/g, '')
}

export function hashSenha(senha) {
  const salt = randomBytes(16)
  const hash = scryptSync(normalizarSenha(senha), salt, 32)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

// Compara em tempo constante. Com hash vazio (usuário inexistente) ainda gasta o mesmo tempo.
const DUMMY = hashSenha('dummy-dummy-dummy')
export function conferirSenha(senha, armazenado) {
  const [, saltHex, hashHex] = String(armazenado || DUMMY).split('$')
  const expected = Buffer.from(hashHex, 'hex')
  const got = scryptSync(normalizarSenha(senha), Buffer.from(saltHex, 'hex'), 32)
  return !!armazenado && expected.length === got.length && timingSafeEqual(expected, got)
}

export function slugUsuario(texto) {
  return (
    String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 30) || 'cliente'
  )
}
