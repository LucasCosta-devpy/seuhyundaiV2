const TOKEN_KEY = 'rmur_admin_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`/api/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || `Erro na requisição (${res.status})`)
  }
  return res.json()
}

export function login(password) {
  return request('login', { method: 'POST', body: JSON.stringify({ password }) })
}

export function getContent() {
  return request('content')
}

export function saveContent(content) {
  return request('content', { method: 'PUT', body: JSON.stringify(content) })
}

export async function uploadImage(file) {
  const dataUrl = await fileToDataUrl(file)
  const result = await request('upload', {
    method: 'POST',
    body: JSON.stringify({ fileName: file.name, dataUrl }),
  })
  return result.url
}

export function deleteImage(url) {
  return request('upload', { method: 'DELETE', body: JSON.stringify({ url }) })
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
