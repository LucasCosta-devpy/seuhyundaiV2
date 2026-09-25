import { Link, useParams } from 'react-router-dom'
import { Header, Footer, DestinationCard } from './PublicSite.jsx'
import { WhatsAppFloatButton } from '../components/WhatsAppButton.jsx'
import { useSiteContent } from '../lib/useSiteContent.js'
import { slugify } from '../lib/slug.js'
import { getCountryFlag } from '../lib/flags.js'

function Breadcrumbs({ items }) {
  return (
    <nav className="mx-auto max-w-6xl px-4 pt-4 text-sm text-gray-500 sm:px-6">
      <Link to="/" className="hover:text-navy-700">Início</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span className="mx-1.5">/</span>
          {item.to ? (
            <Link to={item.to} className="hover:text-navy-700">{item.label}</Link>
          ) : (
            <span className="font-medium text-navy-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export function Banner({ title, desc, coverUrl, flag, height = 'h-60 sm:h-80' }) {
  if (coverUrl) {
    return (
      <div className={`relative mx-auto mt-4 max-w-6xl overflow-hidden ${height}`}>
        <img src={coverUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />
        <div className="relative flex h-full flex-col justify-end p-5 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-300">{flag}</p>
          <h1 className="font-serif text-3xl font-bold text-white sm:text-5xl">{title}</h1>
          {desc && <p className="mt-2 max-w-2xl text-navy-100 sm:text-lg">{desc}</p>}
        </div>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="flex items-center gap-2 border-l-4 border-gold-400 pl-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl">
        {title}
      </h1>
      {desc && <p className="mt-3 max-w-2xl pl-4 text-gray-600">{desc}</p>}
    </div>
  )
}

export function ExploreCard({ to, name, coverUrl, subtitle, flag, preview = false }) {
  const Tag = preview ? 'div' : Link
  const linkProps = preview ? {} : { to }
  return (
    <Tag {...linkProps} className="group relative block h-44 overflow-hidden rounded-xl bg-navy-900 shadow-sm transition-transform hover:scale-[1.02]">
      {coverUrl ? (
        <img src={coverUrl} alt={name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900 text-5xl">
          {flag || '📍'}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="flex items-center gap-1.5 font-serif text-lg font-bold text-white">
          {flag && <span>{flag}</span>}
          {name}
        </h3>
        {subtitle && <p className="mt-0.5 line-clamp-2 text-xs text-navy-100">{subtitle}</p>}
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-gold-300">
          Ver mais <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Tag>
  )
}

function Loading() {
  return <div className="flex min-h-screen items-center justify-center text-navy-700">Carregando…</div>
}

function NotFoundBlock({ backTo, backLabel, message }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-lg text-gray-600">{message}</p>
      <Link to={backTo} className="btn-navy mt-6 inline-flex">{backLabel}</Link>
    </div>
  )
}

export function RegionPage() {
  const { regionSlug } = useParams()
  const { content, loading } = useSiteContent()
  if (loading) return <Loading />

  const { brand, footer, socialLinks, destinationGroups } = content
  const group = (destinationGroups || []).find((g) => slugify(g.region) === regionSlug)

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      {!group ? (
        <NotFoundBlock backTo="/" backLabel="Voltar pro início" message="Região não encontrada." />
      ) : (
        <>
          <Breadcrumbs items={[{ label: group.region }]} />
          <Banner title={group.region} desc={group.desc} coverUrl={group.coverUrl} />

          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <h2 className="font-serif text-xl font-bold text-navy-900">Países de {group.region}</h2>
            <p className="mt-1 text-sm text-gray-500">Escolha um país para descobrir suas cidades e destinos.</p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(group.items || []).filter((c) => c.name).map((country, ci) => (
                <ExploreCard
                  key={ci}
                  to={`/destinos/${regionSlug}/${slugify(country.name)}`}
                  name={country.name}
                  coverUrl={country.coverUrl}
                  subtitle={country.desc}
                  flag={getCountryFlag(country.name, '')}
                />
              ))}
              {(group.items || []).filter((c) => c.name).length === 0 && (
                <p className="text-sm text-gray-400">Nenhum país cadastrado ainda nesta região.</p>
              )}
            </div>
          </section>
        </>
      )}
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} />
    </div>
  )
}

export function CountryPage() {
  const { regionSlug, countrySlug } = useParams()
  const { content, loading } = useSiteContent()
  if (loading) return <Loading />

  const { brand, footer, socialLinks, destinationGroups } = content
  const group = (destinationGroups || []).find((g) => slugify(g.region) === regionSlug)
  const country = group && (group.items || []).find((c) => slugify(c.name) === countrySlug)

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      {!group || !country ? (
        <NotFoundBlock backTo="/" backLabel="Voltar pro início" message="País não encontrado." />
      ) : (
        <>
          <Breadcrumbs items={[{ label: group.region, to: `/destinos/${regionSlug}` }, { label: country.name }]} />
          <Banner
            title={country.name}
            desc={country.desc}
            coverUrl={country.coverUrl}
            flag={getCountryFlag(country.name, '')}
          />

          <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <h2 className="font-serif text-xl font-bold text-navy-900">Cidades de {country.name}</h2>
            <p className="mt-1 text-sm text-gray-500">Descubra os destinos mais incríveis por lá.</p>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(country.subregions || []).filter((c) => c.name).map((city, i) => (
                <Link key={i} to={`/destinos/${regionSlug}/${countrySlug}/${slugify(city.name)}`} className="block">
                  <DestinationCard
                    name={city.name}
                    desc={city.desc}
                    imageUrl={city.imageUrl}
                    imageMode={city.imageMode}
                    images={city.images}
                    photoCaption={city.photoCaption}
                  />
                </Link>
              ))}
              {(country.subregions || []).filter((c) => c.name).length === 0 && (
                <p className="text-sm text-gray-400">Nenhuma cidade cadastrada ainda neste país.</p>
              )}
            </div>
          </section>
        </>
      )}
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} />
    </div>
  )
}

export function CityPage() {
  const { regionSlug, countrySlug, citySlug } = useParams()
  const { content, loading } = useSiteContent()
  if (loading) return <Loading />

  const { brand, footer, socialLinks, destinationGroups } = content
  const group = (destinationGroups || []).find((g) => slugify(g.region) === regionSlug)
  const country = group && (group.items || []).find((c) => slugify(c.name) === countrySlug)
  const city = country && (country.subregions || []).find((c) => slugify(c.name) === citySlug)

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      {!group || !country || !city ? (
        <NotFoundBlock backTo="/" backLabel="Voltar pro início" message="Destino não encontrado." />
      ) : (
        <>
          <Breadcrumbs
            items={[
              { label: group.region, to: `/destinos/${regionSlug}` },
              { label: country.name, to: `/destinos/${regionSlug}/${countrySlug}` },
              { label: city.name },
            ]}
          />

          <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <div className="overflow-hidden rounded-2xl shadow-sm">
              <DestinationCard
                name={city.name}
                desc={city.desc}
                imageUrl={city.imageUrl}
                imageMode={city.imageMode}
                images={city.images}
                photoCaption={city.photoCaption}
                large
              />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              {getCountryFlag(country.name, '')} {country.name} · {group.region}
            </p>
          </section>
        </>
      )}
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} />
    </div>
  )
}
