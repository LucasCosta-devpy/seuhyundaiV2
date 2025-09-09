import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { useAnalytics } from '../../hooks/useAnalytics'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import { interfaceImages } from '../../assets/index'

/**
 * Header/Navbar profissional com glass morphism e animações
 */
const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const { trackCTAClick } = useAnalytics()
  // const { scrollY } = useScrollAnimation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCTAClick = () => {
    trackCTAClick('cta-header', 'participation')
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 py-3' 
          : 'bg-transparent py-4'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Brand/Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <div className="relative">
              <img 
                src={interfaceImages.logo} 
                alt="Rumo Mais Uma Rota" 
                className="w-12 h-12 rounded-xl shadow-lg border-2 border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl" />
            </div>
            
            <div className="hidden sm:block">
              <motion.span 
                className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-3 py-1.5 rounded-full text-sm font-bold shadow-gold"
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(251, 191, 36, 0.4)',
                    '0 0 30px rgba(251, 191, 36, 0.6)',
                    '0 0 20px rgba(251, 191, 36, 0.4)'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🚀 Ação entre amigos
              </motion.span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <Button
            variant="secondary"
            size="md"
            shimmer
            pulse
            onClick={handleCTAClick}
            className="font-bold uppercase tracking-wide"
          >
            🎯 Participar
          </Button>
        </nav>
      </div>

      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
        style={{
          width: `${(scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.header>
  )
}

export default Header
