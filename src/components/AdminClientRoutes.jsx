import { useEffect, useState } from 'react'
import { rotasList, rotaGet, rotaAction } from '../lib/api.js'
import { fixAnchors } from '../lib/frameAnchors.js'

const formatSize = (n) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)
const formatDateTime = (ms) =>
  ms ? new Date(ms).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

function readText(file) {
  return file.text()
}

function readDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function slugPreview(texto) {
  return (
    String(texto || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 30) || 'cliente'
  )
}

function accessMessage(route, password) {
  const link = `${window.location.origin}/sua-rota`
  return [
    `Olá, ${route.clientName}! Sua rota está pronta ✈️`,
    '',
    `Acesse: ${link}`,
    `Usuário: ${route.username}`,
    `Senha: ${password}`,
    '',
    'Depois de entrar, a rota fica salva no seu celular e abre mesmo sem internet. Dá pra baixar em PDF também.',
  ].join('\n')
}

function CopyButton({ text, label = 'Copiar', className = '' }) {
  const [done, setDone] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      window.prompt('Copie o texto abaixo:', text)
    }
  }
  return (
    <button type="button" onClick={copy} className={`rounded-lg border border-navy-300 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:bg-navy-50 ${className}`}>
      {done ? 'Copiado ✔' : label}
    </button>
  )
}

function Credentials({ info, onClose }) {
  const { route, password, title } = info
  return (
    <div className="rounded-xl border-2 border-emerald-400 bg-emerald-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-emerald-900">{title}</p>
          <p className="mt-1 text-sm text-emerald-800">
            Copie agora: <strong>a senha não aparece de novo</strong> (o sistema guarda só uma versão embaralhada). Se perder, gere uma nova.
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-sm text-emerald-800 underline">Fechar</button>
      </div>
      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[auto,1fr] sm:gap-x-4">
        <dt className="font-semibold text-emerald-900">Link</dt>
        <dd className="break-all font-mono">{window.location.origin}/sua-rota</dd>
        <dt className="font-semibold text-emerald-900">Usuário</dt>
        <dd className="font-mono">{route.username}</dd>
        <dt className="font-semibold text-emerald-900">Senha</dt>
        <dd className="font-mono text-base font-bold tracking-wider">{password}</dd>
      </dl>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={accessMessage(route, password)} label="Copiar mensagem pronta (WhatsApp)" />
        <CopyButton text={password} label="Copiar só a senha" />
      </div>
    </div>
  )
}

function Preview({ id, onClose }) {
  const [route, setRoute] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    rotaGet(id).then((r) => setRoute(r.route)).catch((e) => setError(e.message))
  }, [id])
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 p-3 sm:p-6">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
          <p className="truncate text-sm font-semibold text-navy-900">Prévia — {route?.routeName || '…'} (como o cliente vê)</p>
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-1 text-sm font-semibold text-navy-700 hover:bg-navy-50">Fechar ✕</button>
        </div>
        {error && <p className="p-4 text-sm text-red-600">{error}</p>}
        {route && (
          <iframe
            title="Prévia da rota"
            srcDoc={route.html}
            onLoad={(e) => fixAnchors(e.currentTarget)}
            sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            className="min-h-0 w-full flex-1 border-0"
          />
        )}
      </div>
    </div>
  )
}

