import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play, Pause, Volume2, VolumeX, Star } from 'lucide-react'

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'video_start', { 
        video_src: '/src/assets/videos/rifinha-relâmpago-01-Rodrigo.mp4',
        video_title: 'Depoimento de Ganhador'
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'VideoStart', { 
        video_src: '/src/assets/videos/rifinha-relâmpago-01-Rodrigo.mp4',
        video_title: 'Depoimento de Ganhador'
      })
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }


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
            <div className="relative">
              <video
                className="w-full h-auto object-contain"
                poster="/src/assets/img/carro.png"
                controls={isPlaying}
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/src/assets/videos/rifinha-relâmpago-01-Rodrigo.mp4" type="video/mp4" />
                Seu navegador não suporta vídeo HTML5.
              </video>

              {/* Custom Play Button Overlay */}
              {!isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePlayPause}
                    className="bg-white/90 hover:bg-white text-gray-800 p-6 rounded-full shadow-2xl transition-all duration-300"
                  >
                    <Play className="w-12 h-12 ml-1" />
                  </motion.button>
                </motion.div>
              )}

              {/* Custom Controls */}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 right-4 flex gap-2"
                >
                  <button
                    onClick={handleMuteToggle}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                </motion.div>
              )}

              {/* Video Title Overlay */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold">Depoimento Real de Ganhador</p>
              </div>
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
