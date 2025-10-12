import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Shield, Zap } from 'lucide-react'

const Hero = () => {
  // Array das imagens para mesclar aleatoriamente
  const carImages = [
    '/assets/img/car 5.jpeg',
    '/assets/img/car 6.jpeg',
    '/assets/img/car1.jpeg',
    '/assets/img/car2.jpeg',
    '/assets/img/car3.jpeg',
    '/assets/img/car4.jpeg'
  ]

  const [randomImages, setRandomImages] = useState([])
  const [bubbles, setBubbles] = useState([])
  const containerRef = useRef(null)
  const topWallRef = useRef(0)

  useEffect(() => {
    // Função para embaralhar array sem repetições
    const shuffleArray = (array) => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    // Função para atualizar imagens
    const updateImages = () => {
      const shuffled = shuffleArray(carImages)
      setRandomImages(shuffled)
    }

    // Atualiza imediatamente
    updateImages()

    // Atualiza a cada 15 segundos
    const interval = setInterval(updateImages, 15000)

    return () => clearInterval(interval)
  }, [])

  // Atualiza imagens das bolhas quando o embaralhamento muda
  useEffect(() => {
    if (!randomImages || randomImages.length === 0) return
    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble, index) => ({
        ...bubble,
        img: randomImages[index] || bubble.img
      }))
    )
  }, [randomImages])

  // Inicializa bolhas e reconfigura em resize
  useEffect(() => {
    const createInitialBubbles = (width, height) => {
      // calcula parede superior (baseado no header fixo)
      const header = document.querySelector('header')
      topWallRef.current = (header?.offsetHeight || 0) + 8

      const isMd = window.innerWidth >= 768
      // raios em px (dois grandes nos topos, quatro menores no meio/baixo)
      const radii = isMd ? [72, 72, 48, 48, 48, 48] : [48, 48, 40, 40, 40, 40]

      // 3 à esquerda, 3 à direita (ordem: L-top, R-top, L-mid, R-mid, L-bot, R-bot)
      const percentPositions = isMd
        ? [
            { x: 5, y: 12 },  // L-top
            { x: 95, y: 12 }, // R-top
            { x: 6, y: 50 },  // L-mid
            { x: 94, y: 50 }, // R-mid
            { x: 5, y: 85 },  // L-bot
            { x: 95, y: 85 }  // R-bot
          ]
        : [
            { x: 6, y: 16 },  // L-top
            { x: 94, y: 24 }, // R-top
            { x: 6, y: 54 },  // L-mid
            { x: 94, y: 58 }, // R-mid
            { x: 6, y: 82 },  // L-bot
            { x: 94, y: 86 }  // R-bot
          ]

      const pickImg = (i) =>
        randomImages[i] ||
        ['/assets/img/car1.jpeg','/assets/img/car2.jpeg','/assets/img/car3.jpeg','/assets/img/car4.jpeg','/assets/img/car 5.jpeg','/assets/img/car 6.jpeg'][i]

      return radii.map((radius, i) => {
        const px = (percentPositions[i].x / 100) * width
        const py = (percentPositions[i].y / 100) * height
        const speed = 20 + Math.random() * 40 // px/s
        const angle = Math.random() * Math.PI * 2
        return {
          x: Math.max(radius + 1, Math.min(width - radius - 1, px)),
          y: Math.max(topWallRef.current + radius + 1, Math.min(height - radius - 1, py)),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius,
          img: pickImg(i)
        }
      })
    }

    const init = () => {
      const el = containerRef.current
      if (!el) return
      const width = el.clientWidth
      const height = el.clientHeight
      setBubbles(createInitialBubbles(width, height))
    }

    init()
    const onResize = () => init()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Animação e colisão desativadas temporariamente (manter para uso futuro)
  // useEffect(() => {
  //   let rafId
  //   let previousTimestamp
  //   const step = (timestamp) => {
  //     if (!previousTimestamp) previousTimestamp = timestamp
  //     const dt = Math.min((timestamp - previousTimestamp) / 1000, 0.033)
  //     previousTimestamp = timestamp
  //     setBubbles((prev) => {
  //       const el = containerRef.current
  //       if (!el || prev.length === 0) return prev
  //       const width = el.clientWidth
  //       const height = el.clientHeight
  //       const header = document.querySelector('header')
  //       topWallRef.current = (header?.offsetHeight || 0) + 8
  //       const next = prev.map((b) => ({ ...b }))
  //       // ... movimentação, bordas e colisão ...
  //       return next
  //     })
  //     rafId = requestAnimationFrame(step)
  //   }
  //   rafId = requestAnimationFrame(step)
  //   return () => cancelAnimationFrame(rafId)
  // }, [])
  const handleCTAClick = () => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', { content_name: 'hero_cta', method: 'button' })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: 'hero_cta' })
    }
    
    // Scroll para a seção de participação
    const participationSection = document.getElementById('participacao')
    if (participationSection) {
      participationSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      
      {/* Car Images as Floating Bubbles - com colisão */}
      <div className="absolute inset-0 overflow-hidden" ref={containerRef}>
        {bubbles.map((b, index) => (
          <div
            key={index}
            className="absolute rounded-full overflow-hidden shadow-xl md:shadow-2xl will-change-transform"
            style={{
              width: b.radius * 2,
              height: b.radius * 2,
              left: 0,
              top: 0,
              transform: `translate(${b.x - b.radius}px, ${b.y - b.radius}px)`
            }}
          >
            <img src={b.img} alt="Carro" className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-lg"
        >
          <Zap className="w-4 h-4" />
          Ação entre amigos
        </motion.div>

        {/* Main Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight px-2"
        >
          Entre nessa{' '}
          <span className="gradient-text bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Ação Entre Amigos
          </span>
          <br />
          e garanta sua chance de levar um carro incrível!
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4"
        >
          Adquira sua cota e acelere rumo à oportunidade! 🚗✨
        </motion.p>

        {/* CTA Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              "0 10px 20px rgba(59, 130, 246, 0.3)",
              "0 15px 30px rgba(59, 130, 246, 0.4)",
              "0 10px 20px rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          onClick={handleCTAClick}
          className="btn-secondary text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 mb-8 md:mb-12 pulse-glow relative overflow-hidden mx-4"
        >
          {/* Animated background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20"
            animate={{
              x: ["-100%", "100%"]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <span className="relative z-10">Participar Agora</span>
          <ArrowRight className="w-5 h-5 relative z-10" />
        </motion.button>

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-gray-300 px-4"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Ambiente 100% Seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Site Verificado</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            <span>Garantia de 7 dias</span>
          </div>
        </motion.div>

        {/* Scroll Hint */}
        <motion.div
          variants={itemVariants}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-400 animate-pulse">
            📜 Role a página para ver mais informações
          </p>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
