import { useEffect, useRef, useState } from 'react'

const PREVIEW_W = 360
const EXPORT_W = 1000

export default function ImageCropEditor({ src, aspectRatio = 1, shape = 'rect', fit = 'contain', onConfirm, onCancel }) {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const dragRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [scale, setScale] = useState(1)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [baseScale, setBaseScale] = useState(1)
  const [saving, setSaving] = useState(false)

  const previewH = Math.round(PREVIEW_W / aspectRatio)

  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      imgRef.current = img
      // "contain": a imagem inteira cabe no quadro, sem cortar nada (pode sobrar espaço vazio nas bordas)
      // "cover": preenche o quadro inteiro, cortando o excesso (sem sobrar espaço vazio)
      const bs = fit === 'cover' ? Math.max(PREVIEW_W / img.width, previewH / img.height) : Math.min(PREVIEW_W / img.width, previewH / img.height)
      const w = img.width * bs
      const h = img.height * bs
      setBaseScale(bs)
      setScale(1)
      setPos({ x: (PREVIEW_W - w) / 2, y: (previewH - h) / 2 })
      setReady(true)
    }
    img.src = src
    return () => {
      cancelled = true
    }
  }, [src])

  useEffect(() => {
    draw()
  }, [scale, pos, ready])

  function draw() {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img) return
    canvas.width = PREVIEW_W
    canvas.height = previewH
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, PREVIEW_W, previewH)
    const w = img.width * baseScale * scale
    const h = img.height * baseScale * scale
    ctx.drawImage(img, pos.x, pos.y, w, h)
  }

  function clampPos(next, currentScale) {
    const img = imgRef.current
    if (!img) return next
    const w = img.width * baseScale * currentScale
    const h = img.height * baseScale * currentScale
    // se a imagem é menor que o quadro numa dimensão, centraliza nela (não deixa arrastar à toa)
    const x = w <= PREVIEW_W ? (PREVIEW_W - w) / 2 : Math.min(0, Math.max(PREVIEW_W - w, next.x))
    const y = h <= previewH ? (previewH - h) / 2 : Math.min(0, Math.max(previewH - h, next.y))
    return { x, y }
  }

  function handlePointerDown(e) {
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPos: pos }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function handlePointerMove(e) {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    const next = { x: dragRef.current.startPos.x + dx, y: dragRef.current.startPos.y + dy }
    setPos(clampPos(next, scale))
  }
  function handlePointerUp() {
    dragRef.current = null
  }

  function handleScaleChange(newScale) {
    setScale(newScale)
    setPos((p) => clampPos(p, newScale))
  }

  function handleConfirm() {
    const img = imgRef.current
    if (!img) return
    setSaving(true)
    const exportH = Math.round(EXPORT_W / aspectRatio)
    const factor = EXPORT_W / PREVIEW_W
    const canvas = document.createElement('canvas')
    canvas.width = EXPORT_W
    canvas.height = exportH
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, EXPORT_W, exportH)
    const w = img.width * baseScale * scale * factor
    const h = img.height * baseScale * scale * factor
    ctx.drawImage(img, pos.x * factor, pos.y * factor, w, h)
    canvas.toBlob(
      (blob) => {
        setSaving(false)
        if (blob) onConfirm(blob)
      },
      'image/jpeg',
      0.88
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="mb-1 font-serif text-lg font-bold text-navy-900">Ajustar imagem</h3>
        <p className="mb-3 text-xs text-gray-400">
          {fit === 'cover'
            ? 'A imagem já começa preenchendo o quadro inteiro. Use o zoom e arraste pra ajustar o enquadramento.'
            : 'A imagem começa inteira, sem cortar nada. Se quiser aproximar/cortar, use o zoom e arraste pra posicionar.'}
        </p>

        {ready ? (
          <div
            className={`mx-auto overflow-hidden border border-gray-200 bg-gray-100 ${shape === 'circle' ? 'rounded-full' : 'rounded-lg'}`}
            style={{ width: PREVIEW_W, height: previewH, touchAction: 'none' }}
          >
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="cursor-move"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center py-10 text-sm text-gray-400" style={{ width: PREVIEW_W, height: previewH }}>
            Carregando imagem…
          </div>
        )}

        <div className="mt-4">
          <p className="label !mb-2">Zoom</p>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={scale}
            onChange={(e) => handleScaleChange(Number(e.target.value))}
            disabled={!ready}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Imagem inteira</span>
            <span>Aproximar / cortar</span>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="button" onClick={handleConfirm} disabled={!ready || saving} className="btn-navy !py-2 !px-4 text-sm">
            {saving ? 'Salvando…' : 'Usar esta imagem'}
          </button>
        </div>
      </div>
    </div>
  )
}
