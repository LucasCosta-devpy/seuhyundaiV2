// Service worker do site: deixa a página "Sua rota" abrir sem internet.
// - Nunca guarda /api (a rota do cliente fica no IndexedDB do aparelho, não aqui).
// - Páginas: tenta a internet primeiro e, sem rede, usa a última cópia do site.
// - Arquivos com hash (/assets/*), imagens e logos: guarda na primeira visita.
const CACHE = 'rmur-site-v1'

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('rmur-site-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put('/index.html', copy))
          }
          return res
        })
        .catch(() => caches.match('/index.html').then((r) => r || Response.error())),
    )
    return
  }

  const fromNetwork = () =>
    fetch(req).then((res) => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(req, copy))
      }
      return res
    })

  // /assets/* tem hash no nome (nunca muda): cópia primeiro. O resto: internet primeiro, cópia se cair a rede.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(caches.match(req).then((cached) => cached || fromNetwork()))
  } else {
    event.respondWith(fromNetwork().catch(() => caches.match(req).then((r) => r || Response.error())))
  }
})
