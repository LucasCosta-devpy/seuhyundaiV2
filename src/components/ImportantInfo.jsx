import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Clock, Trophy, MessageCircle, Share2, Phone, CheckCircle, Info } from 'lucide-react'

const ImportantInfo = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

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
    <section id="informacoes" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
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
            ✅ INFORMAÇÕES IMPORTANTES
          </motion.h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8"
        >
          {/* Informações Básicas */}
          <motion.div variants={itemVariants} className="card p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <Info className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">Informações Básicas</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p>Cada cota corresponde a um número único, gerado automaticamente e de forma aleatória pelo sistema (sequência de 00000 a 99999).</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p>Você pode comprar quantos quiser!</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p>A compra é feita direto pelo site, com pagamento via PIX.</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <p>O prazo para confirmação do pagamento é de até 1 hora. Após isso, a reserva será automaticamente cancelada sem aviso prévio.</p>
              </div>
            </div>
          </motion.div>

          {/* Garantia Total */}
          <motion.div variants={itemVariants} className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-2xl font-bold text-gray-800">🔒 GARANTIA TOTAL</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p>Você tem 7 dias para solicitar reembolso caso se arrependa da compra.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p>O valor será estornado e seu número será removido da campanha automaticamente.</p>
              </div>
            </div>
          </motion.div>

          {/* Como Funciona a Escolha */}
          <motion.div variants={itemVariants} className="card p-8 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <h3 className="text-2xl font-bold text-gray-800">🎯 COMO FUNCIONA A ESCOLHA</h3>
            </div>
            <div className="space-y-6 text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Regras da Escolha:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>A escolha será realizada com base na Loteria Federal quando atingirmos 80% das vendas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span>Participam os números de 00000 a 99999.</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Ordem de Apuração:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">1º</span>
                      <span>Última coluna (unidades simples)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">2º</span>
                      <span>Penúltima coluna (dezenas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-semibold">3º</span>
                      <span>Antepenúltima coluna (centenas)</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">📋 Exemplo de Apuração:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold mb-2">Resultados da Loteria Federal:</p>
                    <ul className="space-y-1">
                      <li>1º prêmio: 88.888</li>
                      <li>2º prêmio: 35.981</li>
                      <li>3º prêmio: 97.895</li>
                      <li>4º prêmio: 18.656</li>
                      <li>5º prêmio: 44.444</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Números Escolhidos:</p>
                    <ul className="space-y-1">
                      <li>➡ 1º prêmio: 8/1/5/6/4 = <strong>81564</strong></li>
                      <li>➡ 2º prêmio: 8/8/9/5/4 = <strong>88954</strong></li>
                      <li>➡ 3º prêmio: 8/9/8/6/4 = <strong>89864</strong></li>
                    </ul>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  <strong>Importante:</strong> Se algum número não tiver sido vendido, o prêmio irá para o número imediatamente superior. Se não houver, será considerado o imediatamente inferior, e assim por diante até encontrarmos um ganhador.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Entrega dos Prêmios */}
          <motion.div variants={itemVariants} className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-8 h-8 text-purple-600" />
              <h3 className="text-2xl font-bold text-gray-800">🏆 ENTREGA DOS PRÊMIOS</h3>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <p>Entrega ocorrerá em até 30 dias após a escolha.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <p>O contemplado não terá nenhum custo adicional.</p>
              </div>
            </div>
          </motion.div>

          {/* Contato e Redes Sociais */}
          <motion.div variants={itemVariants} className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-8 h-8 text-pink-600" />
              <h3 className="text-2xl font-bold text-gray-800">📲 ACOMPANHE NOSSAS NOVIDADES</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ Instagram: @rumomaisumarota</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>✅ Grupo do WhatsApp: Entrar no grupo</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500" />
                <span>📞 Dúvidas? WhatsApp: +55 51 98271-0564</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action Final */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              🍀 GARANTA AGORA MESMO SUAS COTAS!
            </h3>
            <p className="text-gray-600 mb-6">
              📤 Compartilhe com seus amigos e nos grupos!
            </p>
            <div className="text-lg font-semibold text-gray-800">
              💬 Compre sua oportunidade. Dirija a conquista.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ImportantInfo
