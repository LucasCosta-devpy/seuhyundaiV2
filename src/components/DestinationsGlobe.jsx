import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Globe from 'react-globe.gl'
import { slugify } from '../lib/slug.js'

function getCityPhoto(city) {
  if (city.imageMode === 'carousel') {
    const first = (city.images || []).find((img) => (typeof img === 'string' ? img : img?.url))
    if (first) return typeof first === 'string' ? first : first.url
    return null
  }
  return city.imageUrl || null
}

let pinStylesInjected = false
function ensurePinStyles() {
  if (pinStylesInjected || typeof document === 'undefined') return
  pinStylesInjected = true
  const style = document.createElement('style')
  style.textContent = `
    @keyframes globePinPulse {
      0%, 100% { transform: translate(-50%, 0) scale(0.85); opacity: 0.7; }
      50% { transform: translate(-50%, 0) scale(1.2); opacity: 1; }
    }
  `
  document.head.appendChild(style)
}

function safeDomId(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '')
}

// Pino de mapa com brilho dourado pulsante + balão (foto/nome) que pode ser
// mostrado tanto no hover do mouse quanto automaticamente (destaque em rodízio).
function createPinElement(d, { size, onClick, onHoverChange, registerTooltip }) {
  const wrapper = document.createElement('div')
  wrapper.style.cursor = 'pointer'
  wrapper.style.pointerEvents = 'auto'
  wrapper.style.transform = 'translate(-50%, -100%)'
  wrapper.style.width = `${size}px`
  wrapper.style.position = 'relative'

  const glowSize = size * 2.4
  const gradId = `pinGrad-${safeDomId(d.to)}`

  wrapper.innerHTML = `
    <div style="
      position:absolute; left:50%; bottom:1px; width:${glowSize}px; height:${glowSize}px;
      transform:translate(-50%, 0); border-radius:50%; pointer-events:none;
      background:radial-gradient(circle, rgba(255,214,110,0.9) 0%, rgba(255,186,60,0.4) 35%, transparent 72%);
      filter:blur(1px); animation: globePinPulse 2.4s ease-in-out infinite;
    "></div>
    <svg width="${size}" height="${size * 1.4}" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" style="position:relative; display:block; filter: drop-shadow(0 0 5px rgba(255,195,60,.85)) drop-shadow(0 2px 3px rgba(0,0,0,.45));">
      <defs>
        <radialGradient id="${gradId}" cx="35%" cy="28%" r="75%">
          <stop offset="0%" stop-color="#fff6da"/>
          <stop offset="45%" stop-color="#ffd35c"/>
          <stop offset="100%" stop-color="#d98f16"/>
        </radialGradient>
      </defs>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 22 12 22s12-13 12-22C24 5.373 18.627 0 12 0z" fill="url(#${gradId})" stroke="#8a5a0f" stroke-width="0.6"/>
      <circle cx="12" cy="12" r="4" fill="#fffaf0"/>
    </svg>
    <div class="pin-tooltip" style="
      position:absolute; top:calc(100% + 6px); left:50%; transform:translateX(-50%);
      background:#fff; border-radius:8px; padding:6px; width:150px; text-align:left;
      font-family:sans-serif; font-size:12px; color:#101a2c; box-shadow:0 4px 12px rgba(0,0,0,.25);
      opacity:0; pointer-events:none; transition:opacity .2s; z-index:10;
    ">
      ${d.photoUrl ? `<img src="${d.photoUrl}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;display:block;margin-bottom:5px;" />` : ''}
      <strong>${d.name}</strong><br/>
      <span style="opacity:.7">${d.country} · ${d.region}</span>
    </div>
  `

  const tooltip = wrapper.querySelector('.pin-tooltip')
  registerTooltip(d.to, tooltip)

  wrapper.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1'
    onHoverChange(true, d.to)
  })
  wrapper.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0'
    onHoverChange(false, d.to)
  })
  wrapper.addEventListener('click', () => onClick(d))

  return wrapper
}

// Um ponto por cidade com latitude/longitude cadastradas no admin.
// Cidade sem coordenada simplesmente não entra no globo.
function buildPoints(groups) {
  const points = []
  for (const group of groups || []) {
    for (const country of group.items || []) {
      if (!country.name) continue
      for (const city of country.subregions || []) {
        if (!city.name) continue
        const lat = Number(city.lat)
        const lng = Number(city.lng)
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue
        points.push({
          lat,
          lng,
          name: city.name,
          country: country.name,
          region: group.region,
          photoUrl: getCityPhoto(city),
          to: `/destinos/${slugify(group.region)}/${slugify(country.name)}/${slugify(city.name)}`,
        })
      }
    }
  }
  return points
}

