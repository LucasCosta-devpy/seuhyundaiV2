import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Zap, Gift, Users, ArrowRight } from 'lucide-react'

const ParticipationLevels = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [customQuantity, setCustomQuantity] = useState('')

  const handleCTAClick = (combo) => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', { 
        content_name: `combo_${combo}`, 
        method: 'button',
        value: combo === '1' ? 7.00 : combo === '2' ? 11.00 : combo === '3' ? 17.00 : combo === '5' ? 30.00 : combo === '7' ? 42.00 : 60.00
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: `combo_${combo}` })
    }
    
    // Redirecionar para o checkout com a quantidade específica de bilhetes
    const checkoutUrl = `https://rumomaisumarota.com.br/meucretadosonhos/checkout?numbers_quantity=${combo}`
    window.open(checkoutUrl, '_blank', 'noopener')
  }

  const handleCustomQuantity = () => {
    const quantity = parseInt(customQuantity)
    if (quantity && quantity > 0) {
      // Analytics tracking
      if (typeof gtag !== 'undefined') {
        gtag('event', 'generate_lead', { 
          content_name: `custom_quantity_${quantity}`, 
          method: 'input',
          value: quantity * 7.00 // Preço por bilhete
        })
      }
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', { content_name: `custom_quantity_${quantity}` })
      }
      
      // Redirecionar para o checkout com a quantidade customizada
      const checkoutUrl = `https://rumomaisumarota.com.br/meucretadosonhos/checkout?numbers_quantity=${quantity}`
      window.open(checkoutUrl, '_blank', 'noopener')
    }
  }

  const combos = [
    {
      id: '1',
      tickets: 1,
      originalPrice: 7.00,
      currentPrice: 7.00,
      discount: 0,
      discountAmount: 0,
      popular: false,
      icon: Gift
    },
    {
      id: '2',
      tickets: 2,
      originalPrice: 14.00,
      currentPrice: 11.00,
      discount: 21,
      discountAmount: 3,
      popular: false,
      icon: Users
    },
    {
      id: '3',
      tickets: 3,
      originalPrice: 21.00,
      currentPrice: 17.00,
      discount: 19,
      discountAmount: 4,
      popular: false,
      icon: Users
    },
    {
      id: '5',
      tickets: 5,
      originalPrice: 35.00,
      currentPrice: 30.00,
      discount: 14,
      discountAmount: 5,
      popular: true,
      icon: Users
    },
    {
      id: '7',
      tickets: 7,
      originalPrice: 49.00,
      currentPrice: 42.00,
      discount: 14,
      discountAmount: 7,
      popular: false,
      icon: Users
    },
    {
      id: '10',
      tickets: 10,
      originalPrice: 70.00,
      currentPrice: 60.00,
      discount: 14,
      discountAmount: 10,
      popular: false,
      icon: Users
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="participacao" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6"
          >
            <Zap className="w-4 h-4" />
            Promoção Setembro
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 gradient-text"
          >
            🌟 Níveis de Participação
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Escolha o combo ideal para você e aumente suas chances de conquistar!
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-4"
        >
          {combos.map((combo) => {
            const IconComponent = combo.icon
            return (
              <motion.div
                key={combo.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`relative card p-4 md:p-6 text-center h-full flex flex-col justify-between ${
                  combo.popular ? 'ring-2 ring-primary-500 shadow-2xl' : ''
                }`}
              >
                {combo.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="mb-4">
                    <IconComponent className="w-12 h-12 mx-auto text-primary-500 mb-3" />
                    <h3 className="text-2xl font-bold text-gray-800">
                      {combo.tickets} {combo.tickets === 1 ? 'Cota' : 'Cotas'}
                    </h3>
                  </div>

                  <div className="mb-6">
                    {/* Só mostra desconto se for maior que 0% */}
                    {combo.discountAmount > 0 && (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                          R$ {combo.discountAmount.toFixed(0)} de desconto
                        </span>
                      </div>
                    )}
                    <div className="text-2xl font-bold gradient-text whitespace-nowrap">
                      R$ {combo.currentPrice.toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCTAClick(combo.id)}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                      combo.popular
                        ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-primary-100 hover:to-primary-200 hover:text-primary-800'
                    }`}
                  >
                    Escolher {combo.tickets} Cota{combo.tickets > 1 ? 's' : ''}
                  </motion.button>

                  <div className="mt-4 h-6 flex items-center justify-center">
                    {combo.tickets > 1 && (
                      <div className="flex items-center justify-center gap-1 text-sm text-green-600">
                        <Check className="w-4 h-4" />
                        <span>Melhor custo-benefício</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Custom Quantity Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              🎯 Ou escolha sua quantidade personalizada
            </h3>
            <p className="text-gray-600 mb-6 text-center">
              Digite quantas cotas você deseja
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(e.target.value)}
                  placeholder="Ex: 15"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg font-semibold"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCustomQuantity}
                  disabled={!customQuantity || parseInt(customQuantity) <= 0}
                  className="bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ArrowRight className="w-5 h-5" />
                  Ir para Pagamento
                </motion.button>
              </div>
              
              {customQuantity && parseInt(customQuantity) > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-gray-600">
                    Você está comprando <strong>{customQuantity} cota{parseInt(customQuantity) > 1 ? 's' : ''}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Preço final será calculado no checkout
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            💡 <strong>Dica:</strong> Quanto mais cotas você comprar, maior sua chance de conquistar!
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ParticipationLevels
