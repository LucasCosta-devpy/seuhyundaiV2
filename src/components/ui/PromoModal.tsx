import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Button from './Button'
import { useAnalytics } from '@hooks/useAnalytics'

const PromoModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const { trackModalEvent } = useAnalytics()

  // Configuração da promoção (pode ser movida para um contexto ou props)
  const PROMO_ACTIVE = false // Mude para true para ativar

  useEffect(() => {
    if (!PROMO_ACTIVE || hasShown) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      setHasShown(true)
      trackModalEvent('promo-auto', 'open')
    }, 5000) // Abre após 5 segundos

    return () => clearTimeout(timer)
  }, [PROMO_ACTIVE, hasShown, trackModalEvent])

  const handleClose = () => {
    setIsOpen(false)
    trackModalEvent('promo-modal', 'close')
  }

  const handleCTAClick = () => {
    trackModalEvent('promo-modal', 'cta_click')
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener,noreferrer')
    setIsOpen(false)
  }

  if (!PROMO_ACTIVE) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 max-w-md w-full text-white relative border-2 border-amber-400"
            initial={{ 
              opacity: 0, 
              scale: 0.5, 
              y: -100,
              rotate: -10 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotate: 0 
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.5, 
              y: 100 
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={handleClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>

            {/* Content */}
            <div className="text-center space-y-4">
              <motion.h3 
                className="text-2xl font-bold text-amber-300"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⚡ PROMOÇÃO RELÂMPAGO ⚡
              </motion.h3>

              <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">
                🕒 Válida até 27 de Setembro de 2025
              </div>

              <div className="text-xl font-bold">
                🎯 Oferta especial por tempo limitado!
              </div>

              <p className="text-sm opacity-90">
                Aproveite esta oferta imperdível e garante sua participação!
              </p>

              <Button
                variant="secondary"
                size="lg"
                shimmer
                onClick={handleCTAClick}
                className="w-full font-bold uppercase tracking-wide"
              >
                🔥 APROVEITAR AGORA 🔥
              </Button>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl pointer-events-none" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PromoModal
