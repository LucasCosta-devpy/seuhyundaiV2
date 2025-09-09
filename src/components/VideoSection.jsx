import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

const VideoSection = () => {
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
        video_src: '/src/assets/videos/dona.mp4',
        video_title: 'Vídeo Explicativo da Ação'
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', 'VideoStart', { 
        video_src: '/src/assets/videos/dona.mp4',
        video_title: 'Vídeo Explicativo da Ação'
      })
    }
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }


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
          <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto">
            <div className="relative">
              <video
                className="w-full h-auto object-contain"
                poster="/src/assets/img/carro.png"
                controls={isPlaying}
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src="/src/assets/videos/dona.mp4" type="video/mp4" />
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
            </div>
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
