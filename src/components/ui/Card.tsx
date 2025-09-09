import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useIntersectionObserver } from '@hooks/useIntersectionObserver'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'premium' | 'gradient'
  hover?: boolean
  animate?: boolean
  delay?: number
}

const cardVariants = {
  default: 'bg-white/10 backdrop-blur-md border border-white/20',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  premium: 'bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-lg border border-white/30',
  gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-md border border-blue-500/20',
}

/**
 * Componente Card com glass morphism e animações
 */
const Card: React.FC<CardProps> = ({ 
  children, 
  className,
  variant = 'default',
  hover = true,
  animate = true,
  delay = 0
}) => {
  const { targetRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  })

  const cardAnimation = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const hoverAnimation = hover ? {
    whileHover: { 
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  } : {}

  return (
    <motion.div
      ref={targetRef}
      className={cn(
        // Base styles
        'relative rounded-2xl p-6 shadow-2xl',
        'transition-all duration-300 ease-out',
        
        // Variants
        cardVariants[variant],
        
        // Hover effect class
        hover && 'card-hover',
        
        className
      )}
      initial={animate ? "hidden" : false}
      animate={animate && isVisible ? "visible" : false}
      variants={animate ? cardAnimation : undefined}
      {...hoverAnimation}
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  )
}

export default Card
