// Dentro de um iframe com srcdoc, link "#secao" tenta carregar a página do site dentro do próprio
// iframe. Aqui o clique é interceptado e vira só uma rolagem até a seção (o HTML não tem scripts).
export function fixAnchors(frame) {
  const doc = frame?.contentDocument
  if (!doc) return
  doc.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href^="#"]')
    if (!link) return
    e.preventDefault()
    const id = decodeURIComponent(link.getAttribute('href').slice(1))
    const target = id ? doc.getElementById(id) : doc.body
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
