import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, saveContent, uploadImage, deleteImage, clearToken, getToken } from '../lib/api.js'
import { defaultContent } from '../lib/defaultContent.js'
import { mergeContent } from '../lib/mergeContent.js'
import { LOGO_SIZES, getLogoSize } from '../lib/logoSize.js'
import { SOCIAL_PLATFORMS, getPlatform } from '../components/SocialIcons.jsx'
import ImageCropEditor from '../components/ImageCropEditor.jsx'
import {
  Destinations,
  OpenLevelButton,
  DestinationCard,
  Header,
  Hero,
  About,
  Services,
  Reasons,
  Process,
  Pricing,
  Consultant,
  CTA,
  Footer,
} from './PublicSite.jsx'
import { InlineEditor, useListEditing, ItemControls, AddItemButton, MoveToSelect, useEditor } from '../components/Editable.jsx'
import { Banner, ExploreCard } from './DestinationPages.jsx'
import { getCountryFlag } from '../lib/flags.js'
import { withConfirmRemove } from '../lib/confirmRemove.js'
import { moveCountry } from '../lib/moveDestinations.js'
import DestinationsGlobe from '../components/DestinationsGlobe.jsx'
import { LandingView } from './LandingConsultoria.jsx'

const TABS = [
  { key: 'marca', label: 'Marca e Contato', color: 'amber' },
  { key: 'social', label: 'Redes Sociais', color: 'pink' },
  { key: 'sobre', label: 'Sobre', color: 'emerald' },
  { key: 'destinos', label: 'Destinos', color: 'rose' },
  { key: 'globo', label: 'Globo 3D', color: 'sky' },
  { key: 'servicos', label: 'Serviços', color: 'violet' },
  { key: 'motivos', label: 'Motivos', color: 'teal' },
  { key: 'processo', label: 'Como funciona', color: 'orange' },
  { key: 'preco', label: 'Preço', color: 'indigo' },
  { key: 'consultora', label: 'Consultora', color: 'fuchsia' },
  { key: 'final', label: 'Chamada final', color: 'cyan' },
  { key: 'landing', label: 'Página de anúncios', color: 'emerald' },
]

const TAB_STYLES = {
  amber: { active: 'bg-amber-500 border-amber-500 text-white', inactive: 'border-amber-200 text-amber-700 hover:bg-amber-50', top: 'border-t-amber-500' },
  pink: { active: 'bg-pink-500 border-pink-500 text-white', inactive: 'border-pink-200 text-pink-700 hover:bg-pink-50', top: 'border-t-pink-500' },
  sky: { active: 'bg-sky-500 border-sky-500 text-white', inactive: 'border-sky-200 text-sky-700 hover:bg-sky-50', top: 'border-t-sky-500' },
  emerald: { active: 'bg-emerald-500 border-emerald-500 text-white', inactive: 'border-emerald-200 text-emerald-700 hover:bg-emerald-50', top: 'border-t-emerald-500' },
  rose: { active: 'bg-rose-500 border-rose-500 text-white', inactive: 'border-rose-200 text-rose-700 hover:bg-rose-50', top: 'border-t-rose-500' },
  violet: { active: 'bg-violet-500 border-violet-500 text-white', inactive: 'border-violet-200 text-violet-700 hover:bg-violet-50', top: 'border-t-violet-500' },
  teal: { active: 'bg-teal-500 border-teal-500 text-white', inactive: 'border-teal-200 text-teal-700 hover:bg-teal-50', top: 'border-t-teal-500' },
  orange: { active: 'bg-orange-500 border-orange-500 text-white', inactive: 'border-orange-200 text-orange-700 hover:bg-orange-50', top: 'border-t-orange-500' },
  indigo: { active: 'bg-indigo-500 border-indigo-500 text-white', inactive: 'border-indigo-200 text-indigo-700 hover:bg-indigo-50', top: 'border-t-indigo-500' },
  fuchsia: { active: 'bg-fuchsia-500 border-fuchsia-500 text-white', inactive: 'border-fuchsia-200 text-fuchsia-700 hover:bg-fuchsia-50', top: 'border-t-fuchsia-500' },
  cyan: { active: 'bg-cyan-500 border-cyan-500 text-white', inactive: 'border-cyan-200 text-cyan-700 hover:bg-cyan-50', top: 'border-t-cyan-500' },
}


