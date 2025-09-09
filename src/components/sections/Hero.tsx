import React from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'
import { useAnalytics } from '../../hooks/useAnalytics'
import { interfaceImages } from '../../assets/index'

/**
 * Hero Section cinematográfica com animações avançadas
 */
const Hero: React.FC = () => {
  const { trackCTAClick } = useAnalytics()

  const handleCTAClick = () => {
    trackCTAClick('cta-hero', 'participation')
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 50%, rgba(15, 23, 42, 0.9) 100%), url(${interfaceImages.heroBg})`,
          }}
        />
        
        {/* Animated Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10"
          animate={{
            background: [
              'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 80%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          {/* Eyebrow */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wide shadow-gold mb-8"
            animate={{ 
              boxShadow: [
                '0 0 20px rgba(251, 191, 36, 0.4)',
                '0 0 40px rgba(251, 191, 36, 0.6)',
                '0 0 20px rgba(251, 191, 36, 0.4)'
              ]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <span className="text-2xl">🚀</span>
            Ação entre amigos
          </motion.div>

          {/* Main Title */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
              Entre nessa Ação Entre Amigos e garanta sua chance de levar um{' '}
            </span>
            <motion.span 
              className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              carro incrível!
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.6,
              delay: 0.9,
              ease: "easeOut"
            }}
          >
            Adquira sua cota e acelere rumo à sorte! 🚗✨
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6,
              delay: 1.2,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <Button
              variant="secondary"
              size="xl"
              shimmer
              pulse
              onClick={handleCTAClick}
              className="text-xl font-black uppercase tracking-wider px-12 py-6"
            >
              🎯 Participar Agora
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 text-6xl opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🚗
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-10 text-4xl opacity-30"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          ✨
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-20 text-3xl opacity-25"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 15, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          🎯
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        animate={{ y: [0, 10, 0] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium">Role para baixo</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
