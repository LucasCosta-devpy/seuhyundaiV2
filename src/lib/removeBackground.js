// Deixa transparente o fundo claro de uma logo (ex.: quadrado branco em volta de um adesivo),
// preenchendo a partir das bordas. O miolo branco da logo fica, porque o contorno dela
// bloqueia o preenchimento. Roda no navegador; se a imagem não puder ser lida
// (CORS), devolve null e o site usa a imagem original.
const cache = new Map()

export function removeBackground(url, tolerance = 28) {
  const key = `${url}|${tolerance}`
  if (!cache.has(key)) cache.set(key, run(url, tolerance))
  return cache.get(key)
}

function run(url, tolerance) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const maxSide = 900
        const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight))
        const w = Math.round(img.naturalWidth * scale)
        const h = Math.round(img.naturalHeight * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        ctx.drawImage(img, 0, 0, w, h)
        const data = ctx.getImageData(0, 0, w, h)
        const px = data.data

        // cor do fundo = média dos 4 cantos
        const corners = [0, (w - 1) * 4, (h - 1) * w * 4, ((h - 1) * w + (w - 1)) * 4]
        const bg = [0, 0, 0]
        for (const c of corners) for (let k = 0; k < 3; k++) bg[k] += px[c + k] / 4
        const dist = (i) => Math.hypot(px[i] - bg[0], px[i + 1] - bg[1], px[i + 2] - bg[2])

        const removed = new Uint8Array(w * h)
        const stack = []
        const push = (x, y) => {
          const p = y * w + x
          if (removed[p]) return
          if (dist(p * 4) <= tolerance) {
            removed[p] = 1
            stack.push(p)
          }
        }
        for (let x = 0; x < w; x++) {
          push(x, 0)
          push(x, h - 1)
        }
        for (let y = 0; y < h; y++) {
          push(0, y)
          push(w - 1, y)
        }
        while (stack.length) {
          const p = stack.pop()
          const x = p % w
          const y = (p - x) / w
          if (x > 0) push(x - 1, y)
          if (x < w - 1) push(x + 1, y)
          if (y > 0) push(x, y - 1)
          if (y < h - 1) push(x, y + 1)
        }

        // borda suave: pixel da logo encostado no fundo removido fica semitransparente se for quase da cor do fundo
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const p = y * w + x
            if (removed[p]) {
              px[p * 4 + 3] = 0
              continue
            }
            const touches =
              (x > 0 && removed[p - 1]) || (x < w - 1 && removed[p + 1]) || (y > 0 && removed[p - w]) || (y < h - 1 && removed[p + w])
            if (!touches) continue
            const d = dist(p * 4)
            const soft = tolerance * 2.4
            if (d < soft) px[p * 4 + 3] = Math.round(255 * Math.max(0, Math.min(1, (d - tolerance) / (soft - tolerance))))
          }
        }
        ctx.putImageData(data, 0, 0)
        canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : null), 'image/png')
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = url
  })
}
