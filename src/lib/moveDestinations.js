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

// Coloca uma região INTEIRA dentro de outra como um país: ela vira um card de país (com nome,
// descrição e capa dela) e os países que tinha viram subpáginas desse novo país.
// Ex.: região "Reino Unido" (país Inglaterra) dentro de "Europa" -> Europa > Reino Unido > Inglaterra.
// A região antiga some. Subpáginas que os países já tinham entram no mesmo nível (sem aninhar mais).
export function mergeRegionInto(groups, fromGi, toGi) {
  if (fromGi === toGi || !groups[fromGi] || !groups[toGi]) return groups
  const from = groups[fromGi]
  const subpages = []
  for (const c of from.items || []) {
    subpages.push({ name: c.name, desc: c.desc, coverUrl: c.coverUrl, subregions: c.subregions || [] })
    for (const sub of c.items || []) subpages.push(sub)
  }
  const asCountry = {
    name: from.region,
    desc: from.desc || '',
    coverUrl: from.coverUrl || '',
    subregions: [],
    ...(subpages.length > 0 ? { items: subpages } : {}),
  }
  return groups
    .map((g, i) => (i === toGi ? { ...g, items: [...(g.items || []), asCountry] } : g))
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
