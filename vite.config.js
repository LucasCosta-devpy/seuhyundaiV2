import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Só no dev local. Escrita em /api (salvar o site, upload) é recusada. As exceções são o login do admin
      // e as rotas dos clientes, que rodam aqui mesmo com os handlers de /api e guardam tudo num arquivo
      // local (.dev-data), sem tocar no banco do site no ar.
      name: 'api-local-seguro',
      configureServer(server) {
        process.env.ROTAS_STORE = 'file'
        process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'segredo-so-para-dev-local'
        process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'local'
        const locais = { '/login': '/api/login.js', '/rotas': '/api/rotas.js', '/minha-rota': '/api/minha-rota.js' }

        server.middlewares.use('/api', async (req, res, next) => {
          const url = new URL(req.url, 'http://localhost')
          const arquivo = locais[url.pathname]
          if (!arquivo) {
            if (req.method !== 'GET') {
              res.statusCode = 405
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Escrita desligada no ambiente local' }))
              return
            }
            return next()
          }
          try {
            const chunks = []
            for await (const chunk of req) chunks.push(chunk)
            const raw = Buffer.concat(chunks).toString('utf8')
            req.body = raw ? JSON.parse(raw) : {}
            req.query = Object.fromEntries(url.searchParams)
            res.status = (code) => {
              res.statusCode = code
              return res
            }
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(data))
            }
            res.send = (data) => res.end(data)
            const mod = await server.ssrLoadModule(arquivo)
            await mod.default(req, res)
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: String(err.message || err) }))
          }
        })
      },
    },
  ],
  server: {
    port: 3000,
    open: true,
    // Só pra desenvolvimento local: LÊ o conteúdo do site no ar (logo, textos...) e bloqueia qualquer
    // escrita (PUT/POST), então nada do que for feito localmente chega no site de verdade.
    proxy: {
      '/api/content': {
        target: 'https://www.rumomaisumarota.com.br',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
