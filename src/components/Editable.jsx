import { createContext, useContext, useLayoutEffect, useRef } from 'react'

// Quando o site é renderizado dentro do painel admin, este contexto liga a edição
// direta ("clica no texto e escreve"). No site público ele é null e tudo renderiza
// exatamente como antes.
export const EditContext = createContext(null)

export function useEditor() {
  return useContext(EditContext)
}

export function moveItem(list, from, to) {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

// Mesmo elemento/estilo do site; no admin vira contentEditable e grava no conteúdo a cada letra.
export function EditableText({ path, value, as: Tag = 'span', className = '', placeholder = 'Clique pra escrever…', ...rest }) {
  const editor = useEditor()
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const next = value || ''
    if (document.activeElement !== el && el.innerText !== next) el.innerText = next
  }, [value, editor])

  if (!editor) {
    return (
      <Tag className={className} {...rest}>
        {value}
      </Tag>
    )
  }

  function commit(el) {
    let text = el.innerText.split(String.fromCharCode(160)).join(' ').replace(/\s*[\r\n]+\s*/g, ' ')
    if (!text.trim()) {
      text = ''
      el.innerHTML = ''
    }
    editor.update(path, text)
  }

  return (
    <Tag
      ref={ref}
      data-editable=""
      data-placeholder={placeholder}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      className={className}
      onInput={(e) => commit(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          e.currentTarget.blur()
        }
      }}
      onPaste={(e) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text/plain').replace(/\s*\n\s*/g, ' ')
        document.execCommand('insertText', false, text)
      }}
      {...rest}
    />
  )
}

// Devolve ações de lista (mover/remover/adicionar) só quando está no modo edição.
export function useListEditing(path, items) {
  const editor = useEditor()
  if (!editor) return null
  const list = items || []
  return {
    move: (from, to) => editor.update(path, moveItem(list, from, to)),
    remove: (i) => editor.update(path, list.filter((_, x) => x !== i)),
    add: (item) => editor.update(path, [...list, item]),
  }
}

// Mini barra que aparece ao passar o mouse em cima de um bloco editável.
export function ItemControls({ list, index, total, className = '' }) {
  if (!list) return null
  const btn =
    'flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-navy-700 shadow ring-1 ring-black/10 hover:bg-navy-50 disabled:opacity-30'
  return (
    <div className={`edit-item-controls ${className}`} onMouseDown={(e) => e.preventDefault()}>
      <button type="button" className={btn} disabled={index === 0} title="Mover pra cima / esquerda" onClick={() => list.move(index, index - 1)}>
        ▲
      </button>
      <button type="button" className={btn} disabled={index === total - 1} title="Mover pra baixo / direita" onClick={() => list.move(index, index + 1)}>
        ▼
      </button>
      <button type="button" className={`${btn} !text-red-500 hover:!bg-red-50`} title="Remover" onClick={() => list.remove(index)}>
        ✕
      </button>
    </div>
  )
}

export function AddItemButton({ list, item, label, className = '' }) {
  if (!list) return null
  return (
    <button
      type="button"
      onClick={() => list.add(item)}
      className={`rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/60 px-4 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 ${className}`}
    >
      + {label}
    </button>
  )
}

// Moldura onde o site "de verdade" é desenhado dentro do admin, já com edição direta ligada.
export function InlineEditor({ update, hint = true, children }) {
  return (
    <EditContext.Provider value={{ update }}>
      {hint && (
        <p className="mb-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
          ✏️ É o site de verdade: clique em qualquer texto pra editar. Passe o mouse num bloco pra mover, remover ou adicionar outro.
          Nada vai pro ar até clicar em <strong>Salvar alterações</strong>.
        </p>
      )}
      <div
        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
        onClickCapture={(e) => {
          if (e.target.closest('a')) e.preventDefault()
        }}
      >
        {children}
      </div>
    </EditContext.Provider>
  )
}

// Menu "Mover para…" que aparece ao passar o mouse num bloco (canto de baixo).
export function MoveToSelect({ label, options, onPick }) {
  const editor = useEditor()
  if (!editor || options.length === 0) return null
  return (
    <div className="edit-item-move" onMouseDown={(e) => e.stopPropagation()}>
      <select
        value=""
        title={label}
        onChange={(e) => e.target.value !== '' && onPick(Number(e.target.value))}
        className="max-w-[12rem] rounded-full bg-white px-2 py-1 text-xs text-navy-800 shadow ring-1 ring-black/10"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
