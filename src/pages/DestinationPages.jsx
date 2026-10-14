import { Link, useParams } from 'react-router-dom'
import { Header, Footer, DestinationCard } from './PublicSite.jsx'
import { WhatsAppFloatButton } from '../components/WhatsAppButton.jsx'
import { EditableText, useEditor } from '../components/Editable.jsx'
import { useSiteContent } from '../lib/useSiteContent.js'
import { defaultContent } from '../lib/defaultContent.js'
import { slugify } from '../lib/slug.js'
import { getCountryFlag } from '../lib/flags.js'

// Mescla os textos salvos com os padrões (o conteúdo antigo salvo no banco não tem esse bloco).
function withDefaults(saved) {
  return { ...defaultContent.destinationPages, ...saved }
}

// Troca {regiao} e {pais} pelos nomes de verdade (só no site público).
function fillTokens(text, vars) {
  return (text || '').replace(/\{(regiao|pais)\}/g, (match, key) => (vars && vars[key] != null ? vars[key] : match))
}

// Texto editável das páginas de destino. No admin mostra o modelo cru (com {regiao}/{pais});
// no site público já troca pelos nomes.
function DpText({ dp, field, vars, ...rest }) {
  const editor = useEditor()
  const raw = dp[field] || ''
  return <EditableText path={['destinationPages', field]} value={editor ? raw : fillTokens(raw, vars)} {...rest} />
}

function TokenHint({ token, what }) {
  const editor = useEditor()
  if (!editor) return null
  return (
    <p className="mt-1 text-xs text-blue-600">
      Dica: <strong>{token}</strong> é trocado automaticamente pelo nome {what} em cada página.
    </p>
  )
}

