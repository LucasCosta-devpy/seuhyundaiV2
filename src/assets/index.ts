// ============================================================================
// ASSETS CONFIGURATION - Gerenciamento centralizado de assets
// ============================================================================

// Imagens do carousel do carro
export const carImages = [
  '/img/car1.jpeg',
  '/img/car2.jpeg',
  '/img/car3.jpeg',
  '/img/car4.jpeg',
  '/img/car 5.jpeg',
  '/img/car 6.jpeg',
  '/img/carro.png',
]

// Imagens de interface
export const interfaceImages = {
  logo: '/img/logo.jpg',
  heroBg: '/img/carro.png',
  instagramIcon: '/img/icone-do-instagram.png',
  tiktokIcon: '/img/10464230.png',
  whatsappIcon: '/img/whatsapp_12635043.png',
  guaranteeSeal: '/img/Selo_de_Garantia_de_7_Dias_PNG_Transparente_Sem_Fundo.png',
  lotteryBox: '/img/selo_caixa.png',
}

// Vídeos
export const videos = {
  explanation: '/videos/dona.mp4',
  testimonial: '/videos/rifinha-relâmpago-01-Rodrigo.mp4',
}

// Configuração de assets por tipo
export const assetConfig = {
  images: {
    formats: ['jpg', 'jpeg', 'png', 'webp'],
    maxSize: '2MB',
    optimized: true,
  },
  videos: {
    formats: ['mp4', 'webm'],
    maxSize: '50MB',
    compression: 'h264',
  },
}

// Helper functions para assets
export const getAssetUrl = (path: string): string => {
  // Em produção, você pode adicionar CDN ou otimizações aqui
  return path
}

export const getOptimizedImageUrl = (path: string, _width?: number, _quality?: number): string => {
  // Implementar otimização de imagem se necessário
  return getAssetUrl(path)
}

export const preloadAssets = (assets: string[]): Promise<void[]> => {
  return Promise.all(
    assets.map(asset => {
      return new Promise<void>((resolve, reject) => {
        if (asset.includes('.mp4')) {
          // Preload video
          const video = document.createElement('video')
          video.onloadeddata = () => resolve()
          video.onerror = reject
          video.src = asset
        } else {
          // Preload image
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = reject
          img.src = asset
        }
      })
    })
  )
}