function RouteCard({ route, onChange, onRemoved, onCredentials, onPreview }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ routeName: route.routeName, clientName: route.clientName, username: route.username })
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')

  async function run(label, fn) {
    setBusy(label)
    setError('')
    try {
      await fn()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy('')
    }
  }

  const locked = route.lockedUntil && route.lockedUntil > Date.now()
  const status = route.revoked
    ? { text: 'Acesso revogado', cls: 'bg-red-100 text-red-700' }
    : locked
      ? { text: 'Bloqueado por tentativas erradas', cls: 'bg-amber-100 text-amber-800' }
      : { text: 'Ativo', cls: 'bg-emerald-100 text-emerald-700' }

  const saveData = () =>
    run('dados', async () => {
      const { route: updated } = await rotaAction({ action: 'update', id: route.id, ...form })
      onChange(updated)
      setEditing(false)
    })

  const toggleRevoke = () =>
    run('revogar', async () => {
      if (!route.revoked && !window.confirm(`Revogar o acesso de ${route.clientName}? Quem estiver com a rota aberta será desconectado ao reconectar à internet.`)) return
      const { route: updated } = await rotaAction({ action: 'update', id: route.id, revoked: !route.revoked })
      onChange(updated)
    })

  const resetPassword = () =>
    run('senha', async () => {
      if (!window.confirm(`Gerar uma nova senha para ${route.clientName}? A senha antiga deixa de valer.`)) return
      const { route: updated, password } = await rotaAction({ action: 'reset-password', id: route.id })
      onChange(updated)
      onCredentials({ route: updated, password, title: `Nova senha de ${updated.clientName}` })
    })

  const remove = () =>
    run('excluir', async () => {
      if (!window.confirm(`Excluir a rota "${route.routeName}" de ${route.clientName}? Apaga o roteiro, os arquivos e o acesso. Não dá pra desfazer.`)) return
      await rotaAction({ action: 'delete', id: route.id })
      onRemoved(route.id)
    })

  const replaceHtml = (file) =>
    run('html', async () => {
      if (!file) return
      const { route: updated } = await rotaAction({ action: 'update', id: route.id, html: await readText(file) })
      onChange(updated)
    })

  const addFiles = (files) =>
    run('arquivo', async () => {
      let updated = route
      for (const file of files) {
        if (file.size > 3 * 1024 * 1024) throw new Error(`"${file.name}" passa de 3 MB.`)
        updated = (await rotaAction({ action: 'add-file', id: route.id, fileName: file.name, dataUrl: await readDataUrl(file) })).route
        onChange(updated)
      }
    })

  const removeFile = (file) =>
    run('arquivo', async () => {
      if (!window.confirm(`Remover o arquivo "${file.name}"?`)) return
      onChange((await rotaAction({ action: 'delete-file', id: route.id, fileId: file.id })).route)
    })

  return (
    <div className={`rounded-xl border p-4 ${route.revoked ? 'border-red-200 bg-red-50/40' : 'border-gray-200 bg-white'}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-serif text-lg font-bold text-navy-900">{route.routeName}</p>
          <p className="text-sm text-gray-600">Cliente: {route.clientName} · usuário <span className="font-mono">{route.username}</span></p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>{status.text}</span>
      </div>
      <p className="mt-1 text-xs text-gray-400">
        Criada em {formatDateTime(route.createdAt)} · último acesso {formatDateTime(route.lastAccess)} · roteiro {formatSize(route.htmlSize)}
      </p>

      {route.files.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {route.files.map((f) => (
            <li key={f.id} className="flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-1 text-xs text-navy-800">
              📎 {f.name} ({formatSize(f.size)})
              <button type="button" onClick={() => removeFile(f)} className="text-red-500 hover:text-red-700" aria-label={`Remover ${f.name}`}>✕</button>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="mt-3 grid gap-3 rounded-lg bg-gray-50 p-3 sm:grid-cols-3">
          <div>
            <label className="label">Nome da rota</label>
            <input className="input" value={form.routeName} onChange={(e) => setForm({ ...form, routeName: e.target.value })} />
          </div>
          <div>
            <label className="label">Nome do cliente</label>
            <input className="input" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} />
          </div>
          <div>
            <label className="label">Usuário (login)</label>
            <input className="input font-mono" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <p className="text-xs text-gray-500 sm:col-span-3">Trocar o usuário desconecta quem estiver com a rota aberta; avise o cliente.</p>
          <div className="flex gap-2 sm:col-span-3">
            <button type="button" onClick={saveData} disabled={!!busy} className="btn-navy !py-2 text-sm">{busy === 'dados' ? 'Salvando…' : 'Salvar dados'}</button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100">Cancelar</button>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={() => onPreview(route.id)} className="rounded-lg bg-navy-800 px-3 py-1.5 font-semibold text-white hover:bg-navy-700">👁 Ver como o cliente</button>
        <button type="button" onClick={() => setEditing((v) => !v)} className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50">Editar dados</button>
        <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
          {busy === 'html' ? 'Enviando…' : 'Trocar HTML'}
          <input type="file" accept=".html,.htm,text/html" className="hidden" onChange={(e) => { replaceHtml(e.target.files[0]); e.target.value = '' }} />
        </label>
        <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50">
          {busy === 'arquivo' ? 'Enviando…' : '＋ PDF / PowerPoint'}
          <input type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx" className="hidden" onChange={(e) => { addFiles(Array.from(e.target.files)); e.target.value = '' }} />
        </label>
        <button type="button" onClick={resetPassword} disabled={!!busy} className="rounded-lg border border-gray-300 px-3 py-1.5 hover:bg-gray-50">🔑 Nova senha</button>
        <button type="button" onClick={toggleRevoke} disabled={!!busy} className={`rounded-lg border px-3 py-1.5 ${route.revoked ? 'border-emerald-400 text-emerald-700 hover:bg-emerald-50' : 'border-amber-400 text-amber-700 hover:bg-amber-50'}`}>
          {route.revoked ? 'Reativar acesso' : '⛔ Revogar acesso'}
        </button>
        <button type="button" onClick={remove} disabled={!!busy} className="rounded-lg border border-red-300 px-3 py-1.5 text-red-600 hover:bg-red-50">🗑 Excluir</button>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function NewRouteForm({ onCreated }) {
  const [form, setForm] = useState({ routeName: '', clientName: '', username: '' })
  const [htmlFile, setHtmlFile] = useState(null)
  const [extra, setExtra] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!htmlFile) return setError('Escolha o arquivo HTML da rota.')
    setBusy(true)
    try {
      const html = await readText(htmlFile)
      let { route, password } = await rotaAction({ action: 'create', ...form, html })
      const problems = []
      for (const file of extra) {
        try {
          if (file.size > 3 * 1024 * 1024) throw new Error('passa de 3 MB')
          route = (await rotaAction({ action: 'add-file', id: route.id, fileName: file.name, dataUrl: await readDataUrl(file) })).route
        } catch (err) {
          problems.push(`${file.name}: ${err.message}`)
        }
      }
      setForm({ routeName: '', clientName: '', username: '' })
      setHtmlFile(null)
      setExtra([])
      onCreated(route, password, problems)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-navy-200 bg-navy-50/50 p-4">
      <h3 className="font-serif text-lg font-bold text-navy-900">Cadastrar arquivo do cliente</h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nome da rota</label>
          <input className="input" value={form.routeName} onChange={(e) => setForm({ ...form, routeName: e.target.value })} placeholder="Ex.: Argentina e Deserto do Atacama" required />
        </div>
        <div>
          <label className="label">Nome do cliente</label>
          <input className="input" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Ex.: Leonardo e Julia" required />
        </div>
        <div>
          <label className="label">Usuário (login)</label>
          <input className="input font-mono" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder={slugPreview(form.clientName)} />
          <p className="mt-1 text-xs text-gray-500">Deixe em branco pra usar <span className="font-mono">{slugPreview(form.clientName)}</span>. A senha é gerada automaticamente.</p>
        </div>
        <div>
          <label className="label">Arquivo HTML da rota</label>
          <input type="file" accept=".html,.htm,text/html" onChange={(e) => setHtmlFile(e.target.files[0] || null)} className="block w-full text-sm" required />
          <p className="mt-1 text-xs text-gray-500">Até 2 MB. Scripts do HTML ficam desligados por segurança.</p>
        </div>
        <div className="sm:col-span-2">
          <label className="label">Anexos opcionais (PDF, PowerPoint, Word, Excel)</label>
          <input type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx" onChange={(e) => setExtra(Array.from(e.target.files))} className="block w-full text-sm" />
          <p className="mt-1 text-xs text-gray-500">Até 3 MB cada. O cliente baixa direto na tela da rota.</p>
        </div>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={busy} className="btn-navy mt-4">{busy ? 'Criando…' : 'Criar acesso do cliente'}</button>
    </form>
  )
}

export default function AdminClientRoutes() {
  const [routes, setRoutes] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [credentials, setCredentials] = useState(null)
  const [previewId, setPreviewId] = useState(null)
  const [notes, setNotes] = useState([])

  function load() {
    setLoadError('')
    rotasList()
      .then((r) => setRoutes(r.routes))
      .catch((e) => setLoadError(/não autorizado/i.test(e.message) ? 'Sua sessão expirou. Entre de novo no /admin.' : e.message))
  }
  useEffect(load, [])

  const replace = (updated) => setRoutes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-xl font-bold text-navy-900">Rotas dos clientes</h2>
        <p className="mt-1 text-sm text-gray-600">
          Cada cliente recebe um usuário e uma senha e vê <strong>só a própria rota</strong> em <span className="font-mono">/sua-rota</span>. Aqui você cadastra, revoga o acesso, troca a senha ou exclui.
          Esta aba salva sozinha, não precisa do botão Salvar do site.
        </p>
      </div>

      {credentials && <Credentials info={credentials} onClose={() => setCredentials(null)} />}
      {notes.length > 0 && (
        <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Alguns anexos não subiram: {notes.join('; ')}</p>
      )}

      <NewRouteForm
        onCreated={(route, password, problems) => {
          setRoutes((prev) => [route, ...(prev || [])])
          setCredentials({ route, password, title: `Acesso criado para ${route.clientName}` })
          setNotes(problems)
        }}
      />

      <div className="space-y-3">
        <h3 className="font-serif text-lg font-bold text-navy-900">Clientes cadastrados</h3>
        {loadError && (
          <p className="text-sm text-red-600">
            {loadError} <button type="button" onClick={load} className="underline">Tentar de novo</button>
          </p>
        )}
        {!routes && !loadError && <p className="text-sm text-gray-500">Carregando…</p>}
        {routes && routes.length === 0 && <p className="text-sm text-gray-500">Nenhum cliente cadastrado ainda.</p>}
        {routes?.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            onChange={replace}
            onRemoved={(id) => setRoutes((prev) => prev.filter((r) => r.id !== id))}
            onCredentials={setCredentials}
            onPreview={setPreviewId}
          />
        ))}
      </div>

      {previewId && <Preview id={previewId} onClose={() => setPreviewId(null)} />}
    </div>
  )
}