function Breadcrumbs({ items, dp }) {
  const editor = useEditor()
  const home = <DpText dp={dp} field="homeLabel" />
  return (
    <nav className="mx-auto max-w-6xl px-4 pt-4 text-sm text-gray-500 sm:px-6">
      {editor ? <span>{home}</span> : <Link to="/" className="hover:text-navy-700">{home}</Link>}
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

// Com `path` (prévia do admin na aba Destinos) título e descrição viram editáveis.
// path = caminho do item no conteúdo; titleKey = campo do nome ('region' na região, 'name' no país).
export function Banner({ title, desc, coverUrl, flag, height = 'h-72 sm:h-96', path, titleKey = 'name' }) {
  const editing = !!useEditor() && !!path
  const titleClass = 'font-serif text-3xl font-bold text-white sm:text-5xl'
  if (coverUrl) {
    return (
      <div className={`relative mx-auto mt-4 max-w-6xl overflow-hidden ${editing ? '' : height}`}>
        <img src={coverUrl} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-navy-900/10 to-transparent" />
        <div className={editing ? 'relative flex min-h-[10rem] flex-col justify-end p-5 sm:p-10' : 'relative flex h-full flex-col justify-end p-5 sm:p-10'}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-300">{flag}</p>
          {editing ? (
            <>
              <EditableText as="h1" path={[...path, titleKey]} value={title} placeholder="Título" className={titleClass} />
              <EditableText as="p" path={[...path, 'desc']} value={desc} placeholder="Descrição (opcional)" className="mt-2 max-w-2xl text-navy-100 sm:text-lg" />
            </>
          ) : (
            <>
              <h1 className={titleClass}>{title}</h1>
              {desc && <p className="mt-2 max-w-2xl text-navy-100 sm:text-lg">{desc}</p>}
            </>
          )}
        </div>
      </div>
    )
  }
  const plainTitleClass =
    'flex items-center gap-2 border-l-4 border-gold-400 pl-4 font-serif text-3xl font-bold text-navy-900 sm:text-4xl'
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {editing ? (
        <>
          <EditableText as="h1" path={[...path, titleKey]} value={title} placeholder="Título" className={plainTitleClass} />
          <EditableText as="p" path={[...path, 'desc']} value={desc} placeholder="Descrição (opcional)" className="mt-3 max-w-2xl pl-4 text-gray-600" />
        </>
      ) : (
        <>
          <h1 className={plainTitleClass}>{title}</h1>
          {desc && <p className="mt-3 max-w-2xl pl-4 text-gray-600">{desc}</p>}
        </>
      )}
    </div>
  )
}

// Com `path` (prévia do admin na aba Destinos) nome e descrição do país viram editáveis.
export function ExploreCard({ to, name, coverUrl, subtitle, flag, preview = false, seeMoreLabel = defaultContent.destinationPages.seeMoreLabel, path, namePlaceholder = 'Nome do país' }) {
  const inEditor = !!useEditor()
  const editing = inEditor && !!path
  // Dentro do admin nunca é link: clicar no texto edita.
  const Tag = preview || inEditor ? 'div' : Link
  const linkProps = Tag === 'div' ? {} : { to }
  return (
    <Tag
      {...linkProps}
      className={
        editing
          ? 'group relative block min-h-[11rem] overflow-hidden rounded-xl bg-navy-900 shadow-sm'
          : 'group relative block h-44 overflow-hidden rounded-xl bg-navy-900 shadow-sm transition-transform hover:scale-[1.02]'
      }
    >
      {coverUrl ? (
        <img src={coverUrl} alt={name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900 text-5xl">
          {flag || '📍'}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent" />
      <div className={editing ? 'relative flex min-h-[11rem] flex-col justify-end p-4' : 'absolute inset-0 flex flex-col justify-end p-4'}>
        <h3 className="flex items-center gap-1.5 font-serif text-lg font-bold text-white">
          {flag && <span>{flag}</span>}
          {editing ? <EditableText path={[...path, 'name']} value={name} placeholder={namePlaceholder} className="min-w-0 flex-1" /> : name}
        </h3>
        {editing ? (
          <EditableText as="p" path={[...path, 'desc']} value={subtitle} placeholder="Descrição (opcional)" className="mt-0.5 text-xs text-navy-100" />
        ) : (
          subtitle && <p className="mt-0.5 line-clamp-2 text-xs text-navy-100">{subtitle}</p>
        )}
        <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-gold-300">
          <EditableText path={['destinationPages', 'seeMoreLabel']} value={seeMoreLabel} />
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Tag>
  )
}

function Loading() {
  return <div className="flex min-h-screen items-center justify-center text-navy-700">Carregando…</div>
}

// Mensagem(ns) de "não encontrado" + botão de voltar. No admin vários campos aparecem juntos.
function NotFoundBlock({ dp, fields, backTo = '/', compact = false }) {
  const editor = useEditor()
  const back = <DpText dp={dp} field="backHomeLabel" />
  return (
    <div className={`mx-auto max-w-2xl px-4 text-center sm:px-6 ${compact ? 'py-8' : 'py-20'}`}>
      {fields.map((field, i) => (
        <DpText key={i} dp={dp} field={field} as="p" className={`text-lg text-gray-600 ${i > 0 ? 'mt-2' : ''}`} />
      ))}
      {editor ? (
        <span className="btn-navy mt-6 inline-flex">{back}</span>
      ) : (
        <Link to={backTo} className="btn-navy mt-6 inline-flex">{back}</Link>
      )}
    </div>
  )
}

// Mensagem de lista vazia. Fica sempre visível no admin (pra poder editar), mesmo com itens na lista.
function EmptyMessage({ dp, field, isEmpty, hint }) {
  const editor = useEditor()
  if (isEmpty) return <DpText dp={dp} field={field} as="p" className="text-sm text-gray-400" />
  if (!editor) return null
  return (
    <div className="col-span-full rounded-lg border border-dashed border-gray-300 p-3">
      <p className="mb-1 text-xs text-gray-400">{hint}</p>
      <DpText dp={dp} field={field} as="p" className="text-sm text-gray-400" />
    </div>
  )
}

// Miolo da página de região (sem Header/Footer). Usado pela página real e pela prévia do admin.
export function RegionView({ group, dp, bannerHeight }) {
  const editor = useEditor()
  const regionSlug = slugify(group.region)
  const countries = (group.items || []).filter((c) => c.name)
  return (
    <>
      <Breadcrumbs dp={dp} items={[{ label: group.region }]} />
      <Banner title={group.region} desc={group.desc} coverUrl={group.coverUrl} height={bannerHeight} />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <DpText dp={dp} field="regionTitle" vars={{ regiao: group.region }} as="h2" className="font-serif text-xl font-bold text-navy-900" />
        <TokenHint token="{regiao}" what="da região" />
        {(editor || dp.regionSubtitle) && (
          <DpText dp={dp} field="regionSubtitle" as="p" className="mt-1 text-sm text-gray-500" />
        )}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country, ci) => (
            <ExploreCard
              key={ci}
              to={`/destinos/${regionSlug}/${slugify(country.name)}`}
              name={country.name}
              coverUrl={country.coverUrl}
              subtitle={country.desc}
              flag={getCountryFlag(country.name, '')}
              seeMoreLabel={dp.seeMoreLabel}
              preview={!!editor}
            />
          ))}
          <EmptyMessage
            dp={dp}
            field="regionEmpty"
            isEmpty={countries.length === 0}
            hint="Aparece só quando a região não tiver nenhum país cadastrado:"
          />
        </div>
      </section>
    </>
  )
}

// Miolo da página de país (sem Header/Footer). Também serve pra SUBPÁGINA de um país
// (ex.: Inglaterra dentro do Reino Unido): nesse caso `parent` é o país de cima e
// `country` é a subpágina.
export function CountryView({ group, country, parent, dp, bannerHeight }) {
  const editor = useEditor()
  const regionSlug = slugify(group.region)
  const baseSlugs = parent ? [slugify(parent.name), slugify(country.name)] : [slugify(country.name)]
  const basePath = `/destinos/${regionSlug}/${baseSlugs.join('/')}`
  const cities = (country.subregions || []).filter((c) => c.name)
  // Subpáginas só existem no país (não aninha mais fundo).
  const subpages = parent ? [] : (country.items || []).filter((c) => c.name)
  const crumbs = [{ label: group.region, to: `/destinos/${regionSlug}` }]
  if (parent) crumbs.push({ label: parent.name, to: `/destinos/${regionSlug}/${slugify(parent.name)}` })
  crumbs.push({ label: country.name })
  return (
    <>
      <Breadcrumbs dp={dp} items={crumbs} />
      <Banner
        title={country.name}
        desc={country.desc}
        coverUrl={country.coverUrl}
        flag={getCountryFlag((parent || country).name, '')}
        height={bannerHeight}
      />

      {subpages.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
          <h2 className="font-serif text-xl font-bold text-navy-900">Explore {country.name}</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subpages.map((sub, i) => (
              <ExploreCard
                key={i}
                to={`${basePath}/${slugify(sub.name)}`}
                name={sub.name}
                coverUrl={sub.coverUrl}
                subtitle={sub.desc}
                seeMoreLabel={dp.seeMoreLabel}
                preview={!!editor}
              />
            ))}
          </div>
        </section>
      )}

      {(subpages.length === 0 || cities.length > 0) && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <DpText dp={dp} field="countryTitle" vars={{ pais: country.name }} as="h2" className="font-serif text-xl font-bold text-navy-900" />
          <TokenHint token="{pais}" what="do país" />
          {(editor || dp.countrySubtitle) && (
            <DpText dp={dp} field="countrySubtitle" as="p" className="mt-1 text-sm text-gray-500" />
          )}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city, i) => {
              const card = (
                <DestinationCard
                  name={city.name}
                  desc={city.desc}
                  imageUrl={city.imageUrl}
                  imageMode={city.imageMode}
                  images={city.images}
                  photoCaption={city.photoCaption}
                />
              )
              return editor ? (
                <div key={i}>{card}</div>
              ) : (
                <Link key={i} to={`${basePath}/${slugify(city.name)}`} className="block">
                  {card}
                </Link>
              )
            })}
            <EmptyMessage
              dp={dp}
              field="countryEmpty"
              isEmpty={cities.length === 0}
              hint="Aparece só quando o país não tiver nenhuma cidade cadastrada:"
            />
          </div>
        </section>
      )}
      {subpages.length > 0 && cities.length === 0 && <div className="pb-10" />}
    </>
  )
}