export default function DestinationsGlobe({ groups, compact = false }) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const globeRef = useRef(null)
  const [size, setSize] = useState({ width: 320, height: 320 })
  const tooltipsRef = useRef({})
  const hoveringRef = useRef(false)
  const autoIndexRef = useRef(-1)

  const points = useMemo(() => buildPoints(groups), [groups])

  useEffect(() => {
    ensurePinStyles()
  }, [])

  // Destaque automático: enquanto ninguém está com o mouse em cima, vai
  // revezando a foto de cada cidade sozinho, sem precisar passar o mouse.
  useEffect(() => {
    if (compact || points.length === 0) return
    const id = setInterval(() => {
      if (hoveringRef.current) return
      const prev = points[autoIndexRef.current]
      if (prev && tooltipsRef.current[prev.to]) tooltipsRef.current[prev.to].style.opacity = '0'
      autoIndexRef.current = (autoIndexRef.current + 1) % points.length
      const next = points[autoIndexRef.current]
      if (next && tooltipsRef.current[next.to]) tooltipsRef.current[next.to].style.opacity = '1'
    }, 2800)
    return () => clearInterval(id)
  }, [points, compact])

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = compact ? Math.max(220, w * 0.9) : Math.min(560, w * 1.15)
      setSize({ width: w, height: h })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [compact])

  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.2
    // Zoom por scroll desligado: perto do globo, o mouse ficaria "roubando"
    // o scroll da página inteira. Ainda dá pra girar arrastando com o mouse.
    globe.controls().enableZoom = false
    globe.pointOfView({ lat: -10, lng: -45, altitude: 1.4 })
  }, [])

  if (points.length === 0) {
    return compact ? (
      <p className="text-xs text-gray-400">Nenhuma cidade com coordenadas cadastradas ainda — adicione latitude/longitude em alguma cidade pra ela aparecer aqui.</p>
    ) : null
  }

  const pinSize = compact ? 20 : 26

  const globeEl = (
    <div ref={containerRef} className={compact ? 'relative flex justify-center' : 'relative mx-auto mt-8 flex max-w-xl justify-center px-4 sm:px-6'}>
      {!compact && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(circle closest-side, rgba(58,107,219,0.35), transparent 100%)' }}
        />
      )}
      {!compact && <OrbitLayer side="back" />}
      <div className="relative z-10">
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          showAtmosphere={false}
          globeImageUrl="/globe/earth-blue-marble.jpg"
          htmlElementsData={points}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude={0.01}
          htmlElement={(d) =>
            createPinElement(d, {
              size: pinSize,
              onClick: (point) => !compact && navigate(point.to),
              registerTooltip: (key, el) => {
                tooltipsRef.current[key] = el
              },
              onHoverChange: (hovering, key) => {
                hoveringRef.current = hovering
                if (containerRef.current) containerRef.current.style.cursor = hovering ? 'pointer' : 'grab'
                if (globeRef.current) globeRef.current.controls().autoRotate = !hovering
                if (hovering) {
                  Object.entries(tooltipsRef.current).forEach(([otherKey, el]) => {
                    if (otherKey !== key && el) el.style.opacity = '0'
                  })
                }
              },
            })
          }
        />
      </div>
      {!compact && <OrbitLayer side="front" />}
    </div>
  )

  if (compact) return globeEl

  return (
    <section
      className="relative overflow-hidden py-14"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #2a4d8f 0%, #16305f 35%, #0d1f42 65%, #081530 100%)',
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{
        background:
          'radial-gradient(circle at 8% 85%, rgba(255,255,255,0.10), transparent 30%), radial-gradient(circle at 92% 80%, rgba(255,255,255,0.08), transparent 30%)',
      }} />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <CompassDivider />
        <h2 className="section-title !text-white">
          Lugares Que Já <span className="text-gold-400">Conhecemos</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-navy-200">Gire o globo e clique em um ponto para conhecer o destino.</p>
      </div>
      {globeEl}
    </section>
  )
}

function CompassDivider() {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-16 bg-gold-400/70 sm:w-24" />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#d4a53f" strokeWidth="1" />
        <path d="M12 2 L14 12 L12 22 L10 12 Z" fill="#d4a53f" />
        <path d="M2 12 L12 10 L22 12 L12 14 Z" fill="#d4a53f" opacity="0.6" />
      </svg>
      <span className="h-px w-16 bg-gold-400/70 sm:w-24" />
    </div>
  )
}

// Órbita tracejada com avião ao redor do globo, em duas camadas (frente/trás) pra dar
// a ilusão de profundidade: metade do caminho passa por cima da esfera (perto/frente),
// a outra metade some atrás dela (longe/atrás) e reaparece do outro lado.
const ORBIT_FULL_PATH = 'M -57.5,236.2 A 260,90 -8 1,1 457.5,163.8 A 260,90 -8 1,1 -57.5,236.2 Z'
// Mesma elipse, mas só a metade de baixo (frente) e só a metade de cima (trás).
const ORBIT_FRONT_ARC = 'M -57.5,236.2 A 260,90 -8 0,1 457.5,163.8'
const ORBIT_BACK_ARC = 'M 457.5,163.8 A 260,90 -8 0,1 -57.5,236.2'

const PLANE_ICON_PATH =
  'M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L21,16Z'

function OrbitLayer({ side }) {
  const isFront = side === 'front'
  const arc = isFront ? ORBIT_FRONT_ARC : ORBIT_BACK_ARC
  // O avião percorre a elipse inteira em 14s; a primeira metade do tempo ele está
  // na metade de baixo (frente), a segunda metade na metade de cima (trás) — dividido
  // exatamente ao meio porque a elipse é simétrica, então a troca de opacidade bate
  // certinho com o ponto em que ele cruza de uma camada pra outra.
  const opacityValues = isFront ? '1;0' : '0;1'
  return (
    <svg
      viewBox="0 0 400 400"
      className={`pointer-events-none absolute inset-0 h-full w-full ${isFront ? 'z-20' : 'z-0'}`}
      style={{ overflow: 'visible' }}
    >
      <path d={arc} fill="none" stroke="#d4a53f" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="6 8" />
      <g opacity={isFront ? 1 : 0}>
        <animate attributeName="opacity" values={opacityValues} keyTimes="0;0.5" dur="14s" repeatCount="indefinite" calcMode="discrete" />
        <g transform="translate(-12,-12) rotate(90 12 12)">
          <path d={PLANE_ICON_PATH} fill="#f0c869" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.5))' }} />
        </g>
        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" path={ORBIT_FULL_PATH} />
      </g>
    </svg>
  )
}
