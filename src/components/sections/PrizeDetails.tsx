import React from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'

const prizes = [
  {
    icon: '🚗',
    title: '1ª Recompensa',
    description: 'Hyundai Creta Limited Turbo 1.0, seminovo, modelo 2025 — super equipado, único dono, com transferência e entrega por nossa conta para qualquer lugar do Brasil.'
  },
  {
    icon: '💰',
    title: 'Alternativa em Dinheiro',
    description: 'Para quem preferir, também existe a opção de receber o valor de R$ 140.000,00.'
  },
  {
    icon: '📱',
    title: '2ª Recompensa',
    description: 'iPhone 16 Pro Max 256GB OU o valor equivalente.'
  },
  {
    icon: '💵',
    title: '3ª Recompensa',
    description: 'R$ 5.000,00.'
  },
  {
    icon: '🏆',
    title: 'Bônus Especial',
    description: 'Quem acumular mais bilhetes terá como recompensa um iPhone 16 Pro Max 256GB.'
  }
]

/**
 * Componente de detalhes dos prêmios
 */
const PrizeDetails: React.FC = () => {
  return (
    <Card variant="premium" className="space-y-6">
      <motion.h2 
        className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        🎁 Detalhes do prêmio
      </motion.h2>

      <div className="space-y-4">
        {prizes.map((prize, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="text-3xl flex-shrink-0 mt-1">
              {prize.icon}
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">{prize.title}:</h3>
              <p className="text-white/80 leading-relaxed">{prize.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default PrizeDetails
