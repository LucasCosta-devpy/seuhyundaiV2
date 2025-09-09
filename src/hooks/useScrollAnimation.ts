import { useCallback } from 'react'

/**
 * Hook simplificado para animações de scroll
 */
export const useScrollAnimation = () => {
  const animateOnScroll = useCallback((element: Element) => {
    // Implementar animação de scroll aqui se necessário
    console.log('Animating element:', element)
  }, [])

  return {
    animateOnScroll,
  }
}