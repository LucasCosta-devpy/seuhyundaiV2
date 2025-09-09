import React from 'react'
import Card from '../ui/Card'
import { videos } from '../../assets/index'
import { useAnalytics } from '../../hooks/useAnalytics'

const VideoSection: React.FC = () => {
  const { trackVideoEvent } = useAnalytics()

  const handleVideoPlay = () => {
    trackVideoEvent(videos.explanation, 'play')
  }

  return (
    <Card variant="glass" className="space-y-6">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-center">
        🎥 Entenda a ação
      </h2>
      
      <div className="rounded-xl overflow-hidden bg-slate-800">
        <video
          controls
          preload="none"
          className="w-full h-auto max-h-[70vh] object-contain"
          poster="/img/carro.png"
          onPlay={handleVideoPlay}
        >
          <source src={videos.explanation} type="video/mp4" />
          Seu navegador não suporta vídeo HTML5.
        </video>
      </div>
    </Card>
  )
}

export default VideoSection
