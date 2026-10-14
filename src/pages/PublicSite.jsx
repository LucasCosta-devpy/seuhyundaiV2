import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { WhatsAppFloatButton, WhatsAppLink, formatPhoneDisplay } from '../components/WhatsAppButton.jsx'
import { slugify } from '../lib/slug.js'
import { withConfirmRemove } from '../lib/confirmRemove.js'
import { getLogoSize } from '../lib/logoSize.js'
import { getPlatform } from '../components/SocialIcons.jsx'
import { useSiteContent } from '../lib/useSiteContent.js'
import DestinationsGlobe from '../components/DestinationsGlobe.jsx'
import { EditableText, useEditor, useListEditing, ItemControls, AddItemButton, MoveToSelect } from '../components/Editable.jsx'
import { mergeRegionInto } from '../lib/moveDestinations.js'

export default function PublicSite() {
  const { content, loading } = useSiteContent()
  const location = useLocation()

  useEffect(() => {
    if (loading || !location.hash) return
    const el = document.querySelector(location.hash)
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [loading, location.hash])

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-navy-700">Carregando…</div>
  }

  const {
    brand,
    hero,
    about,
    destinationGroups,
    destinationsTitle,
    destinationsSubtitle,
    destinationsLabels,
    services,
    servicesTitle,
    reasons,
    reasonsTitle,
    process,
    processTitle,
    pricing,
    consultant,
    cta,
    footer,
    socialLinks,
    showGlobe,
    globeTitle,
    globeSubtitle,
  } = content

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      <Hero brand={brand} hero={hero} destinationGroups={destinationGroups} />
      <About about={about} />
      {showGlobe && <DestinationsGlobe groups={destinationGroups} title={globeTitle} subtitle={globeSubtitle} />}
      <Destinations groups={destinationGroups} title={destinationsTitle} subtitle={destinationsSubtitle} labels={destinationsLabels} />
      <Services services={services} title={servicesTitle} />
      <Reasons reasons={reasons} title={reasonsTitle} />
      <Process process={process} title={processTitle} />
      <Pricing pricing={pricing} brand={brand} />
      <Consultant consultant={consultant} />
      <CTA cta={cta} brand={brand} />
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} message={brand.whatsappMessage} />
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
  { href: '#redes-sociais', label: 'Redes Sociais' },
]

export function Header({ brand }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const editing = !!useEditor()
  const NavItem = editing ? 'span' : 'a'
  const whatsappLabel = brand.whatsappLabel || 'Falar no WhatsApp'

  function goToSection(e, hash) {
    e.preventDefault()
    setMenuOpen(false)
    if (location.pathname === '/') {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      window.history.replaceState(null, '', `/${hash}`)
    } else {
      navigate(`/${hash}`)
    }
  }

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
          {NAV_LINKS.map((link, i) => (
            <NavItem
              key={link.href}
              {...(editing ? {} : { href: `/${link.href}`, onClick: (e) => goToSection(e, link.href) })}
              className="text-sm font-medium text-navy-700 transition-colors hover:text-gold-600"
            >
              <EditableText path={['brand', 'navLabels', i]} value={brand.navLabels?.[i] || link.label} />
            </NavItem>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink whatsapp={brand.whatsapp} message={brand.whatsappMessage} className="btn-navy !py-2 !px-4 text-sm hidden sm:inline-flex">
            <EditableText path={['brand', 'whatsappLabel']} value={whatsappLabel} />
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
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={`/${link.href}`}
                onClick={(e) => goToSection(e, link.href)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                {brand.navLabels?.[i] || link.label}
              </a>
            ))}
            <WhatsAppLink whatsapp={brand.whatsapp} message={brand.whatsappMessage} className="btn-navy mt-2 !py-2 !px-4 text-center text-sm">
              {whatsappLabel}
            </WhatsAppLink>
          </div>
        </nav>
      )}
    </header>
  )
}

