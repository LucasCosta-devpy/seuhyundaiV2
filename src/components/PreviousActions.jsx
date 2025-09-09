import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { CheckCircle, Trophy, Calendar, User } from 'lucide-react'

const PreviousActions = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const previousActions = [
    {
      id: 1,
      title: "Ação Relâmpago - Concorreu a cotas na ação principal",
      status: "FINALIZADA",
      value: "R$ 3,00",
      winner: "Rodrigo G.",
      winnerRole: "Contemplado da ação relâmpago",
      topBuyer: "Lucas C.",
      topBuyerRole: "Maior comprador da ação relâmpago",
      date: "17/08/2024 12:00",
      color: "from-green-500 to-green-600"
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
    <section className="py-20 px-4">
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
            🏆 Ações Anteriores
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Veja algumas ações que já foram finalizadas e seus contemplados!
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {previousActions.map((action) => (
            <motion.div
              key={action.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -10 }}
              className="card p-6 relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div className={`bg-gradient-to-r ${action.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                  <CheckCircle className="w-3 h-3" />
                  {action.status}
                </div>
              </div>

              {/* Value Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {action.value}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-800 mb-6 mt-8 pr-20">
                {action.title}
              </h3>

              {/* Action Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-3 border-green-500">
                <div className="space-y-3">
                  {/* Winner */}
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-green-600" />
                    <div>
                      <span className="font-semibold text-gray-800">{action.winner}</span>
                      <p className="text-sm text-gray-600">{action.winnerRole}</p>
                    </div>
                  </div>
                  
                  {/* Top Buyer */}
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-semibold text-gray-800">{action.topBuyer}</span>
                      <p className="text-sm text-gray-600">{action.topBuyerRole}</p>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <div>
                      <span className="font-semibold text-gray-800">Entregue em:</span>
                      <p className="text-sm text-gray-600">{action.date}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success Indicator */}
              <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Ação Concluída com Sucesso</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Message */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              ✅ Histórico de Transparência
            </h3>
            <p className="text-gray-600 mb-6">
              Todas as nossas ações são realizadas com total transparência e os resultados são sempre divulgados publicamente.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Resultados Públicos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Ganhadores Reais</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Processo Auditado</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PreviousActions
