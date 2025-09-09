import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Gift, Zap } from 'lucide-react'

const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    if (hasShown) return

    const handleScroll = () => {
      if (window.scrollY > 500) {
        setHasShown(true)
        setTimeout(() => {
          setIsOpen(true)
        }, 1000)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasShown])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleCTAClick = () => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', { 
        content_name: 'promo_modal_cta',
        method: 'modal'
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: 'promo_modal_cta' })
    }
    
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener')
    handleClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.7, 
              y: 50
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.7, 
              y: 50
            }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-3xl p-8 max-w-md w-full relative border-3 border-yellow-400 shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Zap className="w-8 h-8 text-green-600" />
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold mb-4 text-yellow-300"
              >
                ⚡ PROMOÇÃO RELÂMPAGO ⚡
              </motion.h3>

              {/* Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white/20 rounded-full px-4 py-2 mb-6 inline-block"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-semibold">Válida até 27 de Setembro de 2025</span>
                </div>
              </motion.div>

              {/* Offer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Gift className="w-6 h-6 text-yellow-300" />
                  <span className="text-xl font-bold">25 AÇÕES por apenas R$ 6,00!</span>
                </div>
                <p className="text-green-100 text-sm">
                  Aproveite esta oferta imperdível por tempo limitado!
                </p>
              </motion.div>

              {/* CTA Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCTAClick}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-green-800 font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🔥 APROVEITAR AGORA 🔥
              </motion.button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-full opacity-50"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-yellow-400 rounded-full opacity-50"></div>
            <div className="absolute top-1/2 left-2 w-2 h-2 bg-yellow-400 rounded-full opacity-30"></div>
            <div className="absolute top-1/3 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-30"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PromoModal
