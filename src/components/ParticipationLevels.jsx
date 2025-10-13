import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Check, Zap, Gift, Users, ArrowRight, Clock, AlertTriangle } from 'lucide-react'

const ParticipationLevels = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [customQuantity, setCustomQuantity] = useState('')
  const [timeLeft, setTimeLeft] = useState({})
  const [isPromoActive, setIsPromoActive] = useState(true)

  // Data de fim da promoção: 19 de outubro de 2025 às 23:59:59
  const promoEndDate = new Date('2025-10-19T23:59:59').getTime()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = promoEndDate - now

      if (distance < 0) {
        setIsPromoActive(false)
        clearInterval(timer)
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Preço unitário atual e preço anterior (exibição)
  const UNIT_PRICE = 7.00
  const UNIT_OLD_PRICE = 14.99

  const handleCTAClick = (combo) => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', { 
        content_name: `combo_${combo}`, 
        method: 'button',
        value: isPromoActive 
          ? (combo === '1' ? 14.99 : combo === '10' ? 29.90 : combo === '50' ? 75.00 : combo === '100' ? 100.00 : 400.00)
          : (combo === '1' ? 14.99 : combo === '2' ? 11.00 : combo === '3' ? 17.00 : combo === '5' ? 30.00 : combo === '7' ? 42.00 : 60.00)
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
          value: quantity * 14.99 // Preço por bilhete
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

  // Preços da promoção (até 19/10 às 23:59:59)
  const promoCombos = [
    {
      id: '1',
      tickets: 1,
      originalPrice: 14.99,
      currentPrice: 14.99,
      discount: 0,
      discountAmount: 0,
      popular: false,
      icon: Gift
    },
    {
      id: '10',
      tickets: 10,
      originalPrice: 149.90,
      currentPrice: 29.90,
      discount: 80,
      discountAmount: 40.10,
      popular: false,
      icon: Users
    },
    {
      id: '50',
      tickets: 50,
      originalPrice: 749.50,
      currentPrice: 75.00,
      discount: 90,
      discountAmount: 275.00,
      popular: true,
      icon: Users
    },
    {
      id: '100',
      tickets: 100,
      originalPrice: 1499.00,
      currentPrice: 100.00,
      discount: 93,
      discountAmount: 600.00,
      popular: false,
      icon: Users
    },
    {
      id: '500',
      tickets: 500,
      originalPrice: 7495.00,
      currentPrice: 400.00,
      discount: 95,
      discountAmount: 3100.00,
      popular: false,
      icon: Users
    }
  ]

  // Preços normais (após promoção)
  const normalCombos = [
    {
      id: '1',
      tickets: 1,
      originalPrice: 14.99,
      currentPrice: 14.99,
      discount: 0,
      discountAmount: 0,
      popular: false,
      icon: Gift
    },
    {
      id: '2',
      tickets: 2,
      originalPrice: 29.98,
      currentPrice: 11.00,
      discount: 63,
      discountAmount: 18.98,
      popular: false,
      icon: Users
    },
    {
      id: '3',
      tickets: 3,
      originalPrice: 44.97,
      currentPrice: 17.00,
      discount: 62,
      discountAmount: 27.97,
      popular: false,
      icon: Users
    },
    {
      id: '5',
      tickets: 5,
      originalPrice: 74.95,
      currentPrice: 30.00,
      discount: 60,
      discountAmount: 44.95,
      popular: true,
      icon: Users
    },
    {
      id: '7',
      tickets: 7,
      originalPrice: 104.93,
      currentPrice: 42.00,
      discount: 60,
      discountAmount: 62.93,
      popular: false,
      icon: Users
    },
    {
      id: '10',
      tickets: 10,
      originalPrice: 149.90,
      currentPrice: 60.00,
      discount: 60,
      discountAmount: 89.90,
      popular: false,
      icon: Users
    }
  ]

  const combos = isPromoActive ? promoCombos : normalCombos

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
         {/* Alerta de Promoção */}
         {isPromoActive && (
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-6"
           >
             <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-xl shadow-lg border-2 border-yellow-300 overflow-hidden">
               {/* Animação do carro */}
               <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute bottom-0 left-0 w-full h-16 bg-gray-600 opacity-20"></div>
                 <div className="absolute bottom-2 left-0 w-full h-1 bg-yellow-300 opacity-40"></div>
                 <div className="absolute bottom-2 left-0 w-full h-1 bg-yellow-300 opacity-40" style={{background: 'repeating-linear-gradient(90deg, #fbbf24 0px, #fbbf24 20px, transparent 20px, transparent 40px)'}}></div>
                 
                 {/* Carro animado realista com contador */}
                 <div className="absolute bottom-2 car-animation">
                   <div className="relative w-20 h-10">
                     {/* Corpo principal do carro */}
                     <div className="absolute top-3 left-3 w-14 h-5 bg-red-600 rounded-lg">
                       {/* Janelas laterais */}
                       <div className="absolute top-0 left-2 w-2 h-3 bg-blue-200 rounded-sm"></div>
                       <div className="absolute top-0 right-2 w-2 h-3 bg-blue-200 rounded-sm"></div>
                       {/* Porta */}
                       <div className="absolute top-0 left-5 w-4 h-4 bg-red-500 rounded-sm border border-red-700"></div>
                       {/* Farol dianteiro */}
                       <div className="absolute top-1 right-0 w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
                       {/* Farol traseiro */}
                       <div className="absolute top-1 left-0 w-1 h-1 bg-red-400 rounded-full"></div>
                     </div>
                     
                     {/* Teto do carro */}
                     <div className="absolute top-1 left-4 w-8 h-4 bg-gray-700 rounded-t-lg">
                       {/* Para-brisa dianteiro */}
                       <div className="absolute top-0 right-1 w-2 h-2 bg-blue-200 rounded-sm"></div>
                       {/* Janela traseira */}
                       <div className="absolute top-0 left-1 w-2 h-2 bg-blue-200 rounded-sm"></div>
                       {/* Antena */}
                       <div className="absolute -top-1 left-4 w-0.5 h-2 bg-gray-600"></div>
                     </div>
                     
                     {/* Rodas dianteiras */}
                     <div className="absolute bottom-0 left-2 w-4 h-4 bg-gray-900 rounded-full wheel-animation">
                       <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
                       <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-gray-800"></div>
                     </div>
                     
                     {/* Rodas traseiras */}
                     <div className="absolute bottom-0 right-2 w-4 h-4 bg-gray-900 rounded-full wheel-animation">
                       <div className="absolute top-1 left-1 w-2 h-2 bg-gray-600 rounded-full"></div>
                       <div className="absolute top-1.5 left-1.5 w-1 h-1 bg-gray-800"></div>
                     </div>
                     
                     {/* Para-choque dianteiro */}
                     <div className="absolute bottom-2 right-0 w-2 h-1.5 bg-gray-800 rounded-sm"></div>
                     
                     {/* Para-choque traseiro */}
                     <div className="absolute bottom-2 left-0 w-2 h-1.5 bg-gray-800 rounded-sm"></div>
                     
                     {/* Sombra do carro */}
                     <div className="absolute -bottom-1 left-0 w-20 h-1.5 bg-black opacity-30 rounded-full"></div>
                   </div>
                 </div>
               </div>
               
               <div className="relative z-10 text-center">
                 <h3 className="text-xl font-bold mb-1">🚗 Chance em dobro</h3>
                 <p className="text-sm font-semibold mb-3">
                   Compre agora e DOBRE SUA CHANCE DE GANHAR O PRÊMIO
                 </p>
                 
                 {/* Cronômetro compacto */}
                 <div className="bg-black text-yellow-400 px-4 py-2 rounded-lg mb-2 inline-block">
                   <div className="text-center">
                     <div className="text-xs mb-1">Encerra em</div>
                     <div className="text-lg font-bold">
                       {timeLeft.days || 0}:{String(timeLeft.hours || 0).padStart(2, '0')}:{String(timeLeft.minutes || 0).padStart(2, '0')}:{String(timeLeft.seconds || 0).padStart(2, '0')}
                     </div>
                   </div>
                 </div>
                 
                 <p className="text-xs opacity-80">
                   Válido até 19/10/2025 às 23:59
                 </p>
               </div>
             </div>
           </motion.div>
         )}

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className={`inline-flex items-center gap-2 text-white px-6 py-3 rounded-full text-sm font-semibold mb-6 ${
              isPromoActive 
                ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                : 'bg-gradient-to-r from-primary-500 to-accent-500'
            }`}
          >
            <Zap className="w-4 h-4" />
            {isPromoActive ? '🔥 PROMOÇÃO ESPECIAL' : 'Promoção Setembro'}
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
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-4 ${
            isPromoActive ? 'xl:grid-cols-5' : 'xl:grid-cols-6'
          }`}
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
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                          -R$ {combo.discountAmount.toFixed(2).replace('.', ',')} de desconto
                        </span>
                      </div>
                    )}
                     <div className="text-center">
                       {combo.tickets === 1 ? (
                         <div>
                           <div className="flex items-center justify-center gap-2">
                             <span className="text-2xl font-bold gradient-text whitespace-nowrap">
                               R$ {UNIT_PRICE.toFixed(2).replace('.', ',')}
                             </span>
                             <span className="text-red-600 line-through text-sm font-semibold whitespace-nowrap">
                               R$ {UNIT_OLD_PRICE.toFixed(2).replace('.', ',')}
                             </span>
                           </div>
                           <div className="text-sm font-normal text-gray-600 mt-1">cota unitária</div>
                         </div>
                       ) : (
                         <div>
                           {combo.tickets > 1 ? (
                             <div>
                               <div className="text-2xl font-bold gradient-text whitespace-nowrap">
                                 R$ {(combo.currentPrice / combo.tickets).toFixed(2).replace('.', ',')}
                               </div>
                               <div className="text-sm font-normal text-gray-600 mt-1">cada</div>
                             </div>
                           ) : (
                             <div className="text-2xl font-bold gradient-text whitespace-nowrap">
                               R$ {combo.currentPrice.toFixed(2).replace('.', ',')}
                             </div>
                           )}
                         </div>
                       )}
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
