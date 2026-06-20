import { Link } from 'react-router-dom'
import { RUTAS } from '@/constants/rutas.js'

export default function NotFound() {
  return (
    <div className="empty-state" style={{ minHeight: 'calc(100vh - 128px)' }}>
      <span style={{ fontSize: 56 }}>🎭</span>
      <h3 style={{ fontSize: 22 }}>Página no encontrada</h3>
      <p>La dirección que buscas no existe o fue movida.</p>
      <Link to={RUTAS.HOME} className="btn btn-primary">Volver al inicio</Link>
    </div>
  )
}
