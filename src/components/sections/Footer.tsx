import React from 'react'
import { motion } from 'framer-motion'
import Card from '@components/ui/Card'
import { interfaceImages } from '../../assets/index'

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <Card variant="premium" className="text-center space-y-6">
          {/* Trust Elements */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            <motion.div 
              className="flex items-center gap-2 text-green-400"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M6 10V8a6 6 0 1112 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 15l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Ambiente seguro</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 text-blue-400"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 13l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Site verificado</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-2 text-amber-400"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Garantia de 7 dias</span>
            </motion.div>

            <motion.img 
              src={interfaceImages.guaranteeSeal} 
              alt="Garantia de 7 dias" 
              className="h-11 w-auto"
              whileHover={{ scale: 1.1 }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />

            <motion.img 
              src={interfaceImages.lotteryBox} 
              alt="Sorteio pela Loteria Federal" 
              className="h-11 w-auto"
              whileHover={{ scale: 1.1 }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>

          {/* Legal Text */}
          <div className="text-white/60 text-sm leading-relaxed max-w-3xl mx-auto">
            <p>
              Campanha privada entre amigos. Quantidades limitadas. Consulte regras e prazos no{' '}
              <a 
                href="https://rumomaisumarota.com.br/meucretadosonhos" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline transition-colors"
              >
                regulamento
              </a>
              {' '}clicando em "Participar".
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-white/10 text-white/40 text-xs">
            <p>&copy; {new Date().getFullYear()} Rumo Mais Uma Rota. Todos os direitos reservados.</p>
          </div>
        </Card>
      </div>
    </footer>
  )
}

export default Footer