const REGION_COLORS = [
  { border: 'border-l-amber-400', header: 'bg-amber-50', badge: 'bg-amber-400' },
  { border: 'border-l-sky-400', header: 'bg-sky-50', badge: 'bg-sky-400' },
  { border: 'border-l-emerald-400', header: 'bg-emerald-50', badge: 'bg-emerald-400' },
  { border: 'border-l-rose-400', header: 'bg-rose-50', badge: 'bg-rose-400' },
  { border: 'border-l-violet-400', header: 'bg-violet-50', badge: 'bg-violet-400' },
  { border: 'border-l-teal-400', header: 'bg-teal-50', badge: 'bg-teal-400' },
  { border: 'border-l-orange-400', header: 'bg-orange-50', badge: 'bg-orange-400' },
  { border: 'border-l-indigo-400', header: 'bg-indigo-50', badge: 'bg-indigo-400' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('marca')

  useEffect(() => {
    if (!getToken()) {
      navigate('/admin', { replace: true })
      return
    }
    getContent()
      .then((data) => setContent(mergeContent(defaultContent, data)))
      .catch(() => setContent(defaultContent))
  }, [])

  if (!content) {
    return <div className="flex min-h-screen items-center justify-center">Carregando…</div>
  }

  function update(path, value) {
    setContent((prev) => setDeep(prev, path, value))
  }

  async function handleSave() {
    setSaving(true)
    setStatus('')
    try {
      await saveContent(content)
      setStatus('Salvo com sucesso!')
    } catch (err) {
      setStatus('Erro ao salvar: ' + err.message)
    } finally {
      setSaving(false)
      setTimeout(() => setStatus(''), 4000)
    }
  }

  function handleLogout() {
    clearToken()
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-navy-50 pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <h1 className="font-serif text-lg font-bold text-navy-900">Editar site — {content.brand.name}</h1>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noreferrer" className="text-sm text-navy-600 underline">Ver site</a>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">Sair</button>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6">
        {status && (
          <div className="mb-4 rounded-lg bg-navy-800 px-4 py-2 text-sm text-white">{status}</div>
        )}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <aside className="flex gap-2 overflow-x-auto rounded-2xl bg-navy-900 p-3 sm:sticky sm:top-20 sm:w-60 sm:flex-shrink-0 sm:flex-col sm:overflow-visible sm:p-4">
            {TABS.map((tab) => {
              const style = TAB_STYLES[tab.color]
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 whitespace-nowrap rounded-lg px-4 py-2.5 text-left text-sm font-semibold transition-colors sm:whitespace-normal ${
                    isActive ? style.active : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </aside>

          <div className={`min-w-0 flex-1 rounded-2xl border-t-4 bg-white p-6 shadow-sm ${TAB_STYLES[TABS.find((t) => t.key === activeTab).color].top}`}>
          {activeTab === 'marca' && (
            <Panel title="Marca e Contato">
              <p className="-mt-2 text-xs text-gray-400">
                Dica: os nomes do menu (Sobre, Destinos, Serviços…) e o texto do botão de WhatsApp do topo também se editam clicando neles aqui na prévia.
              </p>
              <InlineEditor update={update}>
                <Header brand={content.brand} />
                <Hero brand={content.brand} hero={content.hero} destinationGroups={content.destinationGroups} />
              </InlineEditor>

              <div className="rounded-xl border border-gray-200 p-4">
                <p className="mb-3 text-sm font-semibold text-navy-900">Logo e contatos</p>
                <div className="space-y-4">
                  <ImageField label="Logo" shape="logo" value={content.brand.logoUrl} onChange={(v) => update(['brand', 'logoUrl'], v)} />
                  <LogoSizeField
                    logoUrl={content.brand.logoUrl}
                    value={content.brand.logoSize}
                    onChange={(v) => update(['brand', 'logoSize'], v)}
                    scale={content.brand.logoScale}
                    onScaleChange={(v) => update(['brand', 'logoScale'], v)}
                    offsetX={content.brand.logoOffsetX}
                    offsetY={content.brand.logoOffsetY}
                    onOffsetXChange={(v) => update(['brand', 'logoOffsetX'], v)}
                    onOffsetYChange={(v) => update(['brand', 'logoOffsetY'], v)}
                  />
                  <TextField label="Instagram (ex: @seuinstagram)" value={content.brand.instagram} onChange={(v) => update(['brand', 'instagram'], v)} />
                  <TextField
                    label="WhatsApp (com DDI e DDD, só números, ex: 5551987654321)"
                    value={content.brand.whatsapp}
                    onChange={(v) => update(['brand', 'whatsapp'], v.replace(/\D/g, ''))}
                  />
                  <TextArea
                    label="Mensagem padrão ao clicar em 'Falar no WhatsApp'"
                    value={content.brand.whatsappMessage}
                    onChange={(v) => update(['brand', 'whatsappMessage'], v)}
                  />
                </div>
              </div>
            </Panel>
          )}

          {activeTab === 'social' && (
            <Panel title="Redes Sociais">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <SocialLinksEditor items={content.socialLinks} onChange={(v) => update(['socialLinks'], v)} />
                <div className="lg:sticky lg:top-24 lg:self-start">
                  <p className="mb-2 text-sm font-semibold text-navy-900">👁 Pré-visualização no site</p>
                  <p className="mb-3 text-xs text-gray-400">Atualiza ao vivo enquanto você edita, antes mesmo de salvar.</p>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white" onClickCapture={(e) => e.target.closest('a') && e.preventDefault()}>
                    <Footer brand={content.brand} footer={content.footer} socialLinks={content.socialLinks} />
                  </div>
                </div>
              </div>
            </Panel>
          )}

          {activeTab === 'sobre' && (
            <Panel title="Sobre">
              <InlineEditor update={update}>
                <About about={content.about} />
              </InlineEditor>
            </Panel>
          )}

          {activeTab === 'destinos' && (
            <Panel title="Destinos (agrupados por região ou continente)">
              <p className="-mt-2 mb-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                <strong>Como organizar:</strong> o primeiro nível é a <strong>região ou continente</strong> (ex.: Europa, América do Sul, África). Dentro dele ficam os <strong>países</strong> (ex.: Reino Unido, Portugal) e dentro de cada país as <strong>cidades</strong> (ex.: Londres). Pra deixar o Reino Unido dentro da Europa, abra o país na prévia e use <strong>Mover para…</strong>, ou use <strong>Juntar em…</strong> no card de uma região inteira.
              </p>
              <p className="mb-2 text-xs text-gray-400">
                Os botões que aparecem no topo do site (embaixo do título) são gerados automaticamente a partir do nome de cada região aqui embaixo — adicionar ou remover uma região adiciona ou remove o botão sozinho, sem precisar configurar em outro lugar.
                Atenção: renomear uma região, país ou cidade também muda o endereço (URL) dela no site.
              </p>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="mb-3 text-sm font-semibold text-navy-900">Textos dos cards de região / continente</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <TextField label="Texto do card sem países" value={content.destinationsLabels?.cardCta} onChange={(v) => update(['destinationsLabels', 'cardCta'], v)} />
                  <TextField label="Mensagem quando não há nenhuma região / continente" value={content.destinationsLabels?.empty} onChange={(v) => update(['destinationsLabels', 'empty'], v)} />
                  <TextField label="Palavra no singular (ex: 1 país)" value={content.destinationsLabels?.countrySingular} onChange={(v) => update(['destinationsLabels', 'countrySingular'], v)} />
                  <TextField label="Palavra no plural (ex: 5 países)" value={content.destinationsLabels?.countryPlural} onChange={(v) => update(['destinationsLabels', 'countryPlural'], v)} />
                </div>
              </div>
              <InlineEditor update={update}>
                <DestinationsPreview
                  groups={content.destinationGroups}
                  title={content.destinationsTitle}
                  subtitle={content.destinationsSubtitle}
                  labels={content.destinationsLabels}
                  globeTitle={content.globeTitle}
                  globeSubtitle={content.globeSubtitle}
                  seeMoreLabel={content.destinationPages?.seeMoreLabel}
                />
              </InlineEditor>

              <details className="rounded-xl border border-gray-200 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-navy-900">
                  Fotos, capas e coordenadas do globo (edição avançada)
                </summary>
                <p className="mb-4 mt-3 text-xs text-gray-400">
                  É aqui que se sobem as fotos das cidades, as capas de região/continente e de país e as coordenadas (latitude/longitude) do globo 3D. Textos, ordem e o que existe (adicionar/remover) dá pra mudar direto na prévia acima; o que você mexer lá aparece aqui e vice-versa.
                </p>
                <DestinationGroupsEditor
                  groups={content.destinationGroups}
                  onChange={(v) => update(['destinationGroups'], v)}
                />
              </details>
            </Panel>
          )}

          {activeTab === 'globo' && (
            <Panel title="Globo 3D">
              <button
                type="button"
                onClick={() => update(['showGlobe'], !content.showGlobe)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  content.showGlobe
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : 'border-gray-300 bg-gray-50 text-gray-500'
                }`}
              >
                🌐 Globo 3D na home: {content.showGlobe ? 'ativado' : 'desativado'} (clique pra {content.showGlobe ? 'desativar' : 'ativar'})
              </button>
              <InlineEditor update={update}>
                <DestinationsGlobe groups={content.destinationGroups} title={content.globeTitle} subtitle={content.globeSubtitle} />
              </InlineEditor>
            </Panel>
          )}

          {activeTab === 'servicos' && (
            <Panel title="O que ajudamos a organizar">
              <InlineEditor update={update}>
                <Services services={content.services} title={content.servicesTitle} />
              </InlineEditor>
            </Panel>
          )}

          {activeTab === 'motivos' && (
            <Panel title="Motivos para contratar">
              <InlineEditor update={update}>
                <Reasons reasons={content.reasons} title={content.reasonsTitle} />
              </InlineEditor>
            </Panel>
          )}

          {activeTab === 'processo' && (
            <Panel title="Como funciona (passo a passo)">
              <InlineEditor update={update}>
                <Process process={content.process} title={content.processTitle} />
              </InlineEditor>
            </Panel>
          )}

          {activeTab === 'preco' && (
            <Panel title="Investimento / Preço">
              <InlineEditor update={update}>
                <Pricing pricing={content.pricing} brand={content.brand} />
              </InlineEditor>
            </Panel>
          )}

          {activeTab === 'consultora' && (
            <Panel title="Consultora(a)">
              <InlineEditor update={update}>
                <Consultant consultant={content.consultant} />
              </InlineEditor>
              <div className="rounded-xl border border-gray-200 p-4">
                <ImageField label="Foto da consultora" shape="portrait" value={content.consultant.photoUrl} onChange={(v) => update(['consultant', 'photoUrl'], v)} />
              </div>
            </Panel>
          )}

          {activeTab === 'final' && (
            <Panel title="Chamada final e rodapé">
              <InlineEditor update={update}>
                <CTA cta={content.cta} brand={content.brand} />
                <Footer brand={content.brand} footer={content.footer} socialLinks={content.socialLinks} />
              </InlineEditor>
            </Panel>
          )}

          {activeTab === 'landing' && (
            <Panel title="Página de anúncios (/consultoria)">
              <p className="-mt-2 mb-2 text-xs text-gray-400">
                Página que abre pra quem chega pelos anúncios. Os textos próprios dela (título, botão verde, avisos, chamada final) só mudam aqui. O valor do investimento vem da aba Preço (1º plano), e logo, frase de efeito, motivos, citação da consultora e rodapé são os mesmos do site: editar aqui também muda lá.
              </p>
              <InlineEditor update={update}>
                <LandingView content={content} />
              </InlineEditor>

              <div className="rounded-xl border border-gray-200 p-4">
                <label className="label">Quantos motivos mostrar nessa página (hoje {content.reasons?.length || 0} cadastrados na aba Motivos)</label>
                <input
                  type="number"
                  min="0"
                  max={content.reasons?.length || 0}
                  className="input w-28"
                  value={content.landing?.reasonsCount ?? defaultContent.landing.reasonsCount}
                  onChange={(e) => update(['landing', 'reasonsCount'], e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>

              <a href="/consultoria" target="_blank" rel="noreferrer" className="inline-block text-sm text-navy-600 underline">
                Abrir /consultoria em nova aba
              </a>
            </Panel>
          )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-screen-2xl justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-navy">
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}

function setDeep(obj, path, value) {
  const clone = structuredClone(obj)
  let cur = clone
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
  cur[path[path.length - 1]] = value
  return clone
}

function Panel({ title, children }) {
  return (
    <section>
      <h2 className="mb-4 font-serif text-xl font-bold text-navy-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function TextField({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea className="input" rows={3} value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function LogoSizeField({ logoUrl, value, onChange, scale, onScaleChange, offsetX, offsetY, onOffsetXChange, onOffsetYChange }) {
  const current = getLogoSize(value)
  const scaleValue = scale || 100
  const offsetXValue = offsetX || 0
  const offsetYValue = offsetY || 0

  return (
    <div>
      <label className="label">Tamanho e enquadramento da logo no topo do site</label>

      <div className="mb-3 flex items-center justify-center rounded-xl bg-navy-900 py-10">
        {logoUrl ? (
          <div className={`overflow-hidden rounded-full bg-white p-1 shadow-2xl transition-all duration-200 ${current.hero}`}>
            <img
              src={logoUrl}
              alt="Prévia da logo no site"
              className="h-full w-full object-contain"
              style={{ transform: `translate(${offsetXValue}%, ${offsetYValue}%) scale(${scaleValue / 100})` }}
            />
          </div>
        ) : (
          <div className={`rounded-full border-4 border-gold-400 flex items-center justify-center text-gold-400 font-serif font-bold ${current.hero}`}>
            R
          </div>
        )}
      </div>
      <p className="mb-4 text-xs text-gray-400">
        Assim fica no topo da página. Se o desenho da sua logo não estiver bem no meio do círculo, use os controles de posição abaixo pra empurrar ele.
      </p>

      <p className="label !mb-2">Tamanho do círculo</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(LOGO_SIZES).map(([key, size]) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
              value === key || (!value && key === 'lg')
                ? 'border-navy-800 bg-navy-800 text-white'
                : 'border-gray-300 text-gray-600 hover:border-navy-400'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>

      {logoUrl && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="label !mb-2">Zoom da imagem dentro do círculo ({scaleValue}%)</p>
            <input
              type="range"
              min={60}
              max={180}
              step={5}
              value={scaleValue}
              onChange={(e) => onScaleChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Mais afastado</span>
              <span>Mais perto</span>
            </div>
          </div>

          <div>
            <p className="label !mb-2">Posição horizontal</p>
            <input
              type="range"
              min={-40}
              max={40}
              step={1}
              value={offsetXValue}
              onChange={(e) => onOffsetXChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Esquerda</span>
              <span>Direita</span>
            </div>
          </div>

          <div>
            <p className="label !mb-2">Posição vertical</p>
            <input
              type="range"
              min={-40}
              max={40}
              step={1}
              value={offsetYValue}
              onChange={(e) => onOffsetYChange(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Cima</span>
              <span>Baixo</span>
            </div>
          </div>

          {(offsetXValue !== 0 || offsetYValue !== 0) && (
            <button
              type="button"
              onClick={() => {
                onOffsetXChange(0)
                onOffsetYChange(0)
              }}
              className="text-xs font-semibold text-navy-700 hover:underline"
            >
              Redefinir posição
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const IMAGE_PREVIEW_STYLES = {
  logo: 'h-24 w-24 rounded-full object-contain bg-white border border-gray-200 p-1',
  avatar: 'h-20 w-20 rounded-full object-cover border border-gray-200',
  portrait: 'h-28 w-24 rounded-lg object-cover border border-gray-200',
  photo: 'h-20 w-28 rounded-lg object-cover border border-gray-200',
  banner: 'h-16 w-full max-w-xs rounded-lg object-cover border border-gray-200',
}

const IMAGE_ASPECT = {
  logo: { ratio: 1, editorShape: 'circle', recommended: '800 × 800px (quadrada)' },
  avatar: { ratio: 1, editorShape: 'circle', recommended: '800 × 800px (quadrada)' },
  portrait: { ratio: 3 / 4, editorShape: 'rect', recommended: '900 × 1200px (vertical)' },
  photo: { ratio: 4 / 3, editorShape: 'rect', recommended: '1200 × 900px (horizontal)' },
  banner: { ratio: 16 / 6, editorShape: 'rect', recommended: '1600 × 600px (bem largo e baixo)', fit: 'cover', exportWidth: 3200 },
}

function ImageField({ label, value, onChange, shape = 'photo' }) {
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [editingSrc, setEditingSrc] = useState(null)
  const aspect = IMAGE_ASPECT[shape] || IMAGE_ASPECT.photo

  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setEditingSrc(URL.createObjectURL(file))
    e.target.value = ''
  }

  function handleAdjustExisting() {
    if (!value) return
    setEditingSrc(value)
  }

  async function handleCropConfirm(blob, ext) {
    setEditingSrc(null)
    setUploading(true)
    try {
      const file = new File([blob], `imagem.${ext}`, { type: blob.type })
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      alert('Erro ao enviar imagem: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    if (!value) return
    if (!confirm('Remover esta imagem? Ela será apagada do armazenamento.')) return
    setRemoving(true)
    try {
      // só tenta apagar do storage se for uma imagem enviada por aqui (Vercel Blob)
      if (value.includes('.blob.vercel-storage.com')) {
        await deleteImage(value)
      }
      onChange('')
    } catch (err) {
      alert('Erro ao remover imagem: ' + err.message)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <p className="mb-1 text-xs text-gray-400">Tamanho recomendado da imagem: <strong className="font-semibold text-gray-500">{aspect.recommended}</strong></p>
      <p className="mb-2 text-xs text-gray-400">Pré-visualização de como vai ficar no site:</p>
      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="" className={IMAGE_PREVIEW_STYLES[shape]} />
        ) : (
          <div className={`${IMAGE_PREVIEW_STYLES[shape]} flex items-center justify-center bg-gray-50 text-[10px] text-gray-400`}>
            sem foto
          </div>
        )}
        <div className="flex flex-col gap-1">
          <input type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading || removing} className="text-sm" />
          {uploading && <span className="text-xs text-gray-500">Enviando…</span>}
          {value && !uploading && (
            <button type="button" onClick={handleAdjustExisting} className="text-left text-xs font-semibold text-navy-700 hover:underline">
              Ajustar enquadramento
            </button>
          )}
        </div>
        {value && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={removing}
            className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline"
          >
            {removing ? 'Removendo…' : 'Remover imagem'}
          </button>
        )}
      </div>

      {editingSrc && (
        <ImageCropEditor
          src={editingSrc}
          aspectRatio={aspect.ratio}
          shape={aspect.editorShape}
          fit={aspect.fit || 'contain'}
          exportWidth={aspect.exportWidth || 1000}
          onConfirm={handleCropConfirm}
          onCancel={() => setEditingSrc(null)}
        />
      )}
    </div>
  )
}


function SocialLinksEditor({ items, onChange }) {
  function update(i, field, v) {
    const next = [...(items || [])]
    next[i] = { ...next[i], [field]: v }
    onChange(next)
  }
  function updatePlatform(i, platformKey) {
    const next = [...(items || [])]
    const platform = getPlatform(platformKey)
    next[i] = {
      ...next[i],
      platform: platformKey,
      name: platformKey === 'custom' ? (next[i].name || '') : platform.label,
    }
    onChange(next)
  }
  function remove(i) {
    onChange((items || []).filter((_, idx) => idx !== i))
  }
  function add() {
    onChange([...(items || []), { platform: 'instagram', name: 'Instagram', url: '', iconUrl: '' }])
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-400">
        Escolha uma rede da lista (já usa o logo oficial dela) ou &ldquo;Outra rede&rdquo; pra colocar um nome e um logo manual.
      </p>
      {(items || []).map((social, i) => {
        const platform = getPlatform(social.platform)
        return (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-gray-200 p-4">
            <div className={`mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white ${platform.color}`}>
              {social.platform === 'custom' && social.iconUrl ? (
                <img src={social.iconUrl} alt="" className="h-5 w-5 rounded-full object-contain" />
              ) : (
                <platform.Icon className="h-5 w-5" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div>
                <label className="label">Rede social</label>
                <select className="input" value={social.platform} onChange={(e) => updatePlatform(i, e.target.value)}>
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>

              {social.platform === 'custom' && (
                <>
                  <TextField label="Nome da rede" value={social.name} onChange={(v) => update(i, 'name', v)} />
                  <ImageField
                    label="Logo da rede"
                    shape="avatar"
                    value={social.iconUrl}
                    onChange={(v) => update(i, 'iconUrl', v)}
                  />
                </>
              )}

              <TextField
                label="Link do perfil (URL completa)"
                value={social.url}
                onChange={(v) => update(i, 'url', v)}
              />
            </div>

            <button onClick={() => remove(i)} className="mt-1 text-sm text-red-500 hover:text-red-700">Remover</button>
          </div>
        )
      })}
      <button onClick={add} className="text-sm font-semibold text-navy-700 hover:underline">+ Adicionar rede social</button>
    </div>
  )
}

const MAX_CAROUSEL_IMAGES = 5

function getCityImageUrls(city) {
  if (city.imageMode === 'carousel') {
    return (city.images || []).map((img) => (typeof img === 'string' ? img : img?.url)).filter(Boolean)
  }
  return city.imageUrl ? [city.imageUrl] : []
}

function mediaPatch(mode, urls) {
  return mode === 'carousel'
    ? { imageMode: 'carousel', images: urls.map((url) => ({ url, caption: '' })), imageUrl: '', photoCaption: '' }
    : { imageMode: 'single', imageUrl: urls[0] || '', images: [], photoCaption: '' }
}

function CityMediaEditor({ city, onPatch }) {
  const mode = city.imageMode === 'carousel' ? 'carousel' : 'single'
  const urls = getCityImageUrls(city)
  const max = mode === 'carousel' ? MAX_CAROUSEL_IMAGES : 1
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  function setMode(nextMode) {
    if (nextMode === mode) return
    if (nextMode === 'single' && urls.length > 1 && !confirm('Imagem única mantém só a primeira foto. Continuar?')) return
    onPatch(mediaPatch(nextMode, nextMode === 'single' ? urls.slice(0, 1) : urls))
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setEditing({ src: URL.createObjectURL(file), index: null })
  }

  async function handleCropConfirm(blob, ext) {
    const target = editing
    setEditing(null)
    setUploading(true)
    try {
      const url = await uploadImage(new File([blob], `imagem.${ext}`, { type: blob.type }))
      const next = [...urls]
      if (target.index === null) next.push(url)
      else next[target.index] = url
      onPatch(mediaPatch(mode, next.slice(0, max)))
    } catch (err) {
      alert('Erro ao enviar imagem: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function removeAt(i) {
    if (!confirm('Remover esta foto?')) return
    const url = urls[i]
    onPatch(mediaPatch(mode, urls.filter((_, idx) => idx !== i)))
    if (url.includes('.blob.vercel-storage.com')) {
      deleteImage(url).catch(() => {})
    }
  }

  return (
    <div>
      <p className="label !mb-1">Tipo de mídia</p>
      <p className="mb-2 text-xs text-gray-400">Tamanho recomendado da imagem: <strong className="font-semibold text-gray-500">1200 × 900px (horizontal)</strong></p>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex overflow-hidden rounded-lg border border-gray-300">
          {[
            { key: 'carousel', label: 'Carrossel' },
            { key: 'single', label: 'Imagem única' },
          ].map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setMode(opt.key)}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
                mode === opt.key ? 'bg-navy-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {urls.map((url, i) => (
            <div key={url + i} className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
              <button type="button" onClick={() => setEditing({ src: url, index: i })} title="Ajustar enquadramento" className="h-full w-full">
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
              <button
                type="button"
                onClick={() => removeAt(i)}
                title="Remover foto"
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs leading-none text-white hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          {urls.length < max && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              title="Adicionar foto"
              className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-2xl text-gray-400 hover:border-navy-400 hover:text-navy-600 disabled:opacity-50"
            >
              {uploading ? '…' : '+'}
            </button>
          )}
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {mode === 'carousel' ? `${urls.length}/${MAX_CAROUSEL_IMAGES} fotos · ` : ''}clique numa foto pra ajustar o enquadramento
      </p>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {editing && (
        <ImageCropEditor
          src={editing.src}
          aspectRatio={4 / 3}
          shape="rect"
          onConfirm={handleCropConfirm}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}

function SectionHeader({ icon, title, actionLabel, onAction }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <p className="flex items-center gap-2 text-sm font-bold text-navy-900">
        <span>{icon}</span>
        {title}
      </p>
      {actionLabel && (
        <button type="button" onClick={onAction} className="rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-700">
          + {actionLabel}
        </button>
      )}
    </div>
  )
}

function useReorder(list, onChange) {
  const [dragIndex, setDragIndex] = useState(null)
  const [openIndex, setOpenIndex] = useState(-1)

  function move(from, to) {
    if (from === null || to < 0 || to >= list.length || from === to) return
    const next = [...list]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
    setOpenIndex(-1)
  }

  function dragProps(i) {
    return {
      draggable: true,
      onDragStart: (e) => {
        e.stopPropagation()
        setDragIndex(i)
      },
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => {
        e.stopPropagation()
        move(dragIndex, i)
        setDragIndex(null)
      },
      onDragEnd: (e) => {
        e.stopPropagation()
        setDragIndex(null)
      },
    }
  }

  return { dragIndex, openIndex, setOpenIndex, move, dragProps }
}

function RowHeader({ index, total, open, onToggle, onMove, onRemove, label, prefix, dragProps, className = '' }) {
  return (
    <div {...dragProps} className={`flex items-center gap-1 px-2 py-1.5 ${className}`}>
      <span className="cursor-grab select-none px-1 text-gray-400" title="Arraste pra reordenar">⠿</span>
      <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        {prefix && <span>{prefix}</span>}
        <span className="truncate text-sm font-semibold text-navy-900">{label}</span>
      </button>
      <button type="button" onClick={() => onMove(index, index - 1)} disabled={index === 0} title="Mover pra cima" className="rounded px-1 py-1 text-xs text-gray-500 hover:bg-black/5 disabled:opacity-25">▲</button>
      <button type="button" onClick={() => onMove(index, index + 1)} disabled={index === total - 1} title="Mover pra baixo" className="rounded px-1 py-1 text-xs text-gray-500 hover:bg-black/5 disabled:opacity-25">▼</button>
      <button type="button" onClick={onToggle} className="px-1 py-1 text-gray-500">{open ? '−' : '+'}</button>
      <button type="button" onClick={onRemove} title="Remover" className="px-1 py-1 text-red-400 hover:text-red-600">🗑</button>
    </div>
  )
}

function CitiesEditor({ cities, onChange }) {
  const { dragIndex, openIndex, setOpenIndex, move, dragProps } = useReorder(cities, onChange)

  function patchCity(ci, patch) {
    const next = [...cities]
    next[ci] = { ...next[ci], ...patch }
    onChange(next)
  }
  function addCity() {
    const next = [...cities, { name: '', desc: '', imageMode: 'carousel', images: [], imageUrl: '' }]
    onChange(next)
    setOpenIndex(next.length - 1)
  }
  function removeCity(ci) {
    if (!confirm(`Remover a cidade "${cities[ci].name || 'sem nome'}"?`)) return
    onChange(cities.filter((_, i) => i !== ci))
    setOpenIndex(-1)
  }

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <SectionHeader icon="📍" title="Cidades" actionLabel="Adicionar cidade" onAction={addCity} />
      {cities.length === 0 && <p className="text-xs text-gray-400">Nenhuma cidade ainda. As fotos aparecem só dentro das cidades.</p>}
      <div className="space-y-2">
        {cities.map((city, ci) => {
          const open = openIndex === ci
          return (
            <div
              key={ci}
              className={`overflow-hidden rounded-lg border border-gray-200 bg-white transition-opacity ${dragIndex === ci ? 'opacity-40' : ''}`}
            >
              <RowHeader
                dragProps={dragProps(ci)}
                index={ci}
                total={cities.length}
                open={open}
                onToggle={() => setOpenIndex(open ? -1 : ci)}
                onMove={move}
                onRemove={() => removeCity(ci)}
                label={city.name || 'Nova cidade (sem nome ainda)'}
              />
              {open && (
                <div className="space-y-3 border-t border-gray-200 p-3">
                  <div>
                    <label className="label">Nome da cidade</label>
                    <input className="input text-sm" placeholder="Ex: Aracaju/SE" value={city.name || ''} onChange={(e) => patchCity(ci, { name: e.target.value })} />
                  </div>
                  <CityMediaEditor city={city} onPatch={(patch) => patchCity(ci, patch)} />
                  <div>
                    <label className="label">Descrição da cidade</label>
                    <textarea className="input text-sm" rows={2} value={city.desc || ''} onChange={(e) => patchCity(ci, { desc: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Coordenadas no mapa (opcional, pra aparecer no globo 3D)</label>
                    <div className="flex gap-2">
                      <input
                        className="input text-sm"
                        type="number"
                        step="any"
                        placeholder="Latitude (ex: -22.9068)"
                        value={city.lat ?? ''}
                        onChange={(e) => patchCity(ci, { lat: e.target.value === '' ? undefined : Number(e.target.value) })}
                      />
                      <input
                        className="input text-sm"
                        type="number"
                        step="any"
                        placeholder="Longitude (ex: -43.1729)"
                        value={city.lng ?? ''}
                        onChange={(e) => patchCity(ci, { lng: e.target.value === '' ? undefined : Number(e.target.value) })}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Sem coordenadas, a cidade não aparece no globo (o resto do site continua normal). Pra achar: abre o Google Maps,
                      clica com o botão direito em cima da cidade e copia os dois números que aparecem (latitude, depois longitude).
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CountriesEditor({ countries, onChange }) {
  const { dragIndex, openIndex, setOpenIndex, move, dragProps } = useReorder(countries, onChange)

  function patchCountry(ci, patch) {
    const next = [...countries]
    next[ci] = { ...next[ci], ...patch }
    onChange(next)
  }
  function addCountry() {
    const next = [...countries, { name: '', desc: '', subregions: [] }]
    onChange(next)
    setOpenIndex(next.length - 1)
  }
  function removeCountry(ci) {
    if (!confirm(`Remover o país "${countries[ci].name || 'sem nome'}" e todas as cidades dele?`)) return
    onChange(countries.filter((_, i) => i !== ci))
    setOpenIndex(-1)
  }

  return (
    <div className="mt-4">
      <SectionHeader icon="🚩" title="Países" actionLabel="Adicionar país" onAction={addCountry} />
      {countries.length === 0 && <p className="text-xs text-gray-400">Nenhum país nesta região ainda.</p>}
      <div className="space-y-2">
        {countries.map((country, ci) => {
          const open = openIndex === ci
          const cityCount = (country.subregions || []).length
          return (
            <div
              key={ci}
              className={`overflow-hidden rounded-lg border border-gray-200 bg-white transition-opacity ${dragIndex === ci ? 'opacity-40' : ''}`}
            >
              <RowHeader
                dragProps={dragProps(ci)}
                index={ci}
                total={countries.length}
                open={open}
                onToggle={() => setOpenIndex(open ? -1 : ci)}
                onMove={move}
                onRemove={() => removeCountry(ci)}
                prefix={getCountryFlag(country.name)}
                label={`${country.name || 'Novo país (sem nome ainda)'}${cityCount ? ` · ${cityCount} cidade${cityCount === 1 ? '' : 's'}` : ''}`}
              />
              {open && (
                <div className="space-y-3 border-t border-gray-200 p-3">
                  <div>
                    <label className="label">Nome do país</label>
                    <input className="input text-sm" placeholder="Ex: Brasil" value={country.name || ''} onChange={(e) => patchCountry(ci, { name: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Descrição do país (opcional)</label>
                    <textarea className="input text-sm" rows={2} value={country.desc || ''} onChange={(e) => patchCountry(ci, { desc: e.target.value })} />
                  </div>
                  <ImageField
                    label="Capa do país (opcional, imagem única)"
                    shape="banner"
                    value={country.coverUrl}
                    onChange={(v) => patchCountry(ci, { coverUrl: v })}
                  />
                  <CitiesEditor cities={country.subregions || []} onChange={(v) => patchCountry(ci, { subregions: v })} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const PREVIEW_LEVELS = [
  { key: 'home', label: 'Início' },
  { key: 'regiao', label: 'Região / continente' },
  { key: 'pais', label: 'País' },
  { key: 'cidade', label: 'Cidade' },
  { key: 'globo', label: '🌐 Globo 3D' },
]

// Prévia editável da aba Destinos. Precisa estar dentro de <InlineEditor> (que liga a edição direta).
// Aqui NÃO se filtra por nome: os índices (gi/ci/ki) são sempre os da lista original em
// content.destinationGroups, senão a edição cairia no item errado.
function DestinationsPreview({ groups: rawGroups, initialLevel = 'home', title, subtitle, labels, globeTitle, globeSubtitle, seeMoreLabel }) {
  const groups = rawGroups || []
  const [level, setLevel] = useState(initialLevel)
  const [regionIdx, setRegionIdx] = useState(0)
  const [countryIdx, setCountryIdx] = useState(0)
  const [cityIdx, setCityIdx] = useState(0)

  const gi = Math.min(regionIdx, groups.length - 1)
  const region = groups[gi]
  const countries = region ? region.items || [] : []
  const ci = Math.min(countryIdx, countries.length - 1)
  const country = countries[ci]
  const cities = country ? country.subregions || [] : []
  const ki = Math.min(cityIdx, cities.length - 1)
  const city = cities[ki]

  // Se o nível aberto deixou de existir (ex.: apagou o último país), cai pro nível de cima.
  let shown = level
  if (shown === 'cidade' && !city) shown = 'pais'
  if (shown === 'pais' && !country) shown = 'regiao'
  if (shown === 'regiao' && !region) shown = 'home'

  function selectRegion(i) {
    setRegionIdx(i)
    setCountryIdx(0)
    setCityIdx(0)
  }
  function selectCountry(i) {
    setCountryIdx(i)
    setCityIdx(0)
  }
  function openRegion(i) {
    selectRegion(i)
    setLevel('regiao')
  }
  function openCountry(i) {
    selectCountry(i)
    setLevel('pais')
  }
  function openCity(i) {
    setCityIdx(i)
    setLevel('cidade')
  }

  return (
    <div>
      <div className="border-b border-gray-200 bg-gray-50 p-3">
        <div className="flex flex-wrap gap-1.5">
          {PREVIEW_LEVELS.map((l) => {
            const disabled = (l.key === 'regiao' && !region) || (l.key === 'pais' && !country) || (l.key === 'cidade' && !city)
            return (
              <button
                key={l.key}
                type="button"
                disabled={disabled}
                onClick={() => setLevel(l.key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  shown === l.key ? 'bg-navy-800 text-white' : disabled ? 'cursor-not-allowed bg-gray-100 text-gray-300' : 'bg-white text-gray-600 hover:bg-gray-200'
                }`}
              >
                {l.label}
              </button>
            )
          })}
        </div>

        {shown !== 'home' && shown !== 'globo' && (
          <div className="mt-2 flex flex-wrap gap-2">
            {groups.length > 1 && (
              <select className="input w-auto text-xs" value={gi} onChange={(e) => selectRegion(Number(e.target.value))}>
                {groups.map((g, i) => (
                  <option key={i} value={i}>{g.region || 'Nova região (sem nome)'}</option>
                ))}
              </select>
            )}
            {(shown === 'pais' || shown === 'cidade') && countries.length > 1 && (
              <select className="input w-auto text-xs" value={ci} onChange={(e) => selectCountry(Number(e.target.value))}>
                {countries.map((c, i) => (
                  <option key={i} value={i}>{c.name || 'Novo país (sem nome)'}</option>
                ))}
              </select>
            )}
            {shown === 'cidade' && cities.length > 1 && (
              <select className="input w-auto text-xs" value={ki} onChange={(e) => setCityIdx(Number(e.target.value))}>
                {cities.map((c, i) => (
                  <option key={i} value={i}>{c.name || 'Nova cidade (sem nome)'}</option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      {shown === 'home' && <Destinations groups={groups} title={title} subtitle={subtitle} labels={labels} onOpenRegion={openRegion} />}

      {shown === 'regiao' && <PreviewRegionLevel gi={gi} group={region} groups={groups} seeMoreLabel={seeMoreLabel} onOpenCountry={openCountry} />}

      {shown === 'pais' && <PreviewCountryLevel gi={gi} ci={ci} country={country} onOpenCity={openCity} />}

      {shown === 'cidade' && (
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <div className="overflow-hidden rounded-2xl shadow-sm">
            <DestinationCard
              name={city.name}
              desc={city.desc}
              imageUrl={city.imageUrl}
              imageMode={city.imageMode}
              images={city.images}
              photoCaption={city.photoCaption}
              path={['destinationGroups', gi, 'items', ci, 'subregions', ki]}
              large
            />
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {getCountryFlag(country.name, '')} {country.name} · {region.region}
          </p>
        </section>
      )}

      {shown === 'globo' && <DestinationsGlobe groups={groups} title={globeTitle} subtitle={globeSubtitle} />}
    </div>
  )
}

// Nível "Região" da prévia: banner da região + cards dos países (editar, mover, remover, adicionar).
function PreviewRegionLevel({ gi, group, groups, seeMoreLabel, onOpenCountry }) {
  const editor = useEditor()
  const countries = group.items || []
  const otherRegions = groups.map((g, i) => ({ value: i, label: g.region || 'Região sem nome' })).filter((o) => o.value !== gi)
  const list = useListEditing(['destinationGroups', gi, 'items'], countries)
  const removeList = withConfirmRemove(list, (i) => `Remover o país "${countries[i]?.name || 'sem nome'}" e todas as cidades dele?`)
  return (
    <div>
      <Banner
        title={group.region}
        desc={group.desc}
        coverUrl={group.coverUrl}
        path={['destinationGroups', gi]}
        titleKey="region"
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold text-navy-900">Países de {group.region || 'esta região'}</p>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((c, ci) => (
            <div key={ci} className="edit-item">
              <ItemControls list={removeList} index={ci} total={countries.length} />
              <OpenLevelButton onClick={() => onOpenCountry(ci)} />
              <MoveToSelect
                label="Mover para…"
                options={otherRegions}
                onPick={(toGi) => {
                  if (!window.confirm(`Mover "${c.name || 'este país'}" (com as cidades e fotos) para "${groups[toGi]?.region || 'a região escolhida'}"?`)) return
                  editor.update(['destinationGroups'], moveCountry(groups, gi, ci, toGi))
                }}
              />
              <ExploreCard
                name={c.name}
                coverUrl={c.coverUrl}
                subtitle={c.desc}
                flag={getCountryFlag(c.name, '')}
                seeMoreLabel={seeMoreLabel}
                path={['destinationGroups', gi, 'items', ci]}
              />
            </div>
          ))}
          <AddItemButton list={list} item={{ name: 'Novo país', desc: '', subregions: [] }} label="Adicionar país" className="min-h-[11rem]" />
        </div>
      </section>
    </div>
  )
}

// Nível "País" da prévia: banner do país + cards das cidades (editar, mover, remover, adicionar).
function PreviewCountryLevel({ gi, ci, country, onOpenCity }) {
  const cities = country.subregions || []
  const base = ['destinationGroups', gi, 'items', ci]
  const list = useListEditing([...base, 'subregions'], cities)
  const removeList = withConfirmRemove(list, (i) => `Remover a cidade "${cities[i]?.name || 'sem nome'}"?`)
  return (
    <div>
      <Banner
        title={country.name}
        desc={country.desc}
        coverUrl={country.coverUrl}
        flag={getCountryFlag(country.name, '')}
        path={base}
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-sm font-semibold text-navy-900">Cidades de {country.name || 'este país'}</p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c, ki) => (
            <div key={ki} className="edit-item">
              <ItemControls list={removeList} index={ki} total={cities.length} />
              <OpenLevelButton onClick={() => onOpenCity(ki)} />
              <DestinationCard
                name={c.name}
                desc={c.desc}
                imageUrl={c.imageUrl}
                imageMode={c.imageMode}
                images={c.images}
                photoCaption={c.photoCaption}
                path={[...base, 'subregions', ki]}
              />
            </div>
          ))}
          <AddItemButton
            list={list}
            item={{ name: 'Nova cidade', desc: '', imageMode: 'carousel', images: [], imageUrl: '' }}
            label="Adicionar cidade"
            className="min-h-[10rem]"
          />
        </div>
      </section>
    </div>
  )
}

function DestinationGroupsEditor({ groups, onChange }) {
  const { dragIndex, openIndex, setOpenIndex, move, dragProps } = useReorder(groups, onChange)

  function patchGroup(gi, patch) {
    const next = [...groups]
    next[gi] = { ...next[gi], ...patch }
    onChange(next)
  }
  function addGroup() {
    const next = [...groups, { region: '', desc: '', items: [] }]
    onChange(next)
    setOpenIndex(next.length - 1)
  }
  function removeGroup(gi) {
    if (!confirm(`Remover a região "${groups[gi].region || 'sem nome'}" com todos os países e cidades dela?`)) return
    onChange(groups.filter((_, i) => i !== gi))
    setOpenIndex(-1)
  }

  return (
    <div>
      <SectionHeader icon="🌐" title="Regiões / continentes" actionLabel="Adicionar região ou continente" onAction={addGroup} />
      <div className="space-y-3">
        {groups.map((group, gi) => {
          const color = REGION_COLORS[gi % REGION_COLORS.length]
          const open = openIndex === gi
          const countryCount = (group.items || []).length
          return (
            <div
              key={gi}
              className={`overflow-hidden rounded-lg border border-l-4 border-gray-200 transition-opacity ${color.border} ${dragIndex === gi ? 'opacity-40' : ''}`}
            >
              <RowHeader
                dragProps={dragProps(gi)}
                index={gi}
                total={groups.length}
                open={open}
                onToggle={() => setOpenIndex(open ? -1 : gi)}
                onMove={move}
                onRemove={() => removeGroup(gi)}
                prefix={<span className={`inline-block h-2.5 w-2.5 rounded-full ${color.badge}`} />}
                label={`${group.region || 'Nova região / continente (sem nome ainda)'} · ${countryCount} país${countryCount === 1 ? '' : 'es'}`}
                className={`py-2.5 ${color.header}`}
              />
              {open && (
                <div className="space-y-3 bg-white p-4">
                  <div>
                    <label className="label">Nome da região ou continente * (ex.: Europa)</label>
                    <input className="input font-semibold" placeholder="Ex: América do Sul" value={group.region || ''} onChange={(e) => patchGroup(gi, { region: e.target.value })} />
                  </div>
                  <div>
                    <label className="label">Descrição da região ou continente (opcional)</label>
                    <textarea className="input text-sm" rows={2} value={group.desc || ''} onChange={(e) => patchGroup(gi, { desc: e.target.value })} />
                  </div>
                  <ImageField
                    label="Capa da região ou continente (opcional — aparece como banner atrás do título)"
                    shape="banner"
                    value={group.coverUrl}
                    onChange={(v) => patchGroup(gi, { coverUrl: v })}
                  />
                  <CountriesEditor countries={group.items || []} onChange={(v) => patchGroup(gi, { items: v })} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
