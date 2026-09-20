export function slugify(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalize(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

// Encontra, dentro dos grupos de destinos, o item cujo nome melhor
// corresponde a uma tag do hero (ex: tag "Guianas" -> item "Venezuela & Guianas").
export function findDestinationSlug(groups, tag) {
  const target = normalize(tag)
  for (const group of groups || []) {
    for (const item of group.items || []) {
      if (normalize(item.name).includes(target)) {
        return slugify(item.name)
      }
    }
  }
  return null
}
