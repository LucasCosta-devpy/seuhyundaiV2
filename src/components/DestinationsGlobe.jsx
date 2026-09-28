import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Globe from 'react-globe.gl'
import { slugify } from '../lib/slug.js'
import FeaturedTripsCarousel from './FeaturedTripsCarousel.jsx'

function getCityPhoto(city) {
  if (city.imageMode === 'carousel') {
    const first = (city.images || []).find((img) => (typeof img === 'string' ? img : img?.url))
    if (first) return typeof first === 'string' ? first : first.url
    return null
  }
  return city.imageUrl || null
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

// Pino de localização (formato de gota), estilo mapa, em vez do disco achatado padrão da lib.
function createPinElement(d, { size, onClick, onHoverChange }) {
  const wrapper = document.createElement('div')
  wrapper.style.cursor = 'pointer'
  wrapper.style.pointerEvents = 'auto'
  wrapper.style.transform = 'translate(-50%, -100%)'
  wrapper.style.width = `${size}px`

  wrapper.innerHTML = `
    <svg width="${size}" height="${size * 1.4}" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg" style="display:block; filter: drop-shadow(0 2px 3px rgba(0,0,0,.5));">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 22 12 22s12-13 12-22C24 5.373 18.627 0 12 0z" fill="#d4a53f" stroke="#101a2c" stroke-width="1"/>
      <circle cx="12" cy="12" r="5" fill="#101a2c"/>
    </svg>
    <div class="pin-tooltip" style="
      position:absolute; top:calc(100% + 6px); left:50%; transform:translateX(-50%);
      background:#fff; border-radius:8px; padding:6px; width:150px; text-align:left;
      font-family:sans-serif; font-size:12px; color:#101a2c; box-shadow:0 4px 12px rgba(0,0,0,.25);
      opacity:0; pointer-events:none; transition:opacity .15s; z-index:10;
    ">
      ${d.photoUrl ? `<img src="${d.photoUrl}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;display:block;margin-bottom:5px;" />` : ''}
      <strong>${d.name}</strong><br/>
      <span style="opacity:.7">${d.country} · ${d.region}</span>
    </div>
  `
  wrapper.style.position = 'relative'

  const tooltip = wrapper.querySelector('.pin-tooltip')
  wrapper.addEventListener('mouseenter', () => {
    tooltip.style.opacity = '1'
    onHoverChange(true)
  })
  wrapper.addEventListener('mouseleave', () => {
    tooltip.style.opacity = '0'
    onHoverChange(false)
  })
  wrapper.addEventListener('click', () => onClick(d))

  return wrapper
}

export default function DestinationsGlobe({ groups, compact = false }) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const globeRef = useRef(null)
  const [size, setSize] = useState({ width: 320, height: 320 })

  const points = useMemo(() => buildPoints(groups), [groups])

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      const h = compact ? Math.max(220, w * 0.9) : Math.min(560, Math.max(320, w * 0.72))
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
    globe.pointOfView({ lat: -10, lng: -45, altitude: 1.15 })
  }, [])

  if (points.length === 0) {
    return compact ? (
      <p className="text-xs text-gray-400">Nenhuma cidade com coordenadas cadastradas ainda — adicione latitude/longitude em alguma cidade pra ela aparecer aqui.</p>
    ) : null
  }

  const pinSize = compact ? 20 : 22

  const globeEl = (
    <div ref={containerRef} className={compact ? 'flex justify-center' : 'mx-auto mt-8 flex max-w-xl justify-center px-4 sm:px-6'}>
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="/globe/earth-blue-marble.jpg"
        htmlElementsData={points}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.01}
        htmlElement={(d) =>
          createPinElement(d, {
            size: pinSize,
            onClick: (point) => !compact && navigate(point.to),
            onHoverChange: (hovering) => {
              if (containerRef.current) containerRef.current.style.cursor = hovering ? 'pointer' : 'grab'
              if (globeRef.current) globeRef.current.controls().autoRotate = !hovering
            },
          })
        }
      />
    </div>
  )

  if (compact) return globeEl

  return (
    <section className="bg-navy-900 py-14">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="section-title !text-white">Nossas Viagens pelo Mundo</h2>
        <p className="mt-2 text-sm text-navy-200">{points.length} cidade{points.length === 1 ? '' : 's'} no mapa</p>
      </div>
      {globeEl}
      <FeaturedTripsCarousel groups={groups} />
    </section>
  )
}
