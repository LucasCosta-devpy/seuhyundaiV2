import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Car, Smartphone, DollarSign, Trophy, Gift } from 'lucide-react'

const PrizeDetails = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const prizes = [
    {
      position: '1ª',
      icon: Car,
      title: 'Hyundai Creta Limited Turbo 1.0',
      description: 'Seminovo, modelo 2025 — super equipado, único dono, com transferência e entrega por nossa conta para qualquer lugar do Brasil.',
      alternative: 'R$ 140.000,00',
      color: 'from-blue-500 to-blue-700'
    },
    {
      position: '2ª',
      icon: Smartphone,
      title: 'iPhone 16 Pro Max 256GB',
      description: 'OU o valor equivalente em dinheiro.',
      alternative: 'Valor equivalente',
      color: 'from-gray-500 to-gray-700'
    },
    {
      position: '3ª',
      icon: DollarSign,
      title: 'R$ 5.000,00',
      description: 'Em dinheiro, transferido diretamente para sua conta.',
      alternative: null,
      color: 'from-green-500 to-green-700'
    }
  ]

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
    <section id="premio" className="py-20 px-4">
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
            🎁 Detalhes do Prêmio
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Três prêmios incríveis esperando por você!
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
        >
          {prizes.map((prize, index) => {
            const IconComponent = prize.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="card p-8 text-center relative overflow-hidden"
              >
                {/* Position Badge */}
                <div className={`absolute top-4 right-4 bg-gradient-to-r ${prize.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                  {prize.position} Recompensa
                </div>

                {/* Icon */}
                <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${prize.color} rounded-full flex items-center justify-center`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold mb-4 text-gray-800">
                  {prize.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {prize.description}
                </p>

                {/* Alternative */}
                {prize.alternative && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Alternativa:</p>
                    <p className="font-semibold text-gray-800">{prize.alternative}</p>
                  </div>
                )}

                {/* Special highlight for first prize */}
                {index === 0 && (
                  <div className="mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-orange-800">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold">Prêmio Principal</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bonus Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="card p-8 text-center bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-purple-600" />
            <h3 className="text-2xl font-bold text-purple-800">Bônus Especial</h3>
          </div>
          
          <p className="text-lg text-purple-700 mb-4">
            Quem acumular mais cotas terá como recompensa um{' '}
            <strong>iPhone 16 Pro Max 256GB</strong>
          </p>
          
          <div className="bg-white/50 rounded-lg p-4 inline-block">
            <p className="text-sm text-purple-600">
              🏆 Maior comprador = iPhone 16 Pro Max 256GB
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PrizeDetails
