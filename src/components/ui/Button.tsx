import React, { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '../../utils/cn'
import type { ButtonVariant, ButtonSize } from '../../types/index'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  shimmer?: boolean
  pulse?: boolean
  children: React.ReactNode
}

const buttonVariants = {
  primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-glow hover:from-blue-600 hover:to-blue-700',
  secondary: 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 shadow-gold hover:from-amber-500 hover:to-amber-600',
  success: 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white shadow-lg hover:from-emerald-500 hover:to-emerald-600',
  premium: 'bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white shadow-premium hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500',
  outline: 'border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white',
}

const buttonSizes = {
  sm: 'px-4 py-2 text-sm min-h-[36px]',
  md: 'px-6 py-3 text-base min-h-[44px]',
  lg: 'px-8 py-4 text-lg min-h-[52px]',
  xl: 'px-10 py-5 text-xl min-h-[60px]',
}

/**
 * Componente Button profissional com animações e variantes
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    isLoading = false,
    shimmer = false,
    pulse = false,
    className,
    children,
    disabled,
    ...props 
  }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center font-semibold rounded-xl',
          'transition-all duration-300 ease-out',
          'focus:outline-none focus:ring-4 focus:ring-blue-500/30',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'overflow-hidden',
          
          // Variants
          buttonVariants[variant],
          
          // Sizes
          buttonSizes[size],
          
          // Conditional classes
          {
            'btn-shimmer': shimmer,
            'pulse-glow': pulse,
          },
          
          className
        )}
        disabled={disabled || isLoading}
        whileHover={{ 
          scale: 1.05,
          y: -2,
        }}
        whileTap={{ 
          scale: 0.98,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
        {...props}
      >
        {/* Shimmer effect */}
        {shimmer && (
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        )}
        
        {/* Loading spinner */}
        {isLoading && (
          <div className="mr-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