export function Hero({ brand, hero, destinationGroups }) {
  const logoSize = getLogoSize(brand.logoSize)
  const editing = !!useEditor()
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
        <EditableText
          as="h1"
          path={['brand', 'name']}
          value={brand.name}
          className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text font-serif text-4xl font-bold tracking-wide text-transparent sm:text-7xl"
        />
        <EditableText as="p" path={['brand', 'tagline']} value={brand.tagline} className="mt-4 text-lg text-navy-100 sm:text-xl" />
        <div className="mx-auto mt-8 h-1 w-24 rounded bg-gradient-to-r from-gold-400 to-gold-600" />
        {(hero?.headline || editing) && (
          <EditableText as="h2" path={['hero', 'headline']} value={hero?.headline} className="mt-8 font-serif text-2xl font-bold text-white sm:text-4xl" />
        )}
        {(hero?.subtext || editing) && (
          <EditableText as="p" path={['hero', 'subtext']} value={hero?.subtext} className="mx-auto mt-4 max-w-xl text-navy-100" />
        )}
        {(hero?.ctaLabel || editing) && (
          <WhatsAppLink whatsapp={brand.whatsapp} message={brand.whatsappMessage} className="btn-gold mt-8 inline-block text-base font-bold uppercase tracking-wide">
            <EditableText path={['hero', 'ctaLabel']} value={hero?.ctaLabel} />
          </WhatsAppLink>
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {(destinationGroups || []).filter((g) => g.region).map((group) => (
            <Link
              key={group.region}
              to={`/destinos/${slugify(group.region)}`}
              className="rounded-full border border-gold-400/60 bg-white/5 px-4 py-1.5 text-sm text-gold-100 backdrop-blur-sm transition-all duration-200 hover:border-gold-300 hover:bg-gold-400 hover:text-navy-900 hover:scale-105"
            >
              {group.region}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function About({ about }) {
  const paragraphs = about.paragraphs || []
  const list = useListEditing(['about', 'paragraphs'], paragraphs)
  return (
    <section id="sobre" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-14 text-center sm:px-6">
      <EditableText as="h2" path={['about', 'title']} value={about.title} className="section-title" />
      <div className="mt-6 space-y-4 text-gray-600">
        {paragraphs.map((p, i) => (
          <div key={i} className="edit-item">
            <ItemControls list={list} index={i} total={paragraphs.length} />
            <EditableText as="p" path={['about', 'paragraphs', i]} value={p} />
          </div>
        ))}
        <AddItemButton list={list} item="" label="Adicionar parágrafo" className="w-full" />
      </div>
    </section>
  )
}

export function DestinationCarousel({ images, name }) {
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

// Com `path` (prévia do admin) nome e descrição viram editáveis: path = caminho da cidade no conteúdo.
export function DestinationCard({ name, desc, imageUrl, imageMode, images: itemImages, photoCaption, large = false, path }) {
  const editing = !!useEditor() && !!path
  const rawImages =
    imageMode === 'carousel'
      ? (itemImages || []).filter((img) => (typeof img === 'string' ? img : img?.url))
      : imageUrl
        ? [{ url: imageUrl, caption: photoCaption }]
        : []
  const images = rawImages.map((img) => (typeof img === 'string' ? { url: img, caption: '' } : img))
  const nameClass = `font-serif font-bold text-navy-900 ${large ? 'text-2xl' : 'text-lg'}`
  const descClass = `mt-1 text-gray-600 ${large ? '' : 'text-sm'}`

  return (
    <div className="card overflow-hidden">
      <div className={`flex items-center justify-center bg-gradient-to-br from-navy-50 to-gray-100 text-gray-400 ${large ? 'h-72 sm:h-96' : 'h-40'}`}>
        {images.length > 0 ? (
          <DestinationCarousel images={images} name={name} />
        ) : (
          <span className="text-sm">Sem foto</span>
        )}
      </div>
      <div className={`border-t-2 border-gold-400 ${large ? 'p-6' : 'p-4'}`}>
        {editing ? (
          <>
            <EditableText as="h4" path={[...path, 'name']} value={name} placeholder="Nome da cidade" className={nameClass} />
            <EditableText as="p" path={[...path, 'desc']} value={desc} placeholder="Descrição da cidade" className={descClass} />
          </>
        ) : (
          <>
            <h4 className={nameClass}>{name}</h4>
            <p className={descClass}>{desc}</p>
          </>
        )}
      </div>
    </div>
  )
}


// Com `path` (prévia do admin) nome e descrição viram editáveis: path = caminho da região no conteúdo.
export function RegionSummaryCard({ group, preview = false, path, labels }) {
  const inEditor = !!useEditor()
  const editing = inEditor && !!path
  const countryCount = (group.items || []).filter((c) => c.name).length
  // Dentro do admin nunca é link: clicar no texto edita (a navegação é pelo botão "Abrir").
  const Tag = preview || inEditor ? 'div' : Link
  const linkProps = Tag === 'div' ? {} : { to: `/destinos/${slugify(group.region)}` }
  return (
    <Tag
      {...linkProps}
      className={
        editing
          ? 'group relative block min-h-[14rem] overflow-hidden rounded-2xl bg-navy-900 shadow-md'
          : 'group relative block h-56 overflow-hidden rounded-2xl bg-navy-900 shadow-md transition-transform hover:scale-[1.02]'
      }
    >
      {group.coverUrl ? (
        <img src={group.coverUrl} alt={group.region} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-navy-800 to-navy-900" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/40 to-navy-900/10" />
      <div className={editing ? 'relative flex min-h-[14rem] flex-col justify-end p-5' : 'absolute inset-0 flex flex-col justify-end p-5'}>
        {editing ? (
          <>
            <EditableText as="h3" path={[...path, 'region']} value={group.region} placeholder="Nome da região" className="font-serif text-2xl font-bold text-white" />
            <EditableText as="p" path={[...path, 'desc']} value={group.desc} placeholder="Descrição (opcional)" className="mt-1 text-sm text-navy-100" />
          </>
        ) : (
          <>
            <h3 className="font-serif text-2xl font-bold text-white">{group.region}</h3>
            {group.desc && <p className="mt-1 line-clamp-2 text-sm text-navy-100">{group.desc}</p>}
          </>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-300">
          {countryCount > 0
            ? `${countryCount} ${countryCount === 1 ? labels?.countrySingular || 'país' : labels?.countryPlural || 'países'}`
            : labels?.cardCta || 'Explorar região'}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Tag>
  )
}

// Botão pequeno (só no admin) pra "entrar" num nível da prévia, já que o card em si é texto editável.
export function OpenLevelButton({ onClick, label = 'Abrir' }) {
  return (
    <div className="edit-item-controls !left-1.5 !right-auto" onMouseDown={(e) => e.preventDefault()}>
      <button
        type="button"
        onClick={onClick}
        title="Abrir este item na prévia"
        className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-navy-700 shadow ring-1 ring-black/10 hover:bg-navy-50"
      >
        {label} →
      </button>
    </div>
  )
}

// `onOpenRegion` só existe na prévia do admin (botão "Abrir" de cada região).
export function Destinations({ groups, title, subtitle, labels, onOpenRegion }) {
  const editor = useEditor()
  const editing = !!editor
  const allGroups = groups || []
  const list = useListEditing(['destinationGroups'], allGroups)
  const removeList = withConfirmRemove(list, (i) => `Remover a região "${allGroups[i]?.region || 'sem nome'}" com todos os países e cidades dela?`)
  // Índices sempre os ORIGINAIS de destinationGroups. No site só entram regiões com nome;
  // no admin entram todas (senão a região sumiria da tela ao apagar o nome pra reescrever).
  const entries = allGroups.map((group, gi) => ({ group, gi })).filter(({ group }) => editing || group.region)
  return (
    <section id="destinos" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14 sm:px-6">
      <div className="text-center">
        <EditableText as="h2" path={['destinationsTitle']} value={title || 'Nossos Destinos'} className="section-title" />
        <EditableText
          as="p"
          path={['destinationsSubtitle']}
          value={subtitle || 'Explore o mundo e encontre seu próximo destino.'}
          className="mx-auto mt-3 max-w-xl text-gray-600"
        />
      </div>
      {entries.length > 0 || editing ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ group, gi }) =>
            editing ? (
              <div key={gi} className="edit-item">
                <ItemControls list={removeList} index={gi} total={allGroups.length} />
                {onOpenRegion && <OpenLevelButton onClick={() => onOpenRegion(gi)} />}
                <MoveToSelect
                  label="Juntar em…"
                  options={allGroups.map((g, i) => ({ value: i, label: g.region || 'Região sem nome' })).filter((o) => o.value !== gi)}
                  onPick={(toGi) => {
                    if (!window.confirm(`Passar todos os países de "${group.region || 'esta região'}" para "${allGroups[toGi]?.region || 'a região escolhida'}" e apagar "${group.region || 'esta região'}"?`)) return
                    editor.update(['destinationGroups'], mergeRegionInto(allGroups, gi, toGi))
                  }}
                />
                <RegionSummaryCard group={group} path={['destinationGroups', gi]} labels={labels} />
              </div>
            ) : (
              <RegionSummaryCard key={gi} group={group} labels={labels} />
            ),
          )}
          <AddItemButton
            list={list}
            item={{ region: 'Nova região', desc: '', coverUrl: '', items: [] }}
            label="Adicionar região"
            className="min-h-[14rem]"
          />
        </div>
      ) : (
        <p className="mt-10 text-center text-gray-400">{labels?.empty || 'Nenhuma região cadastrada ainda.'}</p>
      )}
    </section>
  )
}

export function Services({ services, title }) {
  const items = services || []
  const list = useListEditing(['services'], items)
  return (
    <section id="servicos" className="scroll-mt-20 bg-navy-50 py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <EditableText as="h2" path={['servicesTitle']} value={title || 'O Que Nós Ajudamos a Organizar'} className="section-title" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((s, i) => (
            <div key={i} className="card edit-item p-6">
              <ItemControls list={list} index={i} total={items.length} />
              <EditableText as="h4" path={['services', i, 'title']} value={s.title} className="block font-serif text-lg font-bold text-navy-900" />
              <EditableText as="p" path={['services', i, 'desc']} value={s.desc} className="mt-2 text-sm text-gray-600" />
            </div>
          ))}
          <AddItemButton list={list} item={{ title: '', desc: '' }} label="Adicionar card" className="min-h-[7rem]" />
        </div>
      </div>
    </section>
  )
}

export function Reasons({ reasons, title }) {
  const items = reasons || []
  const list = useListEditing(['reasons'], items)
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <EditableText as="h2" path={['reasonsTitle']} value={title || 'Motivos para Você Contratar a Consultoria'} className="section-title" />
      <div className="mt-10 space-y-5">
        {items.map((r, i) => (
          <div key={i} className="card edit-item p-6">
            <ItemControls list={list} index={i} total={items.length} />
            <EditableText as="h4" path={['reasons', i, 'title']} value={r.title} className="block font-serif text-lg font-bold text-navy-900" />
            <EditableText as="p" path={['reasons', i, 'desc']} value={r.desc} className="mt-2 text-sm text-gray-600" />
          </div>
        ))}
        <AddItemButton list={list} item={{ title: '', desc: '' }} label="Adicionar motivo" className="w-full" />
      </div>
    </section>
  )
}

export function Process({ process, title }) {
  const items = process || []
  const list = useListEditing(['process'], items)
  return (
    <section className="bg-navy-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <EditableText as="h2" path={['processTitle']} value={title || 'Como Funciona a Nossa Consultoria'} className="section-title" />
        <div className="mt-10 space-y-5">
          {items.map((step, i) => (
            <div key={i} className="card edit-item relative p-6">
              <ItemControls list={list} index={i} total={items.length} className="!right-16" />
              <span className="absolute -top-3 right-4 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-white">
                {i + 1}ª
              </span>
              <EditableText as="h4" path={['process', i, 'title']} value={step.title} className="block font-serif text-lg font-bold text-navy-900" />
              <EditableText as="p" path={['process', i, 'desc']} value={step.desc} className="mt-2 text-sm text-gray-600" />
            </div>
          ))}
          <AddItemButton list={list} item={{ title: '', desc: '' }} label="Adicionar passo" className="w-full" />
        </div>
      </div>
    </section>
  )
}

export function Pricing({ pricing, brand }) {
  const editing = !!useEditor()
  const plans = pricing.plans || []
  const planList = useListEditing(['pricing', 'plans'], plans)
  return (
    <section id="preco" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 text-center sm:px-6">
      <EditableText as="h2" path={['pricing', 'title']} value={pricing.title || 'Investimento na Consultoria'} className="section-title" />
      <EditableText
        as="p"
        path={['pricing', 'intro']}
        value={pricing.intro || 'Trabalhamos com um valor justo e acessível para entregar um planejamento completo, seguro e detalhado para a sua viagem dos sonhos.'}
        className="mx-auto mt-4 max-w-xl text-gray-600"
      />

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan, pi) => (
          <PricingPlanCard key={pi} plan={plan} index={pi} total={plans.length} planList={planList} editing={editing} />
        ))}
        <AddItemButton
          list={planList}
          item={{ name: '', priceLabel: '', priceNote: '', tagline: '', bullets: [] }}
          label="Adicionar plano"
          className="min-h-[10rem]"
        />
      </div>

      <div className="mx-auto mt-8 max-w-xl border-l-4 border-gold-400 bg-gold-50 p-4 text-left text-sm text-navy-800">
        <strong>
          <EditableText path={['pricing', 'paymentLabel']} value={pricing.paymentLabel || 'Forma de pagamento:'} />
        </strong>{' '}
        <EditableText path={['pricing', 'paymentInfo']} value={pricing.paymentInfo?.replace('Forma de pagamento:', '').trim()} />
      </div>
      <WhatsAppLink whatsapp={brand.whatsapp} message={brand.whatsappMessage} className="btn-gold mt-8">
        <EditableText path={['brand', 'whatsappLabel']} value={brand.whatsappLabel || 'Falar no WhatsApp'} />
      </WhatsAppLink>
    </section>
  )
}

