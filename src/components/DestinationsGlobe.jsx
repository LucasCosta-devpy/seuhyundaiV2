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
    globe.pointOfView({ lat: -10, lng: -45, altitude: 2.2 })
  }, [])

  if (points.length === 0) {
    return compact ? (
      <p className="text-xs text-gray-400">Nenhuma cidade com coordenadas cadastradas ainda — adicione latitude/longitude em alguma cidade pra ela aparecer aqui.</p>
    ) : null
  }

  const globeEl = (
    <div ref={containerRef} className={compact ? 'flex justify-center' : 'mx-auto mt-8 flex max-w-4xl justify-center px-4 sm:px-6'}>
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
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
  )

  if (compact) return globeEl

  return (
    <section className="bg-navy-900 py-14">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="section-title !text-white">Todos os Lugares Que Já Fomos</h2>
        <p className="mx-auto mt-3 max-w-xl text-navy-200">
          Gira o globo e clica num ponto pra conhecer o destino. {points.length} cidade{points.length === 1 ? '' : 's'} no mapa.
        </p>
      </div>
      {globeEl}
    </section>
  )
}
