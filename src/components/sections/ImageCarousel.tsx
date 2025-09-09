import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from '../ui/Card'
import { carImages } from '../../assets/index'

/**
 * Carousel de imagens premium com navegação e autoplay
 */
const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const images = carImages.filter(img => img) // Filter out any undefined images

  useEffect(() => {
    if (!isPlaying || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isPlaying, images.length])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsPlaying(false)
  }

  if (images.length === 0) {
    return (
      <Card variant="glass" className="aspect-video flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">Galeria do Hyundai Creta 2025</p>
          <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-4xl">🚗</span>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card variant="glass" className="relative overflow-hidden p-0">
      {/* Main Image Container */}
      <div className="relative aspect-video bg-slate-800">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Hyundai Creta ${currentIndex + 1}`}
            className="w-full h-full object-contain"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            onError={(e) => {
              console.warn(`Failed to load image: ${images[currentIndex]}`)
              e.currentTarget.src = '/img/carro.png' // Fallback image
            }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors"
              onClick={goToPrevious}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft size={24} />
            </motion.button>

            <motion.button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors"
              onClick={goToNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}

        {/* Play/Pause Button */}
        <motion.button
          className="absolute top-4 right-4 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors"
          onClick={() => setIsPlaying(!isPlaying)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </motion.button>
      </div>

      {/* Dots Navigation */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2 p-4 bg-slate-900/50">
          {images.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-amber-400 shadow-gold' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm border border-white/20">
        {currentIndex + 1} / {images.length}
      </div>
    </Card>
  )
}

export default ImageCarousel
