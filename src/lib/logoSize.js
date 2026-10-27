export const LOGO_SIZES = {
  sm: { label: 'Pequena', hero: 'h-24 w-24 sm:h-32 sm:w-32', free: 'w-36 sm:w-44', px: 96 },
  md: { label: 'Média', hero: 'h-32 w-32 sm:h-44 sm:w-44', free: 'w-44 sm:w-60', px: 128 },
  lg: { label: 'Grande', hero: 'h-40 w-40 sm:h-56 sm:w-56', free: 'w-56 sm:w-72', px: 160 },
  xl: { label: 'Extra grande', hero: 'h-48 w-48 sm:h-72 sm:w-72', free: 'w-64 sm:w-96', px: 192 },
}

export function getLogoSize(key) {
  return LOGO_SIZES[key] || LOGO_SIZES.lg
}
