import React from 'react'
import { motion } from 'framer-motion'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import { useAnalytics } from '@hooks/useAnalytics'

const ExtraAction: React.FC = () => {
  const { trackCTAClick } = useAnalytics()

  const handleExtraActionClick = () => {
    trackCTAClick('extra-action', 'extra_participation')
    window.open('https://rumomaisumarota.com.br/rifinha/rifaespecial02', '_blank', 'noopener,noreferrer')
  }

  return (
    <Card variant="premium" className="space-y-6 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
          🎯 Ação entre amigos extra
        </h2>
        <p className="text-white/70 mt-2">Ações extras para ganhar mais bilhetes na ação principal do Creta!</p>
      </div>

      <motion.div 
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-400/30 cursor-pointer hover:border-orange-400/50 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExtraActionClick}
      >
        <div className="flex justify-between items-start mb-4">
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-slate-900 px-3 py-1 rounded-full text-sm font-bold">
            ⚡ ATIVA
          </span>
          <span className="bg-gradient-to-r from-orange-400 to-amber-400 text-slate-900 px-4 py-2 rounded-full font-bold text-lg">
            R$ 6,00
          </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-4">
          Ação Extra - Escolha seu número e concorra a 10 bilhetes na ação principal!
        </h3>

        <div className="space-y-3 bg-slate-800/50 p-4 rounded-xl border-l-4 border-orange-400">
          <div className="flex items-center gap-2 text-white">
            <span>🏆</span>
            <span className="font-semibold">Prêmio:</span>
            <span>Concorra a 10 bilhetes extras para o Creta</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <span>📅</span>
            <span className="font-semibold">Data da Ação Extra:</span>
            <span>27/09/2025 às 16:00</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <span>🎫</span>
            <span className="font-semibold">Disponível:</span>
            <span>60 números</span>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button
            variant="secondary"
            size="lg"
            shimmer
            className="font-bold uppercase tracking-wide"
          >
            🎯 PARTICIPAR DA AÇÃO
          </Button>
        </div>
      </motion.div>
    </Card>
  )
}

export default ExtraAction
