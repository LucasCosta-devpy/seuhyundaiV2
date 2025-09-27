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
        content_name: 'rifinha_premiada_03',
        value: 3.89,
        currency: 'BRL'
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', { 
        content_name: 'Rifinha Premiada',
        content_type: 'product',
        value: 3.89,
        currency: 'BRL'
      })
    }
    
    window.open('https://rumomaisumarota.com.br/rifinha/rifinhapremiada03', '_blank', 'noopener')
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
            🎉 RIFINHA PREMIADA
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            🔥 Serão 60 bilhetes em jogo e 2 ganhadores! 🎟️💥
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
                  R$ 3,89
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              🎉 Vem aí a RIFINHA PREMIADA! 🎉
            </h3>

            {/* Details */}
            <div className="bg-white/70 rounded-xl p-6 mb-8 border-l-4 border-orange-500">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-6 h-6 text-orange-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Prêmios:</span>
                    <span className="text-gray-700 ml-2">🥇 1º lugar: 40 bilhetes | 🥈 2º lugar: 20 bilhetes</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-orange-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Sorteio:</span>
                    <span className="text-gray-700 ml-2">Realizado assim que 100% dos bilhetes forem vendidos ✅</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Ticket className="w-6 h-6 text-orange-600" />
                  <div>
                    <span className="font-semibold text-gray-800">Bilhetes:</span>
                    <span className="text-gray-700 ml-2">60 bilhetes em jogo - R$ 3,89 cada</span>
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
              <span className="relative z-10">PARTICIPAR DA RIFINHA PREMIADA</span>
            </motion.button>

            {/* Benefits */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm text-gray-600">60 bilhetes em jogo</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🏆</div>
                <p className="text-sm text-gray-600">2 ganhadores</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <p className="text-sm text-gray-600">Sorteio rápido</p>
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
                Compre seu bilhete por apenas R$ 3,89 e concorra a bilhetes na rifa principal! 
                🥇 1º lugar ganha 40 bilhetes e 🥈 2º lugar ganha 20 bilhetes. 
                🚀 Corre garantir o seu e aumentar suas chances de ganhar!!!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default ExtraAction
