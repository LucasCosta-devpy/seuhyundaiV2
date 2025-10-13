import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const VideoSection = () => {
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
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
          >
            🎥 Entenda a Ação
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Assista ao vídeo e entenda como funciona nossa ação entre amigos
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl max-w-2xl mx-auto">
            <video
              className="w-full h-auto"
              poster="/assets/img/carro.png"
              controls
              preload="metadata"
              playsInline
              webkit-playsinline="true"
              style={{ maxHeight: '400px' }}
            >
              <source src="/assets/videos/dona.mp4" type="video/mp4" />
              Seu navegador não suporta vídeo HTML5.
            </video>
          </div>

          {/* Video Info */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-bold mb-2">Como Funciona</h3>
              <p className="text-gray-600 text-sm">
                Explicação completa do processo de participação
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-bold mb-2">Regras Claras</h3>
              <p className="text-gray-600 text-sm">
                Todas as regras e condições da ação
              </p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-lg font-bold mb-2">100% Transparente</h3>
              <p className="text-gray-600 text-sm">
                Processo totalmente transparente e confiável
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default VideoSection
