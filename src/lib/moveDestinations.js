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

// Transforma um país em SUBPÁGINA de outro país da mesma região (ex.: Inglaterra vira
// subpágina do Reino Unido). As cidades e fotos vão junto. Se o país movido já tinha
// subpáginas, elas viram subpáginas do destino também (fica tudo no mesmo nível, sem
// aninhar mais fundo): primeiro entra o país movido, depois as subpáginas dele.
export function moveCountryIntoCountry(groups, gi, ci, targetCi) {
  const countries = groups[gi] && groups[gi].items
  if (!countries || ci === targetCi || !countries[ci] || !countries[targetCi]) return groups
  const { items: ownSubs, ...asSub } = countries[ci]
  const target = countries[targetCi]
  const merged = { ...target, items: [...(target.items || []), asSub, ...(ownSubs || [])] }
  return groups.map((g, i) =>
    i === gi ? { ...g, items: countries.map((c, x) => (x === targetCi ? merged : c)).filter((_, x) => x !== ci) } : g,
  )
}
