import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Erro na aplicação:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-xl font-bold text-navy-900">Algo deu errado.</h1>
            <p className="mt-2 text-gray-600">Recarregue a página. Se o problema continuar, entre em contato.</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
