import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, saveContent, uploadImage, deleteImage, clearToken, getToken } from '../lib/api.js'
import { defaultContent } from '../lib/defaultContent.js'
import { LOGO_SIZES, getLogoSize } from '../lib/logoSize.js'

const TABS = [
  { key: 'marca', label: 'Marca e Contato', color: 'amber' },
  { key: 'destaques', label: 'Destaques', color: 'sky' },
  { key: 'sobre', label: 'Sobre', color: 'emerald' },
  { key: 'destinos', label: 'Destinos', color: 'rose' },
  { key: 'servicos', label: 'Serviços', color: 'violet' },
  { key: 'motivos', label: 'Motivos', color: 'teal' },
  { key: 'processo', label: 'Como funciona', color: 'orange' },
  { key: 'preco', label: 'Preço', color: 'indigo' },
  { key: 'consultora', label: 'Consultora', color: 'fuchsia' },
  { key: 'final', label: 'Chamada final', color: 'cyan' },
]

const TAB_STYLES = {
  amber: { active: 'bg-amber-500 border-amber-500 text-white', inactive: 'border-amber-200 text-amber-700 hover:bg-amber-50', top: 'border-t-amber-500' },
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
      .then((data) => setContent({ ...defaultContent, ...data }))
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

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {status && (
          <div className="mb-4 rounded-lg bg-navy-800 px-4 py-2 text-sm text-white">{status}</div>
        )}

        <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((tab) => {
            const style = TAB_STYLES[tab.color]
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? style.active : `bg-white ${style.inactive}`
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className={`rounded-2xl border-t-4 bg-white p-6 shadow-sm ${TAB_STYLES[TABS.find((t) => t.key === activeTab).color].top}`}>
          {activeTab === 'marca' && (
            <Panel title="Marca e Contato">
              <TextField label="Nome do negócio" value={content.brand.name} onChange={(v) => update(['brand', 'name'], v)} />
              <TextField label="Slogan" value={content.brand.tagline} onChange={(v) => update(['brand', 'tagline'], v)} />
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
            </Panel>
          )}

          {activeTab === 'destaques' && (
            <Panel title="Destaques (tags abaixo do título)">
              <TagListEditor
                items={content.hero.countryTags}
                onChange={(v) => update(['hero', 'countryTags'], v)}
                destinationNames={flattenDestinationNames(content.destinationGroups)}
              />
            </Panel>
          )}

          {activeTab === 'sobre' && (
            <Panel title="Sobre">
              <TextField label="Título" value={content.about.title} onChange={(v) => update(['about', 'title'], v)} />
              <ParagraphListEditor
                items={content.about.paragraphs}
                onChange={(v) => update(['about', 'paragraphs'], v)}
              />
            </Panel>
          )}

          {activeTab === 'destinos' && (
            <Panel title="Destinos (agrupados por região)">
              <DestinationGroupsEditor
                groups={content.destinationGroups}
                onChange={(v) => update(['destinationGroups'], v)}
              />
            </Panel>
          )}

          {activeTab === 'servicos' && (
            <Panel title="O que ajudamos a organizar">
              <CardListEditor items={content.services} onChange={(v) => update(['services'], v)} />
            </Panel>
          )}

          {activeTab === 'motivos' && (
            <Panel title="Motivos para contratar">
              <CardListEditor items={content.reasons} onChange={(v) => update(['reasons'], v)} />
            </Panel>
          )}

          {activeTab === 'processo' && (
            <Panel title="Como funciona (passo a passo)">
              <CardListEditor items={content.process} onChange={(v) => update(['process'], v)} />
            </Panel>
          )}

          {activeTab === 'preco' && (
            <Panel title="Investimento / Preço">
              <TextField label="Título do plano" value={content.pricing.title} onChange={(v) => update(['pricing', 'title'], v)} />
              <TextField label="Valor exibido" value={content.pricing.priceLabel} onChange={(v) => update(['pricing', 'priceLabel'], v)} />
              <TextArea label="Descrição" value={content.pricing.desc} onChange={(v) => update(['pricing', 'desc'], v)} />
              <TextArea label="Forma de pagamento" value={content.pricing.paymentInfo} onChange={(v) => update(['pricing', 'paymentInfo'], v)} />
            </Panel>
          )}

          {activeTab === 'consultora' && (
            <Panel title="Consultora(a)">
              <TextField label="Nome" value={content.consultant.name} onChange={(v) => update(['consultant', 'name'], v)} />
              <ImageField label="Foto" shape="avatar" value={content.consultant.photoUrl} onChange={(v) => update(['consultant', 'photoUrl'], v)} />
              <TextArea label="Biografia" value={content.consultant.bio} onChange={(v) => update(['consultant', 'bio'], v)} />
              <TextField label="Frase de destaque" value={content.consultant.quote} onChange={(v) => update(['consultant', 'quote'], v)} />
            </Panel>
          )}

          {activeTab === 'final' && (
            <Panel title="Chamada final e rodapé">
              <TextField label="Título da chamada final" value={content.cta.title} onChange={(v) => update(['cta', 'title'], v)} />
              <TextArea label="Texto da chamada final" value={content.cta.desc} onChange={(v) => update(['cta', 'desc'], v)} />
              <TextField label="Texto do rodapé" value={content.footer.text} onChange={(v) => update(['footer', 'text'], v)} />
            </Panel>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-4xl justify-end">
          <button onClick={handleSave} disabled={saving} className="btn-navy">
            {saving ? 'Salvando…' : 'Salvar alterações'}
          </button>
        </div>
      </div>
    </div>
  )
}

function flattenDestinationNames(groups) {
  const names = []
  for (const group of groups || []) {
    for (const item of group.items || []) {
      if (item.name) names.push(item.name)
    }
  }
  return names
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
  photo: 'h-20 w-28 rounded-lg object-cover border border-gray-200',
}

function ImageField({ label, value, onChange, shape = 'photo' }) {
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
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
    if (!confirm('Remover esta imagem? Ela será apagada do armazenamento (Blobs).')) return
    setRemoving(true)
    try {
      // só tenta apagar do Blobs se for uma imagem enviada por aqui (/api/image/...)
      if (value.startsWith('/api/image/')) {
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
          <input type="file" accept="image/*" onChange={handleFile} disabled={uploading || removing} className="text-sm" />
          {uploading && <span className="text-xs text-gray-500">Enviando…</span>}
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
    </div>
  )
}

function TagListEditor({ items, onChange, destinationNames = [] }) {
  const available = destinationNames.filter((name) => !(items || []).includes(name))
  const [selected, setSelected] = useState('')
  const [customMode, setCustomMode] = useState(available.length === 0)
  const [customTag, setCustomTag] = useState('')

  function addSelected() {
    if (!selected) return
    onChange([...(items || []), selected])
    setSelected('')
  }
  function addCustom() {
    if (!customTag.trim()) return
    onChange([...(items || []), customTag.trim()])
    setCustomTag('')
  }
  function removeTag(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {(items || []).map((tag, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full bg-navy-100 px-3 py-1 text-sm text-navy-800">
            {tag}
            <button onClick={() => removeTag(i)} className="text-navy-500 hover:text-red-600">×</button>
          </span>
        ))}
      </div>

      {!customMode ? (
        <div className="flex gap-2">
          <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">Selecione um destino já cadastrado…</option>
            {available.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button onClick={addSelected} className="btn-navy !py-2 !px-4 text-sm whitespace-nowrap">Adicionar</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input className="input" value={customTag} onChange={(e) => setCustomTag(e.target.value)} placeholder="Nome da tag" />
          <button onClick={addCustom} className="btn-navy !py-2 !px-4 text-sm whitespace-nowrap">Adicionar</button>
        </div>
      )}

      {available.length > 0 && (
        <button
          type="button"
          onClick={() => setCustomMode((v) => !v)}
          className="mt-2 text-xs font-semibold text-navy-700 hover:underline"
        >
          {customMode ? 'Escolher da lista de destinos cadastrados' : 'Ou digitar um texto livre (não vai virar link)'}
        </button>
      )}
      <p className="mt-2 text-xs text-gray-400">
        Escolhendo da lista, a tag já sai clicável e leva direto pro destino certo na página.
      </p>
    </div>
  )
}

function ParagraphListEditor({ items, onChange }) {
  function update(i, v) {
    const next = [...items]
    next[i] = v
    onChange(next)
  }
  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }
  function add() {
    onChange([...(items || []), ''])
  }
  return (
    <div className="space-y-3">
      {(items || []).map((p, i) => (
        <div key={i} className="flex gap-2">
          <textarea className="input" rows={2} value={p} onChange={(e) => update(i, e.target.value)} />
          <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700">Remover</button>
        </div>
      ))}
      <button onClick={add} className="text-sm font-semibold text-navy-700 hover:underline">+ Adicionar parágrafo</button>
    </div>
  )
}

function CardListEditor({ items, onChange }) {
  function update(i, field, v) {
    const next = [...items]
    next[i] = { ...next[i], [field]: v }
    onChange(next)
  }
  function remove(i) {
    onChange(items.filter((_, idx) => idx !== i))
  }
  function add() {
    onChange([...(items || []), { title: '', desc: '' }])
  }
  return (
    <div className="space-y-4">
      {(items || []).map((item, i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-4">
          <TextField label="Título" value={item.title} onChange={(v) => update(i, 'title', v)} />
          <div className="mt-2">
            <TextArea label="Descrição" value={item.desc} onChange={(v) => update(i, 'desc', v)} />
          </div>
          <button onClick={() => remove(i)} className="mt-2 text-sm text-red-500 hover:text-red-700">Remover item</button>
        </div>
      ))}
      <button onClick={add} className="text-sm font-semibold text-navy-700 hover:underline">+ Adicionar item</button>
    </div>
  )
}

function DestinationGroupsEditor({ groups, onChange }) {
  const [openIndex, setOpenIndex] = useState(0)

  function updateGroup(gi, field, v) {
    const next = [...groups]
    next[gi] = { ...next[gi], [field]: v }
    onChange(next)
  }
  function removeGroup(gi) {
    onChange(groups.filter((_, i) => i !== gi))
  }
  function addGroup() {
    onChange([...groups, { region: 'Nova região', items: [] }])
  }
  function updateItem(gi, ii, field, v) {
    const next = [...groups]
    const items = [...next[gi].items]
    items[ii] = { ...items[ii], [field]: v }
    next[gi] = { ...next[gi], items }
    onChange(next)
  }
  function removeItem(gi, ii) {
    const next = [...groups]
    next[gi] = { ...next[gi], items: next[gi].items.filter((_, i) => i !== ii) }
    onChange(next)
  }
  function addItem(gi) {
    const next = [...groups]
    next[gi] = { ...next[gi], items: [...next[gi].items, { name: '', desc: '', imageUrl: '' }] }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {groups.map((group, gi) => {
        const color = REGION_COLORS[gi % REGION_COLORS.length]
        const isOpen = openIndex === gi
        return (
          <div key={gi} className={`overflow-hidden rounded-lg border-l-4 border border-gray-200 ${color.border}`}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : gi)}
              className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left transition-colors ${color.header}`}
            >
              <span className="flex items-center gap-2 font-semibold text-navy-900">
                <span className={`h-2.5 w-2.5 rounded-full ${color.badge}`} />
                {group.region}
                <span className="text-xs font-normal text-gray-500">({group.items.length} destino{group.items.length === 1 ? '' : 's'})</span>
              </span>
              <span className="text-lg text-gray-500">{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen && (
              <div className="bg-white p-4">
                <div className="flex items-center gap-2">
                  <input
                    className="input flex-1 font-semibold"
                    value={group.region}
                    onChange={(e) => updateGroup(gi, 'region', e.target.value)}
                  />
                  <button onClick={() => removeGroup(gi)} className="whitespace-nowrap text-sm text-red-500 hover:text-red-700">Remover região</button>
                </div>

                <div className="mt-4 space-y-4">
                  {group.items.map((item, ii) => (
                    <div key={ii} className="rounded-lg bg-gray-50 p-3">
                      <TextField label="Destino" value={item.name} onChange={(v) => updateItem(gi, ii, 'name', v)} />
                      <div className="mt-2">
                        <TextArea label="Descrição" value={item.desc} onChange={(v) => updateItem(gi, ii, 'desc', v)} />
                      </div>
                      <div className="mt-2">
                        <ImageField label="Foto" shape="photo" value={item.imageUrl} onChange={(v) => updateItem(gi, ii, 'imageUrl', v)} />
                      </div>
                      <button onClick={() => removeItem(gi, ii)} className="mt-2 text-sm text-red-500 hover:text-red-700">Remover destino</button>
                    </div>
                  ))}
                  <button onClick={() => addItem(gi)} className="text-sm font-semibold text-navy-700 hover:underline">+ Adicionar destino nesta região</button>
                </div>
              </div>
            )}
          </div>
        )
      })}
      <button onClick={addGroup} className="text-sm font-semibold text-navy-700 hover:underline">+ Adicionar região</button>
    </div>
  )
}
