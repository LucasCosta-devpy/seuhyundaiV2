const COUNTRY_FLAGS = {
  'brasil': '🇧🇷', 'argentina': '🇦🇷', 'uruguai': '🇺🇾', 'chile': '🇨🇱', 'venezuela': '🇻🇪',
  'colombia': '🇨🇴', 'colômbia': '🇨🇴', 'peru': '🇵🇪', 'bolivia': '🇧🇴', 'bolívia': '🇧🇴',
  'paraguai': '🇵🇾', 'equador': '🇪🇨', 'guiana': '🇬🇾', 'suriname': '🇸🇷',
  'portugal': '🇵🇹', 'espanha': '🇪🇸', 'franca': '🇫🇷', 'frança': '🇫🇷', 'italia': '🇮🇹', 'itália': '🇮🇹',
  'alemanha': '🇩🇪', 'polonia': '🇵🇱', 'polônia': '🇵🇱', 'eslovaquia': '🇸🇰', 'eslováquia': '🇸🇰',
  'hungria': '🇭🇺', 'suica': '🇨🇭', 'suíça': '🇨🇭', 'austria': '🇦🇹', 'áustria': '🇦🇹',
  'paises baixos': '🇳🇱', 'países baixos': '🇳🇱', 'holanda': '🇳🇱', 'belgica': '🇧🇪', 'bélgica': '🇧🇪',
  'reino unido': '🇬🇧', 'inglaterra': '🇬🇧', 'irlanda': '🇮🇪', 'grecia': '🇬🇷', 'grécia': '🇬🇷',
  'croacia': '🇭🇷', 'croácia': '🇭🇷', 'republica tcheca': '🇨🇿', 'república tcheca': '🇨🇿',
  'marrocos': '🇲🇦', 'egito': '🇪🇬', 'africa do sul': '🇿🇦', 'áfrica do sul': '🇿🇦',
  'quenia': '🇰🇪', 'quênia': '🇰🇪', 'tanzania': '🇹🇿', 'tanzânia': '🇹🇿',
  'estados unidos': '🇺🇸', 'eua': '🇺🇸', 'canada': '🇨🇦', 'canadá': '🇨🇦', 'mexico': '🇲🇽', 'méxico': '🇲🇽',
  'japao': '🇯🇵', 'japão': '🇯🇵', 'china': '🇨🇳', 'tailandia': '🇹🇭', 'tailândia': '🇹🇭',
  'india': '🇮🇳', 'índia': '🇮🇳', 'indonesia': '🇮🇩', 'indonésia': '🇮🇩', 'australia': '🇦🇺', 'austrália': '🇦🇺',
}

export function getCountryFlag(name, fallback = '📍') {
  const key = (name || '').trim().toLowerCase()
  return COUNTRY_FLAGS[key] || fallback
}
