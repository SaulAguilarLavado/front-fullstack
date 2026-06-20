import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import eventosService from '@/services/eventos.service.js'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'
import { formatPrecio } from '@/utils/format-price.js'
import { formatFecha } from '@/utils/format-date.js'

export default function OrgDashboard() {
  const { user } = useAuthStore()

  const { data } = useQuery({
    queryKey: ['org-eventos'],
    queryFn: () => eventosService.getEventos({ size: 5, sort: 'dateTime,asc' }),
  })

  const eventos = data?.content ?? []
  const total = data?.totalElements ?? 0

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Bienvenido{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}</h1>
          <p>Panel de organizador · TicketFlow</p>
        </div>
        <Link to={RUTAS.ORG_EVENTO_NUEVO} className="btn btn-primary">+ Nuevo evento</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Mis eventos</div>
          <div className="stat-card-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Activos</div>
          <div className="stat-card-value">{eventos.filter((e) => e.status === 'ACTIVE').length}</div>
        </div>
      </div>

      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Próximos eventos</h2>
      {eventos.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 36 }}>🎪</span>
          <h3>Aún no tienes eventos</h3>
          <Link to={RUTAS.ORG_EVENTO_NUEVO} className="btn btn-primary">Crear mi primer evento</Link>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Evento</th><th>Fecha</th><th>Venue</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {eventos.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{e.title}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{formatFecha(e.dateTime)}</td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{e.venue?.name}</td>
                  <td><span className={`badge ${e.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>{e.status}</span></td>
                  <td><Link to={`/organizador/eventos/${e.id}/editar`} className="btn btn-ghost btn-sm">Editar</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
