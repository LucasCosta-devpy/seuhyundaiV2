import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnalytics } from '@hooks/useAnalytics'

const FloatingPromo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { trackModalEvent } = useAnalytics()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !isVisible) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isVisible])

  const handleClick = () => {
    trackModalEvent('promo-floating', 'open')
    // Aqui você pode abrir um modal ou redirecionar
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl shadow-2xl border-2 border-white/20"
          initial={{ 
            opacity: 0, 
            scale: 0.3, 
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
            scale: 0.3, 
            y: 100 
          }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
          }}
          whileTap={{ 
            scale: 0.95 
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25
          }}
          onClick={handleClick}
        >
          <motion.span
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            ⚡
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default FloatingPromo
