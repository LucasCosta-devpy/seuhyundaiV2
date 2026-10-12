import { Fragment } from 'react'
import { WhatsAppLink } from '../components/WhatsAppButton.jsx'
import { EditableText, useEditor } from '../components/Editable.jsx'
import { useSiteContent } from '../lib/useSiteContent.js'
import { defaultContent } from '../lib/defaultContent.js'
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

function CtaButton({ whatsapp, message, label, className = '' }) {
  return (
    <WhatsAppLink
      whatsapp={whatsapp}
      message={message}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-green-600 ${className}`}
    >
      <EditableText path={['landing', 'ctaLabel']} value={label} />
    </WhatsAppLink>
  )
}

// Texto do preço: {preco} vira o valor do 1º plano (aba Preço), em destaque.
// Na edição o texto aparece cru (com o {preco}) pra poder ser reescrito.
function PricingText({ text, price }) {
  const editing = !!useEditor()
  const className = 'mt-3 text-gray-600'
  if (editing) {
    return (
      <>
        <EditableText as="p" path={['landing', 'pricingText']} value={text} className={className} />
        <p className="mt-1 text-xs text-blue-600">
          {'{preco}'} vira <strong>{price}</strong> (valor do primeiro plano, editado na aba Preço)
        </p>
      </>
    )
  }
  return (
    <p className={className}>
      {(text || '').split('{preco}').map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <strong className="text-gold-600">{price}</strong>}
          {part}
        </Fragment>
      ))}
    </p>
  )
}

// Visual puro da página de anúncios: recebe o content pronto (site público e prévia do admin).
export function LandingView({ content }) {
  const editing = !!useEditor()
  const { brand, reasons, pricing } = content
  const consultant = content.consultant || {}
  // useSiteContent faz merge raso: subcampos novos de um `landing` já salvo viriam undefined.
  const landing = { ...defaultContent.landing, ...content.landing }
  const footerText = content.footer?.text ?? defaultContent.footer.text
  const logoSize = getLogoSize(brand.logoSize)
  const message = brand.whatsappMessage || `Olá! Conheci a ${brand.name} pelo site e gostaria de conversar sobre a minha próxima viagem.`
  const parsedCount = Number.parseInt(landing.reasonsCount, 10)
  const reasonsCount = Number.isNaN(parsedCount) ? 4 : Math.max(0, parsedCount)
  const highlights = (reasons || []).slice(0, reasonsCount)

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
          <EditableText
            as="h1"
            path={['landing', 'headline']}
            value={landing.headline}
            className="font-serif text-3xl font-bold leading-tight text-white sm:text-5xl"
          />
          <EditableText as="p" path={['brand', 'tagline']} value={brand.tagline} className="mt-4 text-lg text-navy-100" />
          <div className="mt-8">
            <CtaButton whatsapp={brand.whatsapp} message={message} label={landing.ctaLabel} />
          </div>
          <EditableText as="p" path={['landing', 'ctaNote']} value={landing.ctaNote} className="mt-3 text-xs text-navy-300" />
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          {/* Título próprio da landing (landing.reasonsTitle), independente do título da seção "Motivos" do site (content.reasonsTitle). */}
          <EditableText
            as="h2"
            path={['landing', 'reasonsTitle']}
            value={landing.reasonsTitle}
            className="text-center font-serif text-2xl font-bold text-navy-900 sm:text-3xl"
          />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {highlights.map((r, i) => (
              <div key={i} className="card p-6">
                <EditableText as="h3" path={['reasons', i, 'title']} value={r.title} className="font-serif text-lg font-bold text-navy-900" />
                <EditableText as="p" path={['reasons', i, 'desc']} value={r.desc} className="mt-2 text-sm text-gray-600" />
              </div>
            ))}
          </div>
        </section>
      )}

      {(consultant.quote || editing) && (
        <section className="bg-navy-50 py-14">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            {consultant.photoUrl && (
              <img
                src={consultant.photoUrl}
                alt={consultant.name}
                className="mx-auto h-24 w-24 rounded-full border-4 border-gold-300 object-cover shadow"
              />
            )}
            <p className="mt-6 font-serif text-xl italic text-navy-800">
              &ldquo;<EditableText path={['consultant', 'quote']} value={consultant.quote} />&rdquo;
            </p>
            <EditableText as="p" path={['consultant', 'name']} value={consultant.name} className="mt-3 text-sm font-semibold text-navy-600" />
          </div>
        </section>
      )}

      {pricing?.plans?.length > 0 && (
        <section className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
          <EditableText as="h2" path={['landing', 'pricingTitle']} value={landing.pricingTitle} className="font-serif text-2xl font-bold text-navy-900 sm:text-3xl" />
          <PricingText text={landing.pricingText} price={pricing.plans[0].priceLabel} />
        </section>
      )}

      <section className="bg-navy-900 py-16 text-center">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <EditableText as="h2" path={['landing', 'finalTitle']} value={landing.finalTitle} className="font-serif text-2xl font-bold text-white sm:text-3xl" />
          <EditableText as="p" path={['landing', 'finalDesc']} value={landing.finalDesc} className="mt-3 text-navy-100" />
          <div className="mt-8">
            <CtaButton whatsapp={brand.whatsapp} message={message} label={landing.ctaLabel} />
          </div>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} {brand.name}
        {(footerText || editing) && (
          <>
            . <EditableText path={['footer', 'text']} value={footerText} />
          </>
        )}
      </footer>
    </div>
  )
}

export default function LandingConsultoria() {
  const { content, loading } = useSiteContent()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-700">Carregando…</div>
  }

  return <LandingView content={content} />
}
