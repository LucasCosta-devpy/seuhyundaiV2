import React from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, Clock, Lock, ArrowUp } from 'lucide-react'

const Footer = () => {
  const handleCTAClick = () => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', { content_name: 'footer_cta', method: 'button' })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: 'footer_cta' })
    }
    
    window.open('https://rumomaisumarota.com.br/meucretadosonhos', '_blank', 'noopener')
  }

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
      <div className="container mx-auto px-4">
        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="card bg-white/10 backdrop-blur-sm border border-white/20 p-4 md:p-6 lg:p-8 rounded-2xl">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 lg:gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold">Ambiente Seguro</p>
                  <p className="text-sm text-gray-300">Pagamento 100% protegido</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">Site Verificado</p>
                  <p className="text-sm text-gray-300">Certificado de segurança</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="font-semibold">Garantia de 7 dias</p>
                  <p className="text-sm text-gray-300">Satisfação garantida</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Lock className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold">Dados Protegidos</p>
                  <p className="text-sm text-gray-300">LGPD compliant</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex justify-center items-center gap-8 mb-12"
        >
          <img 
            src="/assets/img/Selo_de_Garantia_de_7_Dias_PNG_Transparente_Sem_Fundo.png" 
            alt="Garantia de 7 dias" 
            className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
          />
          <img 
            src="/assets/img/selo_caixa.png" 
            alt="Sorteio pela Loteria Federal" 
            className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
          />
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <img 
                src="/assets/img/logo.jpg" 
                alt="Rumo Mais Uma Rota" 
                className="w-12 h-12 rounded-xl"
              />
              <span className="text-xl font-bold">Rumo Mais Uma Rota</span>
            </div>
            <p className="text-gray-300 mb-4">
              Ações entre amigos transparentes e confiáveis. Participe e tenha a chance de conquistar recompensas incríveis!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCTAClick}
              className="btn-primary"
            >
              Participar Agora
            </motion.button>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#premio" className="text-gray-300 hover:text-white transition-colors">Recompensas</a></li>
              <li><a href="#participacao" className="text-gray-300 hover:text-white transition-colors">Participação</a></li>
              <li><a href="#depoimentos" className="text-gray-300 hover:text-white transition-colors">Depoimentos</a></li>
              <li><a href="#redes" className="text-gray-300 hover:text-white transition-colors">Redes Sociais</a></li>
            </ul>
          </div>

          {/* Contact - Desativado por enquanto */}
          {/* <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-2 text-gray-300">
              <p>📧 contato@rumomaisumarota.com</p>
              <p>📱 WhatsApp: (11) 99999-9999</p>
              <p>🕒 Atendimento 24/7</p>
            </div>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 pt-8 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Campanha privada entre amigos. Quantidades limitadas. Consulte regras e prazos no{' '}
            <a 
              href="https://rumomaisumarota.com.br/meucretadosonhos" 
              target="_blank" 
              rel="noopener"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              regulamento
            </a>{' '}
            clicando em "Participar".
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-4">
            <a 
              href="https://rumomaisumarota.com.br/termos-de-uso" 
              target="_blank" 
              rel="noopener"
              className="hover:text-primary-400 transition-colors"
            >
              Termos de Uso
            </a>
            <span>•</span>
            <a 
              href="https://rumomaisumarota.com.br/politica-de-privacidade" 
              target="_blank" 
              rel="noopener"
              className="hover:text-primary-400 transition-colors"
            >
              Política de Privacidade
            </a>
          </div>
          <p className="text-gray-500 text-xs">
            © 2025 Rumo Mais Uma Rota. Todos os direitos reservados.
          </p>
        </motion.div>

        {/* Back to Top Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToTop}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowUp className="w-4 h-4" />
            Voltar ao topo
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
