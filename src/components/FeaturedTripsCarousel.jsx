import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { slugify } from '../lib/slug.js'

function getCityPhoto(city) {
  if (city.imageMode === 'carousel') {
    const first = (city.images || []).find((img) => (typeof img === 'string' ? img : img?.url))
    if (first) return typeof first === 'string' ? first : first.url
    return null
  }
  return city.imageUrl || null
}

function buildFeatured(groups) {
  const list = []
  for (const group of groups || []) {
    for (const country of group.items || []) {
      for (const city of country.subregions || []) {
        if (!city.name || !city.featured) continue
        list.push({
          name: city.name,
          country: country.name,
          photoUrl: getCityPhoto(city),
          to: `/destinos/${slugify(group.region)}/${slugify(country.name)}/${slugify(city.name)}`,
        })
      }
    }
  }
  return list.slice(0, 10)
}

export default function FeaturedTripsCarousel({ groups }) {
  const scrollerRef = useRef(null)
  const trips = buildFeatured(groups)

  if (trips.length === 0) return null

  function scrollBy(dir) {
    scrollerRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-navy-100">Viagens em destaque</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => scrollBy(-1)} aria-label="Anterior" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">‹</button>
          <button type="button" onClick={() => scrollBy(1)} aria-label="Próxima" className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">›</button>
        </div>
      </div>

      <div ref={scrollerRef} className="mt-4 flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {trips.map((trip, i) => (
          <Link
            key={i}
            to={trip.to}
            className="group relative h-40 w-56 flex-shrink-0 overflow-hidden rounded-xl bg-navy-800 shadow-md transition-transform hover:scale-[1.03]"
          >
            {trip.photoUrl ? (
              <img src={trip.photoUrl} alt={trip.name} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-3xl">📍</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/10 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <p className="font-serif font-bold text-white">{trip.name}</p>
              <p className="text-xs text-navy-100">{trip.country}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
