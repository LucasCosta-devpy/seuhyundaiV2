import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap } from 'lucide-react'

const FloatingPromo = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasShown])

  const handleClick = () => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'promo_modal_open', { 
        content_name: 'floating_promo',
        promo_active: false
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'PromoModalOpen', { 
        source: 'floating_button',
        promo_active: false
      })
    }
    
    // Open promo modal (if implemented)
    const modal = document.getElementById('promo-modal')
    if (modal) {
      modal.classList.add('show')
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ 
            opacity: 0, 
            scale: 0.5, 
            y: 100,
            rotate: 180
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
            y: 100,
            rotate: -180
          }}
          transition={{ 
            duration: 0.6,
            ease: "easeOut"
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 border-3 border-yellow-400"
            animate={{
              boxShadow: [
                "0 4px 20px rgba(34, 197, 94, 0.4)",
                "0 8px 40px rgba(34, 197, 94, 0.8)",
                "0 4px 20px rgba(34, 197, 94, 0.4)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="w-8 h-8" />
          </motion.button>

          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-green-400"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FloatingPromo
