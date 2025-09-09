/**
 * Utility function para combinar classes CSS
 * Versão simplificada sem dependências extras
 */
export function cn(...classes: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  return classes
    .map(cls => {
      if (typeof cls === 'object' && cls !== null) {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ')
      }
      return cls
    })
    .filter(Boolean)
    .join(' ')
    .trim()
}
