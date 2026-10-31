import { useCallback, useEffect, useRef, useState } from 'react'
import { LogoMark } from '../components/AnimatedLogo.jsx'
import {
  getRotaToken,
  setRotaToken,
  clearRotaToken,
  loginCliente,
  fetchRota,
  fetchArquivo,
  guardar,
  ler,
  apagar,
  limparCopia,
  prepararOffline,
} from '../lib/rotaClient.js'

const formatSize = (n) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)
const formatDate = (ms) => new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
const fileSlug = (s) =>
  String(s || 'roteiro')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'roteiro'

function saveBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

function Shell({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900 px-4 py-10">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}

function LoginForm({ notice, onLogged }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await loginCliente(username.trim(), password)
      setRotaToken(token)
      onLogged()
    } catch (err) {
      setError(err.status ? err.message : 'Sem conexão. Conecte-se à internet para entrar pela primeira vez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Shell>
      <form onSubmit={submit} className="rounded-2xl bg-white p-7 shadow-2xl">
        <div className="mb-4 flex justify-center">
          <LogoMark brand={{}} variant="header" />
        </div>
        <h1 className="text-center font-serif text-2xl font-bold text-navy-900">Sua rota</h1>
        <p className="mt-1 text-center text-sm text-gray-500">Entre com o usuário e a senha que a Rumo Mais Uma Rota enviou pra você.</p>
        {notice && <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{notice}</p>}
        <div className="mt-5">
          <label className="label" htmlFor="rota-user">Usuário</label>
          <input
            id="rota-user"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            autoFocus
            required
          />
        </div>
        <div className="mt-4">
          <label className="label" htmlFor="rota-pass">Senha</label>
          <div className="relative">
            <input
              id="rota-pass"
              type={show ? 'text' : 'password'}
              className="input pr-20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              required
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-navy-600"
            >
              {show ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="btn-navy mt-6 w-full">
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="mt-4 text-center text-xs text-gray-400">Depois de entrar, sua rota fica salva neste aparelho e abre mesmo sem internet.</p>
      </form>
    </Shell>
  )
}

// Abre todos os <details> do roteiro, imprime (o navegador oferece "Salvar como PDF") e restaura.
function printFrame(frame, title) {
  const win = frame?.contentWindow
  const doc = win?.document
  if (!win || !doc) return false
  const details = Array.from(doc.querySelectorAll('details'))
  const before = details.map((d) => d.open)
  details.forEach((d) => (d.open = true))
  const oldTitle = document.title
  document.title = title
  const restore = () => {
    details.forEach((d, i) => (d.open = before[i]))
    document.title = oldTitle
  }
  win.addEventListener('afterprint', restore, { once: true })
  win.focus()
  win.print()
  setTimeout(() => {
    if (document.title === title) restore()
  }, 60000)
  return true
}

function RouteView({ data, offline, onLogout }) {
  const frameRef = useRef(null)
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState('')

  function flash(text) {
    setMsg(text)
    setTimeout(() => setMsg(''), 5000)
  }

  function downloadPdf() {
    if (!printFrame(frameRef.current, data.routeName)) flash('Não consegui abrir a impressão. Use "Baixar arquivo" e abra no computador.')
  }

  function downloadHtml() {
    saveBlob(new Blob([data.html], { type: 'text/html;charset=utf-8' }), `${fileSlug(data.routeName)}.html`)
  }

  async function downloadFile(file) {
    setBusy(file.id)
    try {
      let blob = await ler(`file:${file.id}`)
      if (!blob) {
        blob = await fetchArquivo(file.id)
        guardar(`file:${file.id}`, blob)
      }
      saveBlob(blob, file.name)
    } catch {
      flash('Esse arquivo ainda não está salvo no aparelho. Conecte-se à internet e tente de novo.')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-navy-900">
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gold-500/40 bg-navy-900 px-3 py-2 text-white sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <LogoMark brand={{}} variant="header" />
          <div className="min-w-0">
            <p className="truncate font-serif text-base font-bold leading-tight text-gold-300">{data.routeName}</p>
            <p className="truncate text-xs text-navy-200">Para {data.clientName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={downloadPdf} className="rounded-lg bg-gold-400 px-3 py-2 text-sm font-bold text-navy-900 hover:bg-gold-300">
            ⬇ Baixar PDF
          </button>
          <button type="button" onClick={downloadHtml} className="rounded-lg border border-navy-400 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800">
            Baixar arquivo
          </button>
          {data.files.map((f) => (
            <button
              key={f.id}
              type="button"
              disabled={busy === f.id}
              onClick={() => downloadFile(f)}
              title={`${f.name} (${formatSize(f.size)})`}
              className="max-w-[12rem] truncate rounded-lg border border-navy-400 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800"
            >
              {busy === f.id ? 'Baixando…' : `⬇ ${f.name}`}
            </button>
          ))}
          <button type="button" onClick={onLogout} className="px-2 py-2 text-sm text-navy-200 hover:text-white">
            Sair
          </button>
        </div>
      </header>
      <div className={`px-4 py-1 text-center text-xs ${offline ? 'bg-amber-100 text-amber-900' : 'bg-navy-800 text-navy-200'}`}>
        {msg ||
          (offline
            ? `Sem internet — mostrando a cópia salva neste aparelho${data.savedAt ? ` (${formatDate(data.savedAt)})` : ''}.`
            : '✓ Salva neste aparelho: abre mesmo sem internet.')}
      </div>
      <iframe
        ref={frameRef}
        title={data.routeName}
        srcDoc={data.html}
        sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-modals"
        className="min-h-0 w-full flex-1 border-0 bg-white"
      />
    </div>
  )
}

export default function SuaRota() {
  const [phase, setPhase] = useState('boot') // boot | login | view
  const [data, setData] = useState(null)
  const [offline, setOffline] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    document.title = 'Sua rota | Rumo Mais Uma Rota'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {})
    return () => meta.remove()
  }, [])

  const refresh = useCallback(async (previous) => {
    try {
      const fresh = await fetchRota()
      const saved = { ...fresh, savedAt: Date.now() }
      setData(saved)
      setOffline(false)
      setPhase('view')
      await guardar('rota', saved)
      prepararOffline()
      // guarda os anexos no aparelho e tira os que o admin removeu
      const keep = new Set(fresh.files.map((f) => f.id))
      ;(previous?.files || []).filter((f) => !keep.has(f.id)).forEach((f) => apagar(`file:${f.id}`))
      for (const f of fresh.files) {
        if (!(await ler(`file:${f.id}`))) {
          try {
            await guardar(`file:${f.id}`, await fetchArquivo(f.id))
          } catch {
            // tenta de novo na próxima abertura
          }
        }
      }
    } catch (err) {
      if (err.status === 401) {
        clearRotaToken()
        await limparCopia()
        setData(null)
        setNotice('Seu acesso foi encerrado. Entre de novo ou fale com a Rumo Mais Uma Rota.')
        setPhase('login')
      } else if (previous) {
        setOffline(true)
        setPhase('view')
      } else {
        setNotice('Sem conexão. Conecte-se à internet para abrir sua rota pela primeira vez.')
        setPhase('login')
      }
    }
  }, [])

  const start = useCallback(async () => {
    if (!getRotaToken()) {
      setPhase('login')
      return
    }
    const cached = await ler('rota')
    if (cached) {
      setData(cached)
      setPhase('view')
    }
    refresh(cached)
  }, [refresh])

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    const back = () => {
      if (phase === 'view') refresh(data)
    }
    window.addEventListener('online', back)
    return () => window.removeEventListener('online', back)
  }, [phase, data, refresh])

  async function logout() {
    if (!window.confirm('Sair apaga a cópia da rota deste aparelho. Pra ver de novo sem internet você precisará entrar outra vez com internet. Sair mesmo?')) return
    clearRotaToken()
    await limparCopia()
    setData(null)
    setNotice('')
    setPhase('login')
  }

  if (phase === 'boot') {
    return <div className="flex min-h-screen items-center justify-center bg-navy-900 text-navy-200">Carregando…</div>
  }
  if (phase === 'login' || !data) {
    return (
      <LoginForm
        notice={notice}
        onLogged={() => {
          setNotice('')
          setPhase('boot')
          start()
        }}
      />
    )
  }
  return <RouteView data={data} offline={offline} onLogout={logout} />
}
