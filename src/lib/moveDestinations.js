// Reorganiza regiões/países sem precisar recadastrar nada (cidades e fotos vão junto).

// Move um país de uma região para o fim da lista de países de outra.
export function moveCountry(groups, fromGi, ci, toGi) {
  if (fromGi === toGi || !groups[fromGi] || !groups[toGi]) return groups
  const country = (groups[fromGi].items || [])[ci]
  if (!country) return groups
  return groups.map((g, i) => {
    if (i === fromGi) return { ...g, items: (g.items || []).filter((_, x) => x !== ci) }
    if (i === toGi) return { ...g, items: [...(g.items || []), country] }
    return g
  })
}

// Passa todos os países de uma região para outra e apaga a região que ficou vazia.
export function mergeRegionInto(groups, fromGi, toGi) {
  if (fromGi === toGi || !groups[fromGi] || !groups[toGi]) return groups
  const moved = groups[fromGi].items || []
  return groups
    .map((g, i) => (i === toGi ? { ...g, items: [...(g.items || []), ...moved] } : g))
    .filter((_, i) => i !== fromGi)
}