function PricingPlanCard({ plan, index, total, planList, editing }) {
  const bullets = plan.bullets || []
  const bulletList = useListEditing(['pricing', 'plans', index, 'bullets'], bullets)
  const base = ['pricing', 'plans', index]
  return (
    <div className="edit-item flex flex-col rounded-2xl border-2 border-gold-400 bg-white p-6 text-left shadow-sm">
      <ItemControls list={planList} index={index} total={total} />
      <EditableText as="h3" path={[...base, 'name']} value={plan.name} className="block text-base font-bold uppercase tracking-wide text-navy-700" />
      <EditableText as="p" path={[...base, 'priceLabel']} value={plan.priceLabel} className="mt-3 font-serif text-3xl font-extrabold text-gold-600" />
      {(plan.priceNote || editing) && (
        <EditableText
          as="p"
          path={[...base, 'priceNote']}
          value={plan.priceNote}
          placeholder="Observação do valor (opcional)"
          className="mt-1 text-xs italic text-gray-400"
        />
      )}
      <EditableText as="p" path={[...base, 'tagline']} value={plan.tagline} className="mt-4 text-sm leading-relaxed text-gray-600" />
      <ul className="mt-5 flex-1 space-y-3 text-sm text-navy-800">
        {bullets.map((bullet, i) => (
          <li key={i} className="edit-item flex gap-2 leading-relaxed">
            <span className="mt-0.5 flex-shrink-0 text-gold-500">✓</span>
            <EditableText path={[...base, 'bullets', i]} value={bullet} className="min-w-0 flex-1" />
            {bulletList && (
              <button
                type="button"
                title="Remover tópico"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => bulletList.remove(i)}
                className="flex-shrink-0 self-start rounded-full px-1.5 text-xs text-red-500 opacity-40 hover:bg-red-50 hover:opacity-100"
              >
                ✕
              </button>
            )}
          </li>
        ))}
        {bulletList && (
          <li>
            <button
              type="button"
              onClick={() => bulletList.add('')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              + Adicionar tópico
            </button>
          </li>
        )}
      </ul>
    </div>
  )
}

