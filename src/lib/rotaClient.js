// Área do cliente ("Sua rota"): login, leitura da rota e cópia guardada no aparelho (IndexedDB)
// pra abrir sem internet. O token do cliente é separado do token do admin.
const TOKEN_KEY = 'rmur_rota_token'
const DB_NAME = 'rmur-rota'
const STORE = 'kv'

export function getRotaToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setRotaToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // sem armazenamento (aba privada): o acesso vale só até fechar a página
  }
}

export function clearRotaToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignora
  }
}

async function api(path, options = {}) {
  const token = getRotaToken()
  const res = await fetch(`/api/minha-rota${path}`, {
    cache: 'no-store',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const err = new Error(body.error || `Erro (${res.status})`)
    err.status = res.status
    throw err
  }
  return res
}

export async function loginCliente(username, password) {
  const res = await api('', { method: 'POST', body: JSON.stringify({ username, password }) })
  return (await res.json()).token
}

export async function fetchRota() {
  return (await api('')).json()
}

export async function fetchArquivo(id) {
  return (await api(`?file=${encodeURIComponent(id)}`)).blob()
}

// ---- cópia no aparelho ----
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function run(mode, fn) {
  try {
    const db = await openDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode)
      const req = fn(tx.objectStore(STORE))
      tx.oncomplete = () => {
        db.close()
        resolve(req?.result)
      }
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    return undefined
  }
}

export const guardar = (key, value) => run('readwrite', (s) => s.put(value, key))
export const ler = (key) => run('readonly', (s) => s.get(key))
export const apagar = (key) => run('readwrite', (s) => s.delete(key))

export async function limparCopia() {
  await run('readwrite', (s) => s.clear())
  try {
    const keys = await caches.keys()
    await Promise.all(keys.filter((k) => k.startsWith('rmur-')).map((k) => caches.delete(k)))
  } catch {
    // ignora
  }
}

// Guarda a "casca" do site (página + scripts + estilos desta visita) pra "Sua rota" abrir sem internet
// já na primeira vez, sem esperar uma segunda visita. Mesmo nome de cache do public/sw.js.
export async function prepararOffline() {
  try {
    const cache = await caches.open('rmur-site-v1')
    const urls = performance
      .getEntriesByType('resource')
      .map((e) => e.name)
      .filter((u) => u.startsWith(window.location.origin) && !u.includes('/api/'))
    await Promise.all(urls.map((u) => cache.add(u).catch(() => {})))
    const page = await fetch('/', { cache: 'no-store' })
    if (page.ok) await cache.put('/index.html', page)
  } catch {
    // sem Cache API: segue só com a cópia da rota
  }
}
