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

  const points = useMemo(() => buildPoints(groups), [groups])

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

  const globeEl = (
    <div ref={containerRef} className={compact ? 'relative flex justify-center' : 'relative mx-auto mt-8 flex max-w-xl justify-center px-4 sm:px-6'}>
      {!compact && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(circle, rgba(58,107,219,0.35), transparent 65%)' }}
        />
      )}
      {!compact && <OrbitPlane />}
      <div className="relative z-10">
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          showAtmosphere
          atmosphereColor="#5f8fe0"
          atmosphereAltitude={0.22}
          globeImageUrl="/globe/earth-blue-marble.jpg"
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => '#d4a53f'}
          pointAltitude={0.02}
          pointRadius={compact ? 0.35 : 0.55}
          pointLabel={(d) => `<div style="font-family:sans-serif;padding:6px;max-width:160px;">
            ${d.photoUrl ? `<img src="${d.photoUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;display:block;margin-bottom:6px;" />` : ''}
            <strong>${d.name}</strong><br/>
            <span style="opacity:.8">${d.country} · ${d.region}</span>
          </div>`}
          onPointClick={(d) => !compact && navigate(d.to)}
          onPointHover={(d) => {
            if (containerRef.current) containerRef.current.style.cursor = d ? 'pointer' : 'grab'
            if (globeRef.current) globeRef.current.controls().autoRotate = !d
          }}
        />
      </div>
    </div>
  )

  if (compact) return globeEl

  return (
    <section className="bg-navy-900 py-14">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="section-title !text-white">
          Lugares Que Já <span className="text-gold-400">Conhecemos</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-navy-200">Gire o globo e clique em um ponto para conhecer o destino.</p>
      </div>
      {globeEl}
    </section>
  )
}

// Avião decorativo orbitando o globo numa trajetória tracejada — só efeito visual, não interativo.
function OrbitPlane() {
  return (
    <svg
      viewBox="0 0 400 400"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <path id="orbit-path" d="M -57.5,236.2 A 260,90 -8 1,1 457.5,163.8 A 260,90 -8 1,1 -57.5,236.2 Z" />
      </defs>
      <use href="#orbit-path" fill="none" stroke="#d4a53f" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="6 8" />
      <g>
        <g transform="translate(-12,-12) rotate(90 12 12)">
          <path
            d="M21,16V14L13,9V3.5C13,2.67 12.33,2 11.5,2C10.67,2 10,2.67 10,3.5V9L2,14V16L10,13.5V19L7.5,20.5V22L11.5,21L15.5,22V20.5L13,19V13.5L21,16Z"
            fill="#f0c869"
            style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.5))' }}
          />
        </g>
        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" path="M -57.5,236.2 A 260,90 -8 1,1 457.5,163.8 A 260,90 -8 1,1 -57.5,236.2 Z" />
      </g>
    </svg>
  )
}
