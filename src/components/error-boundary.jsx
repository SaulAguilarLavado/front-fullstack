import { Component } from 'react'

// Contiene cualquier error de render de React para evitar la pantalla en
// blanco: muestra una pantalla de recuperación en lugar de desmontar toda
// la app.
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] error de render:', error, info)
    // Aquí se podría reportar a un servicio externo (Sentry, etc.).
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="empty-state" style={{ minHeight: '100vh' }}>
          <span style={{ fontSize: 48 }}>⚠️</span>
          <h2 style={{ fontSize: 22 }}>Algo salió mal</h2>
          <p>Ocurrió un error inesperado. Puedes recargar para continuar.</p>
          <button className="btn btn-primary" onClick={this.handleReload}>
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
