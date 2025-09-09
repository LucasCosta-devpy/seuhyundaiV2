// ============================================================================
// ASSETS CONFIGURATION - Gerenciamento centralizado de assets
// ============================================================================

// Imagens do carousel do carro
export const carImages = [
  '/seuhyundaiteste/img/car1.jpeg',
  '/seuhyundaiteste/img/car2.jpeg',
  '/seuhyundaiteste/img/car3.jpeg',
  '/seuhyundaiteste/img/car4.jpeg',
  '/seuhyundaiteste/img/car 5.jpeg',
  '/seuhyundaiteste/img/car 6.jpeg',
  '/seuhyundaiteste/img/carro.png',
]

// Imagens de interface
export const interfaceImages = {
  logo: '/seuhyundaiteste/img/logo.jpg',
  heroBg: '/seuhyundaiteste/img/carro.png',
  instagramIcon: '/seuhyundaiteste/img/icone-do-instagram.png',
  tiktokIcon: '/seuhyundaiteste/img/10464230.png',
  whatsappIcon: '/seuhyundaiteste/img/whatsapp_12635043.png',
  guaranteeSeal: '/seuhyundaiteste/img/Selo_de_Garantia_de_7_Dias_PNG_Transparente_Sem_Fundo.png',
  lotteryBox: '/seuhyundaiteste/img/selo_caixa.png',
}

// Vídeos
export const videos = {
  explanation: '/seuhyundaiteste/videos/dona.mp4',
  testimonial: '/seuhyundaiteste/videos/rifinha-relâmpago-01-Rodrigo.mp4',
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
