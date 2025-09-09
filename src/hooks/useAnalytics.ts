import { useCallback } from 'react'

/**
 * Hook simplificado para analytics
 */
export const useAnalytics = () => {
  const trackCTAClick = useCallback((buttonId: string, context?: string) => {
    console.log('CTA Click:', { buttonId, context })
    // Implementar analytics aqui se necessário
  }, [])

  const trackVideoEvent = useCallback((action: string, videoId?: string) => {
    console.log('Video Event:', { action, videoId })
    // Implementar analytics aqui se necessário
  }, [])

  const trackPurchaseIntent = useCallback((comboId: string, value?: number) => {
    console.log('Purchase Intent:', { comboId, value })
    // Implementar analytics aqui se necessário
  }, [])

  const trackSocialClick = useCallback((platform: string, context?: string) => {
    console.log('Social Click:', { platform, context })
    // Implementar analytics aqui se necessário
  }, [])

  return {
    trackCTAClick,
    trackVideoEvent,
    trackPurchaseIntent,
    trackSocialClick,
  }
}