// Miolo da página de cidade (sem Header/Footer). `sub` = subpágina do país onde a cidade está (opcional).
export function CityView({ group, country, sub, city, dp }) {
  const regionSlug = slugify(group.region)
  const countrySlug = slugify(country.name)
  const crumbs = [
    { label: group.region, to: `/destinos/${regionSlug}` },
    { label: country.name, to: `/destinos/${regionSlug}/${countrySlug}` },
  ]
  if (sub) crumbs.push({ label: sub.name, to: `/destinos/${regionSlug}/${countrySlug}/${slugify(sub.name)}` })
  crumbs.push({ label: city.name })
  return (
    <>
      <Breadcrumbs dp={dp} items={crumbs} />

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
          {getCountryFlag(country.name, '')} {sub ? `${sub.name}, ` : ''}{country.name} · {group.region}
        </p>
      </section>
    </>
  )
}

export function RegionPage() {
  const { regionSlug } = useParams()
  const { content, loading } = useSiteContent()
  if (loading) return <Loading />

  const { brand, footer, socialLinks, destinationGroups } = content
  const dp = withDefaults(content.destinationPages)
  const group = (destinationGroups || []).find((g) => slugify(g.region) === regionSlug)

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      {!group ? (
        <NotFoundBlock dp={dp} fields={['regionNotFound']} />
      ) : (
        <RegionView group={group} dp={dp} />
      )}
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} message={brand.whatsappMessage} />
    </div>
  )
}

