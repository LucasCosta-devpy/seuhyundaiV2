import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Star } from 'lucide-react'

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })


  // Comentários serão adicionados quando houver depoimentos reais
  const testimonials = []

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
    <section id="depoimentos" className="py-20 px-4">
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
            👏 Depoimentos
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Quem participou e ganhou nas ações entre amigos
          </motion.p>
        </motion.div>

        {/* Video Testimonial */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-16"
        >
          <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <video
              className="w-full h-auto"
              poster="/assets/img/carro.png"
              controls
              preload="metadata"
            >
              <source src="/assets/videos/rifinha-relâmpago-01-Rodrigo.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>
            
            {/* Video Title Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
              <p className="text-sm font-semibold">Depoimento Real de Ganhador</p>
            </div>
          </div>
        </motion.div>

        {/* Text Testimonials - Será adicionado quando houver depoimentos reais */}
        {testimonials.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="card p-6 relative"
              >
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Verificado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-primary-200 text-2xl">
                  "
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Trust Indicators */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Mais de 1000 participantes satisfeitos
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa comunidade cresce a cada dia com participantes que confiam em nosso processo transparente
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>100% Transparente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Suporte 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Pagamento Seguro</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
