// Junta o conteúdo salvo no banco com os padrões. Objetos simples (brand, pricing,
// consultant...) são mesclados campo a campo, pra campos novos aparecerem sem o dono
// ter que salvar de novo; listas e valores salvos sempre vencem.
function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

export function mergeContent(defaults, saved) {
  const data = isPlainObject(saved) ? saved : {}
  const result = { ...defaults, ...data }
  for (const key of Object.keys(defaults)) {
    if (isPlainObject(defaults[key]) && isPlainObject(data[key])) {
      result[key] = { ...defaults[key], ...data[key] }
    }
  }
  return result
}
