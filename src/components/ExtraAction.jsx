import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Zap, Target, Calendar, Ticket, Gift } from 'lucide-react'

const ExtraAction = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const handleCTAClick = () => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'acao_extra_click', { 
        content_name: 'acao_extra_02',
        value: 6.00,
        currency: 'BRL'
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', { 
        content_name: 'Ação Extra',
        content_type: 'product',
        value: 6.00,
        currency: 'BRL'
      })
    }
    
    window.open('https://rumomaisumarota.com.br/rifinha/rifaespecial02', '_blank', 'noopener')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section id="acao-extra" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 gradient-text"
          >
            🎯 Ação entre Amigos Extra
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Ações extras para ganhar mais bilhetes na ação principal do Creta!
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="card p-8 relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 animate-pulse"></div>
            
            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  ATIVA
                </div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-lg font-bold">
                  R$ 6,00
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              Ação Extra - Escolha seu número e concorra a 10 bilhetes na ação principal!
            </h3>

            {/* Details */}
            <div className="bg-white/70 rounded-xl p-6 mb-8 border-l-4 border-orange-500">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6 text-orange-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Prêmio:</span>
                    <span className="text-gray-700 ml-2">Concorra a 10 bilhetes extras para o Creta</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Data da Ação Extra:</span>
                    <span className="text-gray-700 ml-2">27/09/2025 às 16:00</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-orange-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Disponível:</span>
                    <span className="text-gray-700 ml-2">60 números</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(249, 115, 22, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 10px 20px rgba(249, 115, 22, 0.3)",
                  "0 15px 30px rgba(249, 115, 22, 0.4)",
                  "0 10px 20px rgba(249, 115, 22, 0.3)"
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
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 relative overflow-hidden"
            >
              {/* Animated background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                animate={{
                  x: ["-100%", "100%"]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <Target className="w-5 h-5 relative z-10" />
              <span className="relative z-10">PARTICIPAR DA AÇÃO</span>
            </motion.button>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm text-gray-600">Escolha seu número favorito</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <p className="text-sm text-gray-600">10 bilhetes extras garantidos</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-sm text-gray-600">Ação rápida e simples</p>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-8 text-center"
          >
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">
                💡 Como funciona?
              </h4>
              <p className="text-blue-700">
                Compre seu número na ação extra por apenas R$ 6,00 e concorra a 10 bilhetes extras 
                na ação principal do Creta. Quanto mais bilhetes você tiver, maior sua chance de ganhar!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ExtraAction
