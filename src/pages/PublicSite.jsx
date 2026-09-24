import { useEffect, useState } from 'react'
import { getContent } from '../lib/api.js'
import { defaultContent } from '../lib/defaultContent.js'
import { WhatsAppFloatButton, WhatsAppLink, formatPhoneDisplay } from '../components/WhatsAppButton.jsx'
import { slugify } from '../lib/slug.js'
import { getLogoSize } from '../lib/logoSize.js'
import { getPlatform } from '../components/SocialIcons.jsx'
import { getCountryFlag } from '../lib/flags.js'

export default function PublicSite() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContent()
      .then((data) => setContent({ ...defaultContent, ...data }))
      .catch(() => setContent(defaultContent))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (content.brand?.name) {
      document.title = `${content.brand.name} - ${content.brand.tagline || 'Consultoria de Viagens'}`
    }
    if (content.brand?.logoUrl) {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = content.brand.logoUrl
    }
  }, [content.brand?.name, content.brand?.tagline, content.brand?.logoUrl])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-700">Carregando…</div>
  }

  const { brand, about, destinationGroups, services, reasons, process, pricing, consultant, cta, footer, socialLinks } = content

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      <Hero brand={brand} destinationGroups={destinationGroups} />
      <About about={about} />
      <Destinations groups={destinationGroups} />
      <Services services={services} />
      <Reasons reasons={reasons} consultant={consultant} />
      <Process process={process} />
      <Pricing pricing={pricing} brand={brand} />
      <Consultant consultant={consultant} />
      <CTA cta={cta} brand={brand} />
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} />
    </div>
  )
}

function LogoImage({ url, name, scale, offsetX, offsetY, className }) {
  return (
    <div className={`overflow-hidden rounded-full bg-white ${className || ''}`}>
      <img
        src={url}
        alt={name}
        className="h-full w-full object-contain"
        style={{ transform: `translate(${offsetX || 0}%, ${offsetY || 0}%) scale(${(scale || 100) / 100})` }}
      />
    </div>
  )
}

const NAV_LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#destinos', label: 'Destinos' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#preco', label: 'Preço' },
  { href: '#consultora', label: 'Consultora' },
  { href: '#contato', label: 'Contato' },
]

function Header({ brand }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {brand.logoUrl ? (
            <LogoImage
              url={brand.logoUrl}
              name={brand.name}
              scale={brand.logoScale}
              offsetX={brand.logoOffsetX}
              offsetY={brand.logoOffsetY}
              className="h-10 w-10"
            />
          ) : (
            <div className="h-10 w-10 rounded-full border-2 border-gold-400 flex items-center justify-center text-gold-600 font-serif font-bold">R</div>
          )}
          <span className="font-serif font-semibold text-navy-900">{brand.name}</span>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-medium text-navy-700 transition-colors hover:text-gold-600">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink whatsapp={brand.whatsapp} className="btn-navy !py-2 !px-4 text-sm hidden sm:inline-flex">
            Falar no WhatsApp
          </WhatsAppLink>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-navy-800 lg:hidden"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                {link.label}
              </a>
            ))}
            <WhatsAppLink whatsapp={brand.whatsapp} className="btn-navy mt-2 !py-2 !px-4 text-center text-sm">
              Falar no WhatsApp
            </WhatsAppLink>
          </div>
        </nav>
      )}
    </header>
  )
}

