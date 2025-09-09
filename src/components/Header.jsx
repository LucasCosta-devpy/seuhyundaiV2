import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCTAClick = () => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', { content_name: 'header_cta', method: 'button' })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: 'header_cta' })
    }
    
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener')
  }

  const handleExtraActionClick = () => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'acao_extra_click', { 
        content_name: 'header_acao_extra',
        value: 6.00,
        currency: 'BRL'
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', { 
        content_name: 'Header Ação Extra',
        content_type: 'product',
        value: 6.00,
        currency: 'BRL'
      })
    }
    
    // Scroll para a seção ExtraAction
    const extraSection = document.getElementById('acao-extra')
    if (extraSection) {
      extraSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <img 
              src="/assets/img/logo.jpg" 
              alt="Rumo Mais Uma Rota" 
              className="w-12 h-12 rounded-xl shadow-md"
              onError={(e) => {
                console.error('Erro ao carregar logo:', e.target.src)
                e.target.style.display = 'none'
              }}
            />
            <span className="text-lg font-bold gradient-text">
              Ação entre amigos
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#premio" className="text-gray-700 hover:text-primary-600 transition-colors">
              Prêmio
            </a>
            <a href="#participacao" className="text-gray-700 hover:text-primary-600 transition-colors">
              Participação
            </a>
            <a href="#depoimentos" className="text-gray-700 hover:text-primary-600 transition-colors">
              Depoimentos
            </a>
            <a href="#redes" className="text-gray-700 hover:text-primary-600 transition-colors">
              Redes Sociais
            </a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExtraActionClick}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Ação Extra
            </motion.button>
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCTAClick}
            className="btn-primary hidden md:flex"
          >
            Participar Agora
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMobileMenuOpen ? 1 : 0, 
            height: isMobileMenuOpen ? 'auto' : 0 
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md rounded-xl mt-2 shadow-lg"
        >
          <nav className="flex flex-col p-4 space-y-4">
            <a 
              href="#premio" 
              className="text-gray-700 hover:text-primary-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Prêmio
            </a>
            <a 
              href="#participacao" 
              className="text-gray-700 hover:text-primary-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Participação
            </a>
            <a 
              href="#depoimentos" 
              className="text-gray-700 hover:text-primary-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Depoimentos
            </a>
            <a 
              href="#redes" 
              className="text-gray-700 hover:text-primary-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Redes Sociais
            </a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleExtraActionClick()
                setIsMobileMenuOpen(false)
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Ação Extra
            </motion.button>
            <button
              onClick={handleCTAClick}
              className="btn-primary w-full mt-2"
            >
              Participar Agora
            </button>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header
