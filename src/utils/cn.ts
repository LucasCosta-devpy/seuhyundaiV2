/**
 * Utility function para combinar classes CSS
 * Versão simplificada sem dependências extras
 */
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes
    .filter(Boolean)
    .join(' ')
    .trim()
}
