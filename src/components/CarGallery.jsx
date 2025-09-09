import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const CarGallery = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const carImages = [
    '/src/assets/img/car1.jpeg',
    '/src/assets/img/car2.jpeg',
    '/src/assets/img/car3.jpeg',
    '/src/assets/img/car4.jpeg',
    '/src/assets/img/car 5.jpeg',
    '/src/assets/img/car 6.jpeg',
    '/src/assets/img/carro.png'
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % carImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + carImages.length) % carImages.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
            🚗 Galeria do Prêmio
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Conheça o Hyundai Creta Limited Turbo 1.0 que pode ser seu!
          </motion.p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative"
        >
          <div 
            className="relative overflow-hidden rounded-3xl shadow-2xl bg-white"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Main Image */}
            <div className="relative h-80 md:h-96 lg:h-[450px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={carImages[currentIndex]}
                  alt={`Foto do carro ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  onError={(e) => {
                    console.warn(`Erro ao carregar imagem: ${carImages[currentIndex]}`)
                    e.target.style.display = 'none'
                  }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {carImages.length}
              </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 p-6">
              {carImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Car Details */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Modelo 2025</h3>
              <p className="text-gray-600">Hyundai Creta Limited Turbo 1.0 seminovo</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="text-xl font-bold mb-2">Super Equipado</h3>
              <p className="text-gray-600">Único dono, com transferência incluída</p>
            </div>
            
            <div className="card p-6 text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="text-xl font-bold mb-2">Entrega Grátis</h3>
              <p className="text-gray-600">Para qualquer lugar do Brasil</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CarGallery
