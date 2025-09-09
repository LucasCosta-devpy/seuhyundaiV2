import React from 'react'
import Card from '../ui/Card'
import { videos } from '../../assets/index'
import { useAnalytics } from '../../hooks/useAnalytics'

const Testimonials: React.FC = () => {
  const { trackVideoEvent } = useAnalytics()

  const handleVideoPlay = () => {
    trackVideoEvent(videos.testimonial, 'play')
  }

  return (
    <Card variant="glass" className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
          👏 Depoimentos
        </h2>
        <p className="text-white/70 mt-2">Quem participou e ganhou nas ações entre amigos</p>
      </div>
      
      <div className="rounded-xl overflow-hidden bg-slate-800">
        <video
          controls
          preload="none"
          className="w-full h-auto max-h-[70vh] object-contain"
          poster="/img/carro.png"
          onPlay={handleVideoPlay}
        >
          <source src={videos.testimonial} type="video/mp4" />
          Seu navegador não suporta vídeo HTML5.
        </video>
      </div>
    </Card>
  )
}

export default Testimonials
