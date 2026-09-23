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

// Encontra, dentro dos grupos de destinos, a REGIÃO (não o card individual)
// que melhor corresponde a uma tag do hero — sempre leva ao topo do bloco da
// região, evitando cair no meio de uma lista longa de cards.
export function findDestinationSlug(groups, tag) {
  const target = normalize(tag)

  for (const group of groups || []) {
    const region = normalize(group.region)
    if (region.includes(target) || target.includes(region)) {
      return slugify(group.region)
    }
  }

  for (const group of groups || []) {
    for (const item of group.items || []) {
      if (normalize(item.name).includes(target)) {
        return slugify(group.region)
      }
    }
  }

  return null
}
