import React from 'react'
import { motion } from 'framer-motion'
import Card from '@components/ui/Card'

const previousActions = [
  {
    id: 1,
    title: 'Ação Relâmpago - Concorreu a bilhetes na ação principal',
    price: 3.00,
    winner: 'Rodrigo G.',
    topBuyer: 'Lucas C.',
    deliveryDate: '17/08/2024 12:00',
    status: 'completed' as const
  }
]

const PreviousActions: React.FC = () => {
  return (
    <Card variant="glass" className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          🏆 Ações Anteriores
        </h2>
        <p className="text-white/70 mt-2">Veja algumas ações que já foram sorteadas e seus ganhadores!</p>
      </div>

      <div className="space-y-4">
        {previousActions.map((action, index) => (
          <motion.div
            key={action.id}
            className="bg-white/5 border border-green-400/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
                ✅ SORTEADA
              </span>
              <span className="bg-slate-600 text-white px-3 py-1 rounded-full font-semibold">
                R$ {action.price.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-white mb-4">{action.title}</h4>

            <div className="bg-white/5 p-4 rounded-lg border-l-4 border-green-400 space-y-2">
              <div className="flex items-center gap-2 text-white">
                <span>🎉</span>
                <span className="font-semibold">Ganhador da ação relâmpago:</span>
                <span>{action.winner}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span>🎉</span>
                <span className="font-semibold">Maior comprador da ação relâmpago:</span>
                <span>{action.topBuyer}</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <span>📅</span>
                <span className="font-semibold">Entregue em:</span>
                <span>{action.deliveryDate}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default PreviousActions
