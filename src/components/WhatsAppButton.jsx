function buildLink(whatsapp, message) {
  const digits = (whatsapp || '').replace(/\D/g, '')
  const text = encodeURIComponent(message || 'Olá! Vim pelo site e gostaria de saber mais sobre a consultoria de viagens.')
  return `https://wa.me/${digits}?text=${text}`
}

export function WhatsAppFloatButton({ whatsapp }) {
  if (!whatsapp) return null
  return (
    <a
      href={buildLink(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition-transform hover:scale-110"
      aria-label="Falar no WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}

export function WhatsAppLink({ whatsapp, message, className, children }) {
  if (!whatsapp) return null
  return (
    <a href={buildLink(whatsapp, message)} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}

export function formatPhoneDisplay(whatsapp) {
  const digits = (whatsapp || '').replace(/\D/g, '')
  if (digits.length < 12) return whatsapp || ''
  const country = digits.slice(0, 2)
  const ddd = digits.slice(2, 4)
  const rest = digits.slice(4)
  const mid = rest.length === 9 ? rest.slice(0, 5) : rest.slice(0, 4)
  const end = rest.length === 9 ? rest.slice(5) : rest.slice(4)
  return `+${country} (${ddd}) ${mid}-${end}`
}

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.83 14.08c-.24.68-1.4 1.31-1.93 1.36-.49.05-1.11.07-1.79-.11-.41-.11-.94-.3-1.62-.58-2.85-1.23-4.71-4.12-4.85-4.31-.14-.19-1.16-1.55-1.16-2.96s.73-2.1 1-2.39c.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.37-.44.5-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.13.63-.08.17-.21.72-.84.92-1.13.19-.29.38-.24.64-.14.26.1 1.66.78 1.94.92.29.14.48.21.55.33.07.12.07.68-.17 1.36Z" />
    </svg>
  )
}
