import { WhatsAppLink } from '../components/WhatsAppButton.jsx'
import { useSiteContent } from '../lib/useSiteContent.js'
import { getLogoSize } from '../lib/logoSize.js'

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

function CtaButton({ whatsapp, message, className = '' }) {
  return (
    <WhatsAppLink
      whatsapp={whatsapp}
      message={message}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-green-600 ${className}`}
    >
      🟢 Quero Planejar Minha Viagem
    </WhatsAppLink>
  )
}

export default function LandingConsultoria() {
  const { content, loading } = useSiteContent()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-700">Carregando…</div>
  }

  const { brand, reasons, consultant, pricing } = content
  const logoSize = getLogoSize(brand.logoSize)
  const message = `Olá! Vim pelo site da ${brand.name} e gostaria de saber sobre a consultoria.`
  const highlights = (reasons || []).slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-navy-900 py-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(212,165,63,0.18), transparent 45%), radial-gradient(circle at 80% 30%, rgba(63,95,140,0.35), transparent 50%)',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          {brand.logoUrl && (
            <LogoImage
              url={brand.logoUrl}
              name={brand.name}
              scale={brand.logoScale}
              offsetX={brand.logoOffsetX}
              offsetY={brand.logoOffsetY}
              className={`mx-auto mb-6 shadow-2xl shadow-black/30 ${logoSize.hero}`}
            />
          )}
          <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-5xl">
            Planeje a Viagem dos Seus Sonhos Com Quem Entende do Assunto
          </h1>
          <p className="mt-4 text-lg text-navy-100">{brand.tagline}</p>
          <div className="mt-8">
            <CtaButton whatsapp={brand.whatsapp} message={message} />
          </div>
          <p className="mt-3 text-xs text-navy-300">Resposta rápida direto no WhatsApp</p>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <h2 className="text-center font-serif text-2xl font-bold text-navy-900 sm:text-3xl">
            Por que contratar uma consultoria de viagem?
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {highlights.map((r) => (
              <div key={r.title} className="card p-6">
                <h3 className="font-serif text-lg font-bold text-navy-900">{r.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{r.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {consultant?.quote && (
        <section className="bg-navy-50 py-14">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            {consultant.photoUrl && (
              <img
                src={consultant.photoUrl}
                alt={consultant.name}
                className="mx-auto h-24 w-24 rounded-full border-4 border-gold-300 object-cover shadow"
              />
            )}
            <p className="mt-6 font-serif text-xl italic text-navy-800">&ldquo;{consultant.quote}&rdquo;</p>
            <p className="mt-3 text-sm font-semibold text-navy-600">{consultant.name}</p>
          </div>
        </section>
      )}

      {pricing?.plans?.length > 0 && (
        <section className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl">Investimento</h2>
          <p className="mt-3 text-gray-600">
            Planos a partir de <strong className="text-gold-600">{pricing.plans[0].priceLabel}</strong>, sob medida pra sua viagem.
          </p>
        </section>
      )}

      <section className="bg-navy-900 py-16 text-center">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">Pronto para começar a planejar?</h2>
          <p className="mt-3 text-navy-100">Fala agora mesmo com a gente no WhatsApp, sem compromisso.</p>
          <div className="mt-8">
            <CtaButton whatsapp={brand.whatsapp} message={message} />
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {brand.name}
      </footer>
    </div>
  )
}
