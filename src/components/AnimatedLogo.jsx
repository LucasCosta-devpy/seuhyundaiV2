import { useEffect, useState } from 'react'
import { getLogoSize } from '../lib/logoSize.js'
import { removeBackground } from '../lib/removeBackground.js'

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

// Globo do cabeçalho: a Terra dourada/azul girando sem parar (continentes andando da esquerda
// pra direita, como a rotação real) com o avião orbitando em sentido horário, ao lado do nome.
function HeaderGlobe() {
  const W = 56
  const H = 46
  const cx = W / 2
  const cy = H / 2
  const rx = 26
  const ry = 8.5
  const rot = -20
  const rad = (rot * Math.PI) / 180
  const pt = (t) => [cx + rx * Math.cos(t) * Math.cos(rad) - ry * Math.sin(t) * Math.sin(rad), cy + rx * Math.cos(t) * Math.sin(rad) + ry * Math.sin(t) * Math.cos(rad)]
  const [x0, y0] = pt(0)
  const [x1, y1] = pt(Math.PI)
  const f = (n) => n.toFixed(1)
  const half = (a, b) => `M ${f(a[0])} ${f(a[1])} A ${rx} ${ry} ${rot} 0 1 ${f(b[0])} ${f(b[1])}`
  const front = half([x0, y0], [x1, y1])
  const back = half([x1, y1], [x0, y0])
  const lap = `${front} A ${rx} ${ry} ${rot} 0 1 ${f(x0)} ${f(y0)}`
  const DUR = 7
  const layer = (isFront) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={`pointer-events-none absolute inset-0 ${isFront ? 'z-[3]' : 'z-[1]'}`} aria-hidden="true">
      <path d={isFront ? front : back} fill="none" stroke="#d4a53f" strokeOpacity="0.75" strokeWidth="1" strokeDasharray="2.5 3" strokeLinecap="round" />
      <g opacity={isFront ? 1 : 0}>
        <animate attributeName="opacity" values={isFront ? '1;0' : '0;1'} keyTimes="0;0.5" dur={`${DUR}s`} calcMode="discrete" repeatCount="indefinite" />
        <g transform="scale(0.42) translate(-12 -12) rotate(90 12 12)">
          <path d={PLANE_PATH} fill="#f2c94c" stroke="#14234f" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke" />
        </g>
        <animateMotion dur={`${DUR}s`} rotate="auto" path={lap} repeatCount="indefinite" />
      </g>
    </svg>
  )
  return (
    <div className="relative isolate flex-shrink-0" style={{ width: W, height: H }} aria-hidden="true">
      {layer(false)}
      <div className="absolute left-1/2 top-1/2 z-[2] h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full" style={{ boxShadow: '0 0 0 1.5px #d4a53f' }}>
        <div
          className="h-full"
          style={{
            width: '400%',
            backgroundImage: 'url(/logo/earth-gold.png)',
            backgroundSize: '50% 100%',
            backgroundRepeat: 'repeat-x',
            animation: 'logoGlobeSpin 14s linear infinite reverse',
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle at 33% 28%, rgba(255,255,255,.4), transparent 45%), radial-gradient(circle at 50% 50%, transparent 55%, rgba(5,12,40,.45) 100%)' }}
        />
      </div>
      {layer(true)}
    </div>
  )
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

// Logo "livre" (sem bola branca): a imagem como ela é, com o fundo claro removido.
function FreeLogo({ brand, className }) {
  const src = useLogoSrc(brand)
  return (
    <div
      className={`relative block ${className || ''}`}
      style={{ transform: `translate(${brand.logoOffsetX || 0}%, ${brand.logoOffsetY || 0}%) scale(${(brand.logoScale || 100) / 100})` }}
    >
      {src ? (
        <img src={src} alt={brand.name} className="block h-auto w-full select-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]" draggable={false} />
      ) : (
        <div className="aspect-square w-full" />
      )}
    </div>
  )
}

// Ponto único de desenho da logo. No cabeçalho vai a Terra girando; no topo da página a logo
// grande (livre ou redonda). spacing = classes de margem; circleClassName = extras da moldura redonda.
export function LogoMark({ brand, variant = 'hero', spacing = 'mb-8', circleClassName = '' }) {
  if (variant === 'header') return <HeaderGlobe />
  const size = getLogoSize(brand.logoSize)
  if (brand.logoFrame === 'circle') return <CircleLogo brand={brand} className={`mx-auto ${spacing} ${circleClassName} ${size.hero}`} />
  return <FreeLogo brand={brand} className={`mx-auto ${spacing} ${size.free}`} />
}
