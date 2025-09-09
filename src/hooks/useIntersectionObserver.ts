import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

/**
 * Hook customizado para Intersection Observer
 * Detecta quando elementos entram na viewport para animações
 */
export const useIntersectionObserver = (
  options: UseIntersectionObserverOptions = {}
) => {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px 0px -50px 0px',
    freezeOnceVisible = true
  } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const targetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const node = targetRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        
        setIsIntersecting(isElementIntersecting)
        
        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }

        // Se freezeOnceVisible for true, para de observar após primeira interseção
        if (isElementIntersecting && freezeOnceVisible) {
          observer.unobserve(node)
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, freezeOnceVisible, hasIntersected])

  return {
    targetRef,
    isIntersecting,
    hasIntersected,
    isVisible: freezeOnceVisible ? hasIntersected : isIntersecting,
  }
}