function Hero({ brand, destinationGroups }) {
  const logoSize = getLogoSize(brand.logoSize)
  return (
    <section className="relative overflow-hidden bg-navy-900 py-16 sm:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(212,165,63,0.18), transparent 45%), radial-gradient(circle at 80% 30%, rgba(63,95,140,0.35), transparent 50%), radial-gradient(circle at 50% 100%, rgba(212,165,63,0.12), transparent 55%)',
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        {brand.logoUrl ? (
          <LogoImage
            url={brand.logoUrl}
            name={brand.name}
            scale={brand.logoScale}
            offsetX={brand.logoOffsetX}
            offsetY={brand.logoOffsetY}
            className={`mx-auto mb-8 p-1 shadow-2xl shadow-black/30 ${logoSize.hero}`}
          />
        ) : (
          <div className={`mx-auto mb-8 rounded-full border-4 border-gold-400 flex items-center justify-center text-5xl font-serif font-bold text-gold-400 shadow-2xl sm:text-7xl ${logoSize.hero}`}>R</div>
        )}
        <h1 className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text font-serif text-4xl font-bold tracking-wide text-transparent sm:text-7xl">
          {brand.name}
        </h1>
        <p className="mt-4 text-lg text-navy-100 sm:text-xl">{brand.tagline}</p>
        <div className="mx-auto mt-8 h-1 w-24 rounded bg-gradient-to-r from-gold-400 to-gold-600" />
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {(destinationGroups || []).map((group) => (
            <a
              key={group.region}
              href={`#${slugify(group.region)}`}
              className="rounded-full border border-gold-400/60 bg-white/5 px-4 py-1.5 text-sm text-gold-100 backdrop-blur-sm transition-all duration-200 hover:border-gold-300 hover:bg-gold-400 hover:text-navy-900 hover:scale-105"
            >
              {group.region}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function About({ about }) {
  return (
    <section id="sobre" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-14 text-center sm:px-6">
      <h2 className="section-title">{about.title}</h2>
      <div className="mt-6 space-y-4 text-gray-600">
        {(about.paragraphs || []).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}

function DestinationCarousel({ images, name }) {
  const [index, setIndex] = useState(0)
  const current = images[index]
  function prev(e) {
    e.preventDefault()
    e.stopPropagation()
    setIndex((i) => (i - 1 + images.length) % images.length)
  }
  function next(e) {
    e.preventDefault()
    e.stopPropagation()
    setIndex((i) => (i + 1) % images.length)
  }
  return (
    <div className="group relative h-full w-full">
      <img src={current.url} alt={name} className="h-full w-full object-cover" />
      {current.caption && (
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 rounded bg-black/55 px-2 py-0.5 text-xs text-white">
          {current.caption}
        </span>
      )}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Foto anterior"
            className="absolute left-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            onClick={next}
            aria-label="Próxima foto"
            className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            ›
          </button>
          <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DestinationCard({ name, desc, imageUrl, imageMode, images: itemImages, photoCaption }) {
  const rawImages =
    imageMode === 'carousel'
      ? (itemImages || []).filter((img) => (typeof img === 'string' ? img : img?.url))
      : imageUrl
        ? [{ url: imageUrl, caption: photoCaption }]
        : []
  const images = rawImages.map((img) => (typeof img === 'string' ? { url: img, caption: '' } : img))

  return (
    <div className="card overflow-hidden">
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-navy-50 to-gray-100 text-gray-400">
        {images.length > 0 ? (
          <DestinationCarousel images={images} name={name} />
        ) : (
          <span className="text-sm">Sem foto</span>
        )}
      </div>
      <div className="border-t-2 border-gold-400 p-4">
        <h4 className="font-serif text-lg font-bold text-navy-900">{name}</h4>
        <p className="mt-1 text-sm text-gray-600">{desc}</p>
      </div>
    </div>
  )
}

// Região > País (cabeçalho, sem foto) > Cidades (cards com foto/carrossel).
// `compact` força uma coluna só, pra caber na prévia estreita do admin.
export function RegionBlock({ group, compact = false }) {
  const grid = compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
  const countries = (group.items || []).filter((c) => c.name)

  return (
    <div id={slugify(group.region)} className="scroll-mt-24">
      {group.coverUrl ? (
        <div className={`relative overflow-hidden rounded-2xl bg-navy-900 ${compact ? 'h-28' : 'h-40 sm:h-56'}`}>
          <img src={group.coverUrl} alt={group.region} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />
          <div className={`absolute inset-0 flex flex-col justify-end ${compact ? 'p-3' : 'p-5 sm:p-8'}`}>
            <h3 className={`font-serif font-bold text-white ${compact ? 'text-lg' : 'text-2xl sm:text-4xl'}`}>{group.region}</h3>
            {group.desc && <p className={`mt-1 text-navy-100 ${compact ? 'text-xs' : 'text-sm sm:text-base'}`}>{group.desc}</p>}
          </div>
        </div>
      ) : (
        <>
          <h3 className="border-l-4 border-gold-400 pl-3 font-serif text-2xl font-bold text-navy-900">{group.region}</h3>
          {group.desc && <p className="mt-2 pl-4 text-gray-600">{group.desc}</p>}
        </>
      )}

      <div className="mt-6 space-y-10">
        {countries.map((country, ci) => {
          const cities = (country.subregions || []).filter((s) => s.name)
          const flag = getCountryFlag(country.name, '')
          return (
            <div key={ci} id={slugify(country.name)} className={`scroll-mt-28 ${compact ? 'pl-3' : 'pl-6 sm:pl-10'}`}>
              <h4 className="flex items-center gap-2 border-l-4 border-gold-300 pl-3 font-serif text-xl font-bold text-navy-900">
                {flag && <span>{flag}</span>}
                {country.name}
              </h4>
              {country.desc && <p className="mt-1 pl-3 text-sm text-gray-600">{country.desc}</p>}
              {cities.length > 0 && (
                <div className={`mt-4 pl-3 ${grid}`}>
                  {cities.map((city, i) => (
                    <DestinationCard
                      key={i}
                      name={city.name}
                      desc={city.desc}
                      imageUrl={city.imageUrl}
                      imageMode={city.imageMode}
                      images={city.images}
                      photoCaption={city.photoCaption}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Destinations({ groups }) {
  return (
    <section id="destinos" className="mx-auto max-w-6xl scroll-mt-20 space-y-14 px-4 py-10 sm:px-6">
      {(groups || [])
        .filter((g) => g.region)
        .map((group, gi) => (
          <RegionBlock key={gi} group={group} />
        ))}
    </section>
  )
}

function Services({ services }) {
  return (
    <section id="servicos" className="scroll-mt-20 bg-navy-50 py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="section-title">O Que Nós Ajudamos a Organizar</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {(services || []).map((s) => (
            <div key={s.title} className="card p-6">
              <h4 className="font-serif text-lg font-bold text-navy-900">{s.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reasons({ reasons }) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h2 className="section-title">Motivos para Você Contratar a Consultoria</h2>
      <div className="mt-10 space-y-5">
        {(reasons || []).map((r) => (
          <div key={r.title} className="card p-6">
            <h4 className="font-serif text-lg font-bold text-navy-900">{r.title}</h4>
            <p className="mt-2 text-sm text-gray-600">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Process({ process }) {
  return (
    <section className="bg-navy-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="section-title">Como Funciona a Nossa Consultoria</h2>
        <div className="mt-10 space-y-5">
          {(process || []).map((step, i) => (
            <div key={step.title} className="card relative p-6">
              <span className="absolute -top-3 right-4 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-white">
                {i + 1}ª
              </span>
              <h4 className="font-serif text-lg font-bold text-navy-900">{step.title}</h4>
              <p className="mt-2 text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing({ pricing, brand }) {
  return (
    <section id="preco" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 text-center sm:px-6">
      <h2 className="section-title">{pricing.title || 'Investimento na Consultoria'}</h2>
      <p className="mx-auto mt-4 max-w-xl text-gray-600">
        {pricing.intro || 'Trabalhamos com um valor justo e acessível para entregar um planejamento completo, seguro e detalhado para a sua viagem dos sonhos.'}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {(pricing.plans || []).map((plan) => (
          <div key={plan.name} className="flex flex-col rounded-2xl border-2 border-gold-400 bg-white p-6 text-left shadow-sm">
            <h3 className="text-base font-bold uppercase tracking-wide text-navy-700">{plan.name}</h3>
            <p className="mt-3 font-serif text-3xl font-extrabold text-gold-600">{plan.priceLabel}</p>
            {plan.priceNote && <p className="mt-1 text-xs italic text-gray-400">{plan.priceNote}</p>}
            <p className="mt-4 text-sm leading-relaxed text-gray-600">{plan.tagline}</p>
            <ul className="mt-5 flex-1 space-y-3 text-sm text-navy-800">
              {(plan.bullets || []).map((bullet, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="mt-0.5 flex-shrink-0 text-gold-500">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 max-w-xl border-l-4 border-gold-400 bg-gold-50 p-4 text-left text-sm text-navy-800">
        <strong>Forma de pagamento:</strong> {pricing.paymentInfo?.replace('Forma de pagamento:', '').trim()}
      </div>
      <WhatsAppLink whatsapp={brand.whatsapp} className="btn-gold mt-8">
        Falar no WhatsApp
      </WhatsAppLink>
    </section>
  )
}

function Consultant({ consultant }) {
  return (
    <section id="consultora" className="scroll-mt-20 bg-navy-50 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="section-title">Conheça a Consultora</h2>
        <div className="mt-8">
          {consultant.photoUrl ? (
            <img
              src={consultant.photoUrl}
              alt={consultant.name}
              className="mx-auto h-80 w-64 rounded-2xl border-4 border-gold-300 object-cover shadow-lg sm:h-96 sm:w-72"
            />
          ) : (
            <div className="mx-auto flex h-80 w-64 items-center justify-center rounded-2xl border-4 border-gold-300 text-3xl font-serif font-bold text-gold-600 sm:h-96 sm:w-72">
              {consultant.name?.[0]}
            </div>
          )}
          <h3 className="mt-4 font-serif text-2xl font-bold text-navy-900">{consultant.name}</h3>
          <p className="mt-4 text-gray-600">{consultant.bio}</p>
          {consultant.quote && (
            <p className="mt-6 border-t border-gray-200 pt-6 font-serif italic text-lg text-navy-800">&ldquo;{consultant.quote}&rdquo;</p>
          )}
        </div>
      </div>
    </section>
  )
}

function CTA({ cta, brand }) {
  return (
    <section id="contato" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 text-center sm:px-6">
      <div className="card p-10">
        <h2 className="section-title">{cta.title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">{cta.desc}</p>
        <WhatsAppLink whatsapp={brand.whatsapp} className="btn-gold mt-8">
          Falar no WhatsApp {brand.whatsapp ? `(${formatPhoneDisplay(brand.whatsapp)})` : ''}
        </WhatsAppLink>
      </div>
    </section>
  )
}

function Footer({ brand, footer, socialLinks }) {
  return (
    <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
      {socialLinks?.length > 0 && (
        <div className="mb-4 flex justify-center gap-3">
          {socialLinks.map((social, i) => {
            if (!social.url) return null
            const platform = getPlatform(social.platform)
            return (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name || platform.label}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md transition-transform hover:scale-110 ${platform.color}`}
              >
                {social.platform === 'custom' && social.iconUrl ? (
                  <img src={social.iconUrl} alt={social.name} className="h-5 w-5 rounded-full object-contain" />
                ) : (
                  <platform.Icon className="h-5 w-5" />
                )}
              </a>
            )
          })}
        </div>
      )}
      <p>© {new Date().getFullYear()} {brand.name}. {footer.text}</p>
      <p className="mt-2">
        {brand.instagram && <span>{brand.instagram}</span>}
        {brand.instagram && brand.whatsapp && <span className="mx-2">|</span>}
        {brand.whatsapp && <span>{formatPhoneDisplay(brand.whatsapp)}</span>}
      </p>
    </footer>
  )
}
