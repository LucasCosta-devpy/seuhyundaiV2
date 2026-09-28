import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Globe from 'react-globe.gl'
import { slugify } from '../lib/slug.js'
import { getCountryCoords } from '../lib/countryCoords.js'

// Foto de capa do país; se não tiver, usa a primeira foto de alguma cidade dele.
function getCountryPhoto(country) {
  if (country.coverUrl) return country.coverUrl
  for (const city of country.subregions || []) {
    if (!city.name) continue
    if (city.imageMode === 'carousel') {
      const first = (city.images || []).find((img) => (typeof img === 'string' ? img : img?.url))
      if (first) return typeof first === 'string' ? first : first.url
    } else if (city.imageUrl) {
      return city.imageUrl
    }
  }
  return null
}

// Junta região+país+coordenada pra cada país cadastrado que a gente
// consegue localizar no mapa (ver src/lib/countryCoords.js).
function buildPoints(groups) {
  const points = []
  for (const group of groups || []) {
    for (const country of group.items || []) {
      if (!country.name) continue
      const coords = getCountryCoords(country.name)
      if (!coords) continue
      const cityCount = (country.subregions || []).filter((s) => s.name).length
      points.push({
        lat: coords.lat,
        lng: coords.lng,
        name: country.name,
        region: group.region,
        cityCount,
        photoUrl: getCountryPhoto(country),
        to: `/destinos/${slugify(group.region)}/${slugify(country.name)}`,
      })
    }
  }
  return points
}

export default function DestinationsGlobe({ groups }) {
  const navigate = useNavigate()
  const containerRef = useRef(null)
  const globeRef = useRef(null)
  const [size, setSize] = useState({ width: 320, height: 320 })

  const points = useMemo(() => buildPoints(groups), [groups])

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      setSize({ width: w, height: Math.min(560, Math.max(320, w * 0.72)) })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const globe = globeRef.current
    if (!globe) return
    globe.controls().autoRotate = true
    globe.controls().autoRotateSpeed = 0.2
    globe.pointOfView({ lat: -10, lng: -45, altitude: 2.2 })
  }, [])

  if (points.length === 0) return null

  return (
    <section className="bg-navy-900 py-14">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="section-title !text-white">Todos os Lugares Que Já Fomos</h2>
        <p className="mx-auto mt-3 max-w-xl text-navy-200">
          Gira o globo e clica num ponto pra conhecer o destino. {points.length} país{points.length === 1 ? '' : 'es'} no mapa.
        </p>
      </div>

      <div ref={containerRef} className="mx-auto mt-8 flex max-w-4xl justify-center px-4 sm:px-6">
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
          pointRadius={0.55}
          pointLabel={(d) => `<div style="font-family:sans-serif;padding:6px;max-width:160px;">
            ${d.photoUrl ? `<img src="${d.photoUrl}" style="width:100%;height:90px;object-fit:cover;border-radius:8px;display:block;margin-bottom:6px;" />` : ''}
            <strong>${d.name}</strong><br/>
            <span style="opacity:.8">${d.region}${d.cityCount ? ` · ${d.cityCount} cidade${d.cityCount === 1 ? '' : 's'}` : ''}</span>
          </div>`}
          onPointClick={(d) => navigate(d.to)}
          onPointHover={(d) => {
            if (containerRef.current) containerRef.current.style.cursor = d ? 'pointer' : 'grab'
          }}
        />
      </div>
    </section>
  )
}
