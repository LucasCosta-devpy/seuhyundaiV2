import React, { useEffect, useState } from 'react'

const DebugInfo = () => {
  const [errors, setErrors] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Capturar erros JavaScript
    const handleError = (event) => {
      setErrors(prev => [...prev, {
        type: 'JavaScript Error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        timestamp: new Date().toISOString()
      }])
    }

    const handleUnhandledRejection = (event) => {
      setErrors(prev => [...prev, {
        type: 'Unhandled Promise Rejection',
        message: event.reason?.message || event.reason,
        timestamp: new Date().toISOString()
      }])
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Mostrar apenas em desenvolvimento
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-red-500 text-white px-3 py-2 rounded text-sm font-bold"
      >
        Debug ({errors.length})
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-black text-white p-4 rounded max-w-md max-h-96 overflow-auto text-xs">
          <h3 className="font-bold mb-2">Debug Info:</h3>
          {errors.length === 0 ? (
            <p>Nenhum erro encontrado</p>
          ) : (
            errors.map((error, index) => (
              <div key={index} className="mb-2 p-2 bg-red-900 rounded">
                <div className="font-bold">{error.type}</div>
                <div>{error.message}</div>
                {error.filename && <div>File: {error.filename}:{error.lineno}</div>}
                <div className="text-gray-400">{error.timestamp}</div>
              </div>
            ))
          )}
          <button
            onClick={() => setErrors([])}
            className="mt-2 bg-gray-600 px-2 py-1 rounded text-xs"
          >
            Limpar
          </button>
        </div>
      )}
    </div>
  )
}

export default DebugInfo