export function Consultant({ consultant }) {
  const editing = !!useEditor()
  return (
    <section id="consultora" className="scroll-mt-20 bg-navy-50 py-16">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <EditableText as="h2" path={['consultant', 'sectionTitle']} value={consultant.sectionTitle || 'Conheça a Consultora'} className="section-title" />
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
          <EditableText as="h3" path={['consultant', 'name']} value={consultant.name} className="mt-4 block font-serif text-2xl font-bold text-navy-900" />
          <EditableText as="p" path={['consultant', 'bio']} value={consultant.bio} className="mt-4 text-gray-600" />
          {(consultant.quote || editing) && (
            <p className="mt-6 border-t border-gray-200 pt-6 font-serif italic text-lg text-navy-800">
              &ldquo;<EditableText path={['consultant', 'quote']} value={consultant.quote} />&rdquo;
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export function CTA({ cta, brand }) {
  return (
    <section id="contato" className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 text-center sm:px-6">
      <div className="card p-10">
        <EditableText as="h2" path={['cta', 'title']} value={cta.title} className="section-title" />
        <EditableText as="p" path={['cta', 'desc']} value={cta.desc} className="mx-auto mt-4 max-w-xl text-gray-600" />
        <WhatsAppLink whatsapp={brand.whatsapp} message={brand.whatsappMessage} className="btn-gold mt-8">
          <EditableText path={['brand', 'whatsappLabel']} value={brand.whatsappLabel || 'Falar no WhatsApp'} />
        </WhatsAppLink>
      </div>
    </section>
  )
}

export function Footer({ brand, footer, socialLinks }) {
  return (
    <footer id="redes-sociais" className="scroll-mt-20 border-t border-gray-100 py-10 text-center text-sm text-gray-500">
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
      <p>
        © {new Date().getFullYear()} {brand.name}. <EditableText path={['footer', 'text']} value={footer.text} />
      </p>
      <p className="mt-2">
        {brand.instagram && <span>{brand.instagram}</span>}
        {brand.instagram && brand.whatsapp && <span className="mx-2">|</span>}
        {brand.whatsapp && <span>{formatPhoneDisplay(brand.whatsapp)}</span>}
      </p>
    </footer>
  )
}
