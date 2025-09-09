import React from 'react'
import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { useAnalytics } from '../../hooks/useAnalytics'
import type { ComboOption } from '../../types/index'

interface ParticipationLevelsProps {
  variant?: 'default' | 'compact'
}

const comboOptions: ComboOption[] = [
  {
    id: 'single',
    tickets: 1,
    originalPrice: 15,
    salePrice: 15,
    icon: '🎫',
  },
  {
    id: 'combo-10',
    tickets: 10,
    originalPrice: 150,
    salePrice: 49.99,
    discount: 67,
    icon: '🎯',
  },
  {
    id: 'combo-20',
    tickets: 20,
    originalPrice: 300,
    salePrice: 89.99,
    discount: 70,
    popular: true,
    icon: '🚀',
  },
  {
    id: 'combo-30',
    tickets: 30,
    originalPrice: 450,
    salePrice: 132.99,
    discount: 70,
    icon: '⭐',
  },
  {
    id: 'combo-50',
    tickets: 50,
    originalPrice: 750,
    salePrice: 221.99,
    discount: 70,
    icon: '👑',
  },
]

/**
 * Componente de Níveis de Participação
 */
const ParticipationLevels: React.FC<ParticipationLevelsProps> = ({ variant = 'default' }) => {
  const { trackCTAClick } = useAnalytics()

  const handleComboClick = (comboId: string, _price: number) => {
    trackCTAClick(comboId, 'combo_selection')
    // Implementar lógica de redirecionamento baseada no combo
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener,noreferrer')
  }

  if (variant === 'compact') {
    return (
      <Card variant="premium" className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-2">
            🌟 Níveis de Participação
          </h3>
          <p className="text-white/70">
            <strong>Contribuição unitária:</strong> R$ 15,00 por participação
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-center text-white/80 font-medium">💎 Combos Especiais</p>
          {comboOptions.slice(1).map((combo, _index) => (
            <Button
              key={combo.id}
              variant="secondary"
              size="md"
              shimmer
              pulse={combo.popular}
              onClick={() => handleComboClick(combo.id, combo.salePrice)}
              className="w-full justify-between"
            >
              <span>{combo.icon} {combo.tickets} bilhetes</span>
              <span className="font-bold">R$ {combo.salePrice.toFixed(2).replace('.', ',')}</span>
            </Button>
          ))}
        </div>

        <Button
          variant="premium"
          size="lg"
          shimmer
          onClick={() => handleComboClick('cta-compact', 0)}
          className="w-full font-bold"
        >
          🚀 Ir para o site
        </Button>
      </Card>
    )
  }

  return (
    <Card variant="glass" className="space-y-8">
      <div className="text-center">
        <motion.h2 
          className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          🌟 Níveis de Participação
        </motion.h2>
        <p className="text-white/80 text-lg">
          <strong>Contribuição unitária:</strong> R$ 15,00 por participação
        </p>
      </div>

      {/* Single Ticket */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Button
          variant="success"
          size="lg"
          shimmer
          onClick={() => handleComboClick(comboOptions[0].id, comboOptions[0].salePrice)}
          className="w-full max-w-md mx-auto block font-bold"
        >
          {comboOptions[0].icon} {comboOptions[0].tickets} bilhete — R$ {comboOptions[0].salePrice.toFixed(2).replace('.', ',')}
        </Button>
      </motion.div>

      {/* Combos */}
      <div className="space-y-4">
        <p className="text-center text-white/80 font-semibold text-lg">💎 Combos Especiais</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comboOptions.slice(1).map((combo, _index) => (
            <motion.div
              key={combo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + _index * 0.1 }}
              className="relative"
            >
              {combo.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    🔥 MAIS POPULAR
                  </span>
                </div>
              )}
              
              <Button
                variant={combo.popular ? "premium" : "secondary"}
                size="lg"
                shimmer
                pulse={combo.popular}
                onClick={() => handleComboClick(combo.id, combo.salePrice)}
                className="w-full h-20 flex-col space-y-1 font-bold relative overflow-hidden"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">{combo.icon}</span>
                  <span>{combo.tickets} bilhetes</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {combo.discount && (
                    <span className="text-xs line-through opacity-60">
                      R$ {combo.originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <span className="text-lg">
                    R$ {combo.salePrice.toFixed(2).replace('.', ',')}
                  </span>
                  {combo.discount && (
                    <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                      -{combo.discount}%
                    </span>
                  )}
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default ParticipationLevels
