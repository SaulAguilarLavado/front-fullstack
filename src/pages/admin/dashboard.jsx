import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import eventosService from '@/services/eventos.service.js'
import usuariosService from '@/services/usuarios.service.js'
import { RUTAS } from '@/constants/rutas.js'

export default function AdminDashboard() {
  const { data: eventosData } = useQuery({
    queryKey: ['admin-eventos-resumen'],
    queryFn: () => eventosService.getEventos({ size: 1 }),
  })

  const { data: usuariosData } = useQuery({
    queryKey: ['admin-usuarios-resumen'],
    queryFn: () => usuariosService.getUsuarios({ size: 1 }),
  })

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Panel de administración</h1>
          <p>Resumen general de TicketFlow</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Eventos totales</div>
          <div className="stat-card-value">{eventosData?.totalElements ?? '—'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Usuarios activos</div>
          <div className="stat-card-value">{usuariosData?.totalElements ?? '—'}</div>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Accesos rápidos</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16 }}>
        <Link to={RUTAS.ADMIN_EVENTOS} className="card card-hoverable" style={{ padding: 20 }}>
          <span style={{ fontSize: 24 }}>🎪</span>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Eventos</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Gestionar todos los eventos</p>
        </Link>
        <Link to={RUTAS.ADMIN_USUARIOS} className="card card-hoverable" style={{ padding: 20 }}>
          <span style={{ fontSize: 24 }}>👥</span>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Usuarios</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Administrar cuentas</p>
        </Link>
        <Link to={RUTAS.ADMIN_VENUES} className="card card-hoverable" style={{ padding: 20 }}>
          <span style={{ fontSize: 24 }}>📍</span>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Venues</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Lugares disponibles</p>
        </Link>
        <Link to={RUTAS.ADMIN_VENTAS} className="card card-hoverable" style={{ padding: 20 }}>
          <span style={{ fontSize: 24 }}>💳</span>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>Ventas</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Todas las órdenes del sistema</p>
        </Link>
      </div>
    </div>
  )
}
