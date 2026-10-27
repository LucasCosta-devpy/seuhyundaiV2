import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor } from './Editable.jsx'
import { getLogoSize } from '../lib/logoSize.js'
import { removeBackground } from '../lib/removeBackground.js'

const PLAY_MS = 4300
const LAP_S = 3.9
const PLANE_PATH =
  'M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L21,16Z'

const num = (v, fallback) => (typeof v === 'number' && !Number.isNaN(v) ? v : fallback)

export function instagramUrl(brand) {
  const handle = (brand?.instagram || '').trim()
  if (!handle) return ''
  if (/^https?:\/\//i.test(handle)) return handle
  return `https://instagram.com/${handle.replace(/^@/, '')}`
}

// Endereço da logo a desenhar: na moldura livre, com o fundo claro removido (se ligado).
// Enquanto processa devolve null (a logo ainda não aparece) e, se falhar, usa a original.
function useLogoSrc(brand) {
  const wanted = brand.logoFrame !== 'circle' && brand.logoRemoveBg !== false && !!brand.logoUrl
  const tolerance = num(brand.logoBgTolerance, 28)
  const key = `${brand.logoUrl}|${tolerance}`
  const [result, setResult] = useState({ key: '', src: null })
  useEffect(() => {
    if (!wanted) return
    let cancelled = false
    removeBackground(brand.logoUrl, tolerance).then((src) => {
      if (!cancelled) setResult({ key, src: src || brand.logoUrl })
    })
    return () => {
      cancelled = true
    }
  }, [wanted, brand.logoUrl, tolerance, key])
  if (!wanted) return brand.logoUrl
  return result.key === key ? result.src : null
}

function HeaderLogo({ brand }) {
  const src = useLogoSrc(brand)
  if (!src) return <div className="h-10 w-10" />
  return <img src={src} alt={brand.name} className="h-10 w-auto max-w-[9rem] object-contain" />
}

// Moldura antiga: logo dentro de uma bola branca.
function CircleLogo({ brand, className }) {
  return (
    <div className={`overflow-hidden rounded-full bg-white ${className || ''}`}>
      <img
        src={brand.logoUrl}
        alt={brand.name}
        className="h-full w-full object-contain"
        style={{ transform: `translate(${brand.logoOffsetX || 0}%, ${brand.logoOffsetY || 0}%) scale(${(brand.logoScale || 100) / 100})` }}
      />
    </div>
  )
}

// Logo "livre" (sem bola): mostra a imagem como ela é, com a área do @ clicável (Instagram)
// e uma animação curta — Terra girando e avião dando uma volta — que roda ao passar o mouse e
// toda vez que a logo entra na tela. As áreas (globo e @) são em % da imagem e dá pra calibrar no admin.
function AnimatedLogo({ brand, className }) {
  const editing = !!useEditor()
  const logoSrc = useLogoSrc(brand)
  const wrapRef = useRef(null)
  const timer = useRef(null)
  const playingRef = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [playKey, setPlayKey] = useState(0)
  const [box, setBox] = useState({ w: 0, h: 0 })

  const animated = brand.logoAnimation !== false
  const reduced = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const link = brand.logoInstagramLink !== false ? instagramUrl(brand) : ''

  const play = useCallback(() => {
    if (!animated || reduced || playingRef.current) return
    playingRef.current = true
    setPlaying(true)
    setPlayKey((k) => k + 1)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      playingRef.current = false
      setPlaying(false)
    }, PLAY_MS)
  }, [animated, reduced])

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || !animated || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && play(), { threshold: 0.6 })
    io.observe(el)
    return () => io.disconnect()
  }, [animated, play])

  const gx = num(brand.logoGlobeX, 47.5)
  const gy = num(brand.logoGlobeY, 52)
  const gr = num(brand.logoGlobeR, 21.5)
  const lx = num(brand.logoLinkX, 20)
  const ly = num(brand.logoLinkY, 72.5)
  const lw = num(brand.logoLinkW, 56)
  const lh = num(brand.logoLinkH, 10)

  // Geometria da órbita do avião (em px, a partir do tamanho real da logo na tela).
  const { w, h } = box
  const cx = (gx / 100) * w
  const cy = (gy / 100) * h
  const R = (gr / 100) * w
  const rx = R * 1.34
  const ry = R * 0.52
  const rot = -18
  const rad = (rot * Math.PI) / 180
  const pt = (t) => {
    const x = rx * Math.cos(t)
    const y = ry * Math.sin(t)
    return [cx + x * Math.cos(rad) - y * Math.sin(rad), cy + x * Math.sin(rad) + y * Math.cos(rad)]
  }
  const [x0, y0] = pt(0)
  const [x1, y1] = pt(Math.PI)
  const arc = (a, b) => `M ${a[0].toFixed(1)} ${a[1].toFixed(1)} A ${rx.toFixed(1)} ${ry.toFixed(1)} ${rot} 0 1 ${b[0].toFixed(1)} ${b[1].toFixed(1)}`
  const front = arc([x0, y0], [x1, y1]) // metade de baixo: passa na frente da Terra
  const back = arc([x1, y1], [x0, y0]) // metade de cima: passa por trás
  const lap = `${front} A ${rx.toFixed(1)} ${ry.toFixed(1)} ${rot} 0 1 ${x0.toFixed(1)} ${y0.toFixed(1)}`
  const planeScale = (R * 0.42) / 24

  const layer = (side) => {
    const isFront = side === 'front'
    return (
      <svg
        key={`${side}-${playKey}`}
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className={`pointer-events-none absolute inset-0 overflow-visible ${isFront ? 'z-[3]' : 'z-[1]'}`}
        style={{ opacity: playing ? 1 : 0, transition: 'opacity .4s' }}
      >
        <path d={isFront ? front : back} fill="none" stroke="#d4a53f" strokeWidth="1.6" strokeDasharray="5 6" strokeLinecap="round">
          <animate attributeName="stroke-dashoffset" from="0" to="-110" dur={`${LAP_S}s`} />
        </path>
        <g opacity={isFront ? 1 : 0}>
          <animate attributeName="opacity" values={isFront ? '1;0' : '0;1'} keyTimes="0;0.5" dur={`${LAP_S}s`} calcMode="discrete" />
          <g transform={`scale(${planeScale}) translate(-12 -12) rotate(90 12 12)`}>
            <path d={PLANE_PATH} fill="#14234f" stroke="#ffffff" strokeWidth="1.1" strokeLinejoin="round" />
          </g>
          <animateMotion dur={`${LAP_S}s`} rotate="auto" path={lap} fill="freeze" />
        </g>
      </svg>
    )
  }

  const linkStyle = { left: `${lx}%`, top: `${ly}%`, width: `${lw}%`, height: `${lh}%` }

  return (
    <div
      ref={wrapRef}
      className={`group relative isolate block ${className || ''}`}
      style={{ transform: `translate(${brand.logoOffsetX || 0}%, ${brand.logoOffsetY || 0}%) scale(${(brand.logoScale || 100) / 100})` }}
      onMouseEnter={play}
      onClick={editing ? play : undefined}
    >
      {logoSrc ? (
        <img src={logoSrc} alt={brand.name} className="block h-auto w-full select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]" draggable={false} />
      ) : (
        <div className="aspect-square w-full" />
      )}

      {animated && w > 0 && (
        <>
          {layer('back')}
          <div
            className="pointer-events-none absolute z-[2] overflow-hidden rounded-full"
            style={{
              left: `${gx - gr}%`,
              top: `${gy}%`,
              width: `${gr * 2}%`,
              aspectRatio: '1',
              transform: 'translateY(-50%)',
              opacity: playing ? 1 : 0,
              transition: 'opacity .45s',
              boxShadow: 'inset 0 0 0 2px rgba(212,165,63,.9)',
            }}
          >
            <div
              key={playKey}
              className="h-full"
              style={{
                width: '400%',
                backgroundImage: 'url(/logo/earth-gold.png)',
                backgroundSize: '50% 100%',
                backgroundRepeat: 'repeat-x',
                animation: playing ? 'logoGlobeSpin 4.2s cubic-bezier(.35,0,.65,1) 1 forwards' : 'none',
              }}
            />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 33% 28%, rgba(255,255,255,.38), transparent 42%), radial-gradient(circle at 50% 50%, transparent 52%, rgba(5,12,40,.5) 100%)',
              }}
            />
          </div>
          {layer('front')}
        </>
      )}

      {link &&
        (editing ? (
          <span
            className="absolute z-[4] flex items-center justify-center rounded-full border border-dashed border-blue-500 bg-blue-500/15 text-[10px] font-semibold text-blue-700"
            style={linkStyle}
            title="Área clicável do Instagram (ajuste em Logo e contatos)"
          >
            Instagram
          </span>
        ) : (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir o Instagram ${brand.instagram || ''}`}
            title="Abrir o Instagram"
            className="absolute z-[4] rounded-full transition-all hover:bg-gold-400/15 hover:ring-2 hover:ring-gold-400/70"
            style={linkStyle}
          />
        ))}

      {editing && animated && (
        <span
          className="pointer-events-none absolute z-[4] rounded-full border border-dashed border-blue-500/70"
          style={{ left: `${gx - gr}%`, top: `${gy}%`, width: `${gr * 2}%`, aspectRatio: '1', transform: 'translateY(-50%)' }}
          title="Área do globo da animação"
        />
      )}
    </div>
  )
}

// Ponto único de desenho da logo: escolhe a moldura (livre ou redonda) e o tamanho.
// spacing = classes de margem; circleClassName = extras só da moldura redonda.
export function LogoMark({ brand, variant = 'hero', spacing = 'mb-8', circleClassName = '' }) {
  const circle = brand.logoFrame === 'circle'
  if (variant === 'header') return circle ? <CircleLogo brand={brand} className="h-10 w-10" /> : <HeaderLogo brand={brand} />
  const size = getLogoSize(brand.logoSize)
  if (circle) return <CircleLogo brand={brand} className={`mx-auto ${spacing} ${circleClassName} ${size.hero}`} />
  return <AnimatedLogo brand={brand} className={`mx-auto ${spacing} ${size.free}`} />
}
