import { useEffect, useState } from 'react'
import { getContent } from '../lib/api.js'
import { defaultContent } from '../lib/defaultContent.js'
import { WhatsAppFloatButton, WhatsAppLink, formatPhoneDisplay } from '../components/WhatsAppButton.jsx'
import { slugify, findDestinationSlug } from '../lib/slug.js'

export default function PublicSite() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContent()
      .then((data) => setContent({ ...defaultContent, ...data }))
      .catch(() => setContent(defaultContent))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-700">Carregando…</div>
  }

  const { brand, hero, about, destinationGroups, services, reasons, process, pricing, consultant, cta, footer } = content

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      <Hero brand={brand} hero={hero} destinationGroups={destinationGroups} />
      <About about={about} />
      <Destinations groups={destinationGroups} />
      <Services services={services} />
      <Reasons reasons={reasons} consultant={consultant} />
      <Process process={process} />
      <Pricing pricing={pricing} brand={brand} />
      <Consultant consultant={consultant} />
      <CTA cta={cta} brand={brand} />
      <Footer brand={brand} footer={footer} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} />
    </div>
  )
}

function Header({ brand }) {
  return (
    <header className="border-b border-gray-100 bg-white/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          {brand.logoUrl ? (
            <img src={brand.logoUrl} alt={brand.name} className="h-10 w-10 rounded-full object-contain bg-white" />
          ) : (
            <div className="h-10 w-10 rounded-full border-2 border-gold-400 flex items-center justify-center text-gold-600 font-serif font-bold">R</div>
          )}
          <span className="font-serif font-semibold text-navy-900">{brand.name}</span>
        </div>
        <WhatsAppLink whatsapp={brand.whatsapp} className="btn-navy !py-2 !px-4 text-sm hidden sm:inline-flex">
          Falar no WhatsApp
        </WhatsAppLink>
      </div>
    </header>
  )
}

function Hero({ brand, hero, destinationGroups }) {
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
          <img src={brand.logoUrl} alt={brand.name} className="mx-auto mb-8 h-40 w-40 rounded-full object-contain bg-white p-1 shadow-2xl shadow-black/30 sm:h-56 sm:w-56" />
        ) : (
          <div className="mx-auto mb-8 h-40 w-40 rounded-full border-4 border-gold-400 flex items-center justify-center text-5xl font-serif font-bold text-gold-400 shadow-2xl sm:h-56 sm:w-56 sm:text-7xl">R</div>
        )}
        <h1 className="font-serif text-4xl font-bold tracking-wide text-white sm:text-7xl">{brand.name}</h1>
        <p className="mt-4 text-lg text-navy-100 sm:text-xl">{brand.tagline}</p>
        <div className="mx-auto mt-8 h-1 w-24 rounded bg-gradient-to-r from-gold-400 to-gold-600" />
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {(hero.countryTags || []).map((tag) => {
            const slug = findDestinationSlug(destinationGroups, tag)
            const className =
              'rounded-full border border-gold-400/60 bg-white/5 px-4 py-1.5 text-sm text-gold-100 backdrop-blur-sm transition-all duration-200 hover:border-gold-300 hover:bg-gold-400 hover:text-navy-900 hover:scale-105'
            return slug ? (
              <a key={tag} href={`#${slug}`} className={className}>
                {tag}
              </a>
            ) : (
              <span key={tag} className={className}>
                {tag}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function About({ about }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
      <h2 className="section-title">{about.title}</h2>
      <div className="mt-6 space-y-4 text-gray-600">
        {(about.paragraphs || []).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  )
}

function Destinations({ groups }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {(groups || []).map((group) => (
        <div key={group.region} className="mb-12">
          <h3 className="mb-5 border-l-4 border-gold-400 pl-3 font-serif text-2xl font-bold text-navy-900">
            {group.region}
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(group.items || []).map((item) => (
              <div key={item.name} id={slugify(item.name)} className="card scroll-mt-28 overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-gradient-to-br from-navy-50 to-gray-100 text-gray-400">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm">Sem foto</span>
                  )}
                </div>
                <div className="border-t-2 border-gold-400 p-4">
                  <h4 className="font-serif text-lg font-bold text-navy-900">{item.name}</h4>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

function Services({ services }) {
  return (
    <section className="bg-navy-50 py-14">
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
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
      <h2 className="section-title">Investimento na Consultoria</h2>
      <p className="mx-auto mt-4 max-w-xl text-gray-600">
        Trabalhamos com um valor justo e acessível para entregar um planejamento completo, seguro e detalhado para a sua viagem dos sonhos.
      </p>
      <div className="mx-auto mt-8 max-w-md rounded-2xl border-2 border-gold-400 p-8">
        <h3 className="font-serif text-xl font-bold text-navy-900">{pricing.title}</h3>
        <p className="mt-3 font-serif text-4xl font-extrabold text-navy-900">{pricing.priceLabel}</p>
        <p className="mt-3 text-sm text-gray-600">{pricing.desc}</p>
      </div>
      <div className="mx-auto mt-6 max-w-xl border-l-4 border-gold-400 bg-gold-50 p-4 text-left text-sm text-navy-800">
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
    <section className="bg-navy-50 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="section-title">Conheça a Consultora</h2>
        <div className="mt-8">
          {consultant.photoUrl ? (
            <img src={consultant.photoUrl} alt={consultant.name} className="mx-auto h-28 w-28 rounded-full border-4 border-gold-300 object-cover shadow" />
          ) : (
            <div className="mx-auto h-28 w-28 rounded-full border-4 border-gold-300 flex items-center justify-center text-3xl font-serif font-bold text-gold-600">
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
    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
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

function Footer({ brand, footer }) {
  return (
    <footer className="border-t border-gray-100 py-10 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} {brand.name}. {footer.text}</p>
      <p className="mt-2">
        {brand.instagram && <span>{brand.instagram}</span>}
        {brand.instagram && brand.whatsapp && <span className="mx-2">|</span>}
        {brand.whatsapp && <span>{formatPhoneDisplay(brand.whatsapp)}</span>}
      </p>
    </footer>
  )
}