export function CountryPage() {
  const { regionSlug, countrySlug } = useParams()
  const { content, loading } = useSiteContent()
  if (loading) return <Loading />

  const { brand, footer, socialLinks, destinationGroups } = content
  const dp = withDefaults(content.destinationPages)
  const group = (destinationGroups || []).find((g) => slugify(g.region) === regionSlug)
  const country = group && (group.items || []).find((c) => slugify(c.name) === countrySlug)

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      {!group || !country ? (
        <NotFoundBlock dp={dp} fields={['countryNotFound']} />
      ) : (
        <CountryView group={group} country={country} dp={dp} />
      )}
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} message={brand.whatsappMessage} />
    </div>
  )
}

// Atende /destinos/:regiao/:pais/:terceiro e /destinos/:regiao/:pais/:terceiro/:cidade.
// O terceiro nível é primeiro tentado como SUBPÁGINA do país (ex.: Inglaterra); se não houver,
// é uma cidade do país (como sempre foi). Com 4 níveis, é a cidade dentro da subpágina.
export function CityPage() {
  const { regionSlug, countrySlug, thirdSlug, citySlug } = useParams()
  const { content, loading } = useSiteContent()
  if (loading) return <Loading />

  const { brand, footer, socialLinks, destinationGroups } = content
  const dp = withDefaults(content.destinationPages)
  const group = (destinationGroups || []).find((g) => slugify(g.region) === regionSlug)
  const country = group && (group.items || []).find((c) => slugify(c.name) === countrySlug)
  const sub = country && (country.items || []).find((c) => c.name && slugify(c.name) === thirdSlug)
  const findCity = (page, slug) => page && (page.subregions || []).find((c) => slugify(c.name) === slug)

  let body
  if (citySlug) {
    const city = findCity(sub, citySlug)
    body = city ? <CityView group={group} country={country} sub={sub} city={city} dp={dp} /> : null
  } else if (sub) {
    body = <CountryView group={group} country={sub} parent={country} dp={dp} />
  } else {
    const city = findCity(country, thirdSlug)
    body = city ? <CityView group={group} country={country} city={city} dp={dp} /> : null
  }

  return (
    <div className="min-h-screen bg-white">
      <Header brand={brand} />
      {body || <NotFoundBlock dp={dp} fields={['cityNotFound']} />}
      <Footer brand={brand} footer={footer} socialLinks={socialLinks} />
      <WhatsAppFloatButton whatsapp={brand.whatsapp} message={brand.whatsappMessage} />
    </div>
  )
}
