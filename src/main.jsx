import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

// Filter out extension-related console errors in development
if (import.meta.env.DEV) {
  const originalError = console.error
  console.error = (...args) => {
    const message = args[0]?.toString() || ''
    if (
      message.includes('A listener indicated an asynchronous response') ||
      message.includes('Cuponomia') ||
      message.includes('ext-cdn.cuponomia.com.br')
    ) {
      return // Suppress these extension-related errors
    }
    originalError.apply(console, args)
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
