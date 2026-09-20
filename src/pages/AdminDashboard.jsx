import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContent, saveContent, uploadImage, clearToken, getToken } from '../lib/api.js'
import { defaultContent } from '../lib/defaultContent.js'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [content, setContent] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

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

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6">
        {status && (
          <div className="rounded-lg bg-navy-800 px-4 py-2 text-sm text-white">{status}</div>
        )}

        <Section title="Marca e Contato">
          <TextField label="Nome do negócio" value={content.brand.name} onChange={(v) => update(['brand', 'name'], v)} />
          <TextField label="Slogan" value={content.brand.tagline} onChange={(v) => update(['brand', 'tagline'], v)} />
          <ImageField label="Logo" value={content.brand.logoUrl} onChange={(v) => update(['brand', 'logoUrl'], v)} />
          <TextField label="Instagram (ex: @seuinstagram)" value={content.brand.instagram} onChange={(v) => update(['brand', 'instagram'], v)} />
          <TextField
            label="WhatsApp (com DDI e DDD, só números, ex: 5551987654321)"
            value={content.brand.whatsapp}
            onChange={(v) => update(['brand', 'whatsapp'], v.replace(/\D/g, ''))}
          />
        </Section>

        <Section title="Destaques (tags abaixo do título)">
          <TagListEditor
            items={content.hero.countryTags}
            onChange={(v) => update(['hero', 'countryTags'], v)}
          />
        </Section>

        <Section title="Sobre">
          <TextField label="Título" value={content.about.title} onChange={(v) => update(['about', 'title'], v)} />
          <ParagraphListEditor
            items={content.about.paragraphs}
            onChange={(v) => update(['about', 'paragraphs'], v)}
          />
        </Section>

        <Section title="Destinos (agrupados por região)">
          <DestinationGroupsEditor
            groups={content.destinationGroups}
            onChange={(v) => update(['destinationGroups'], v)}
          />
        </Section>

        <Section title="O que ajudamos a organizar">
          <CardListEditor items={content.services} onChange={(v) => update(['services'], v)} />
        </Section>

        <Section title="Motivos para contratar">
          <CardListEditor items={content.reasons} onChange={(v) => update(['reasons'], v)} />
        </Section>

        <Section title="Como funciona (passo a passo)">
          <CardListEditor items={content.process} onChange={(v) => update(['process'], v)} />
        </Section>

        <Section title="Investimento / Preço">
          <TextField label="Título do plano" value={content.pricing.title} onChange={(v) => update(['pricing', 'title'], v)} />
          <TextField label="Valor exibido" value={content.pricing.priceLabel} onChange={(v) => update(['pricing', 'priceLabel'], v)} />
          <TextArea label="Descrição" value={content.pricing.desc} onChange={(v) => update(['pricing', 'desc'], v)} />
          <TextArea label="Forma de pagamento" value={content.pricing.paymentInfo} onChange={(v) => update(['pricing', 'paymentInfo'], v)} />
        </Section>

        <Section title="Consultora(a)">
          <TextField label="Nome" value={content.consultant.name} onChange={(v) => update(['consultant', 'name'], v)} />
          <ImageField label="Foto" value={content.consultant.photoUrl} onChange={(v) => update(['consultant', 'photoUrl'], v)} />
          <TextArea label="Biografia" value={content.consultant.bio} onChange={(v) => update(['consultant', 'bio'], v)} />
          <TextField label="Frase de destaque" value={content.consultant.quote} onChange={(v) => update(['consultant', 'quote'], v)} />
        </Section>

        <Section title="Chamada final e rodapé">
          <TextField label="Título da chamada final" value={content.cta.title} onChange={(v) => update(['cta', 'title'], v)} />
          <TextArea label="Texto da chamada final" value={content.cta.desc} onChange={(v) => update(['cta', 'desc'], v)} />
          <TextField label="Texto do rodapé" value={content.footer.text} onChange={(v) => update(['footer', 'text'], v)} />
        </Section>
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

function setDeep(obj, path, value) {
  const clone = structuredClone(obj)
  let cur = clone
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
  cur[path[path.length - 1]] = value
  return clone
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
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

function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false)

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

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover border" />}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="text-sm" />
        {uploading && <span className="text-xs text-gray-500">Enviando…</span>}
      </div>
    </div>
  )
}

function TagListEditor({ items, onChange }) {
  const [newTag, setNewTag] = useState('')
  function addTag() {
    if (!newTag.trim()) return
    onChange([...(items || []), newTag.trim()])
    setNewTag('')
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
      <div className="flex gap-2">
        <input className="input" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Novo destino / país" />
        <button onClick={addTag} className="btn-navy !py-2 !px-4 text-sm">Adicionar</button>
      </div>
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
    <div className="space-y-6">
      {groups.map((group, gi) => (
        <div key={gi} className="rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <input
              className="input flex-1 font-semibold"
              value={group.region}
              onChange={(e) => updateGroup(gi, 'region', e.target.value)}
            />
            <button onClick={() => removeGroup(gi)} className="text-sm text-red-500 hover:text-red-700">Remover região</button>
          </div>

          <div className="mt-4 space-y-4">
            {group.items.map((item, ii) => (
              <div key={ii} className="rounded-lg bg-gray-50 p-3">
                <TextField label="Destino" value={item.name} onChange={(v) => updateItem(gi, ii, 'name', v)} />
                <div className="mt-2">
                  <TextArea label="Descrição" value={item.desc} onChange={(v) => updateItem(gi, ii, 'desc', v)} />
                </div>
                <div className="mt-2">
                  <ImageField label="Foto" value={item.imageUrl} onChange={(v) => updateItem(gi, ii, 'imageUrl', v)} />
                </div>
                <button onClick={() => removeItem(gi, ii)} className="mt-2 text-sm text-red-500 hover:text-red-700">Remover destino</button>
              </div>
            ))}
            <button onClick={() => addItem(gi)} className="text-sm font-semibold text-navy-700 hover:underline">+ Adicionar destino nesta região</button>
          </div>
        </div>
      ))}
      <button onClick={addGroup} className="text-sm font-semibold text-navy-700 hover:underline">+ Adicionar região</button>
    </div>
  )
}
