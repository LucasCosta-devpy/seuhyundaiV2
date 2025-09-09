import React from 'react'

interface LoadingProps {
  message?: string
}

/**
 * Componente de loading simples e otimizado
 */
const Loading: React.FC<LoadingProps> = ({ message = "Carregando..." }) => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/70">{message}</p>
      </div>
    </div>
  )
}

export default Loading
