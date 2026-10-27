import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      // Só no dev local: qualquer escrita em /api (salvar, login, upload) é recusada.
      name: 'bloquear-escrita-local',
      configureServer(server) {
        server.middlewares.use('/api', (req, res, next) => {
          if (req.method !== 'GET') {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Escrita desligada no ambiente local' }))
            return
          }
          next()
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
