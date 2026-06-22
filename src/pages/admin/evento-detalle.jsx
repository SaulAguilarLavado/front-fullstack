import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import eventosService from '@/services/eventos.service.js'
import ticketTypeService from '@/services/ticket-type.service.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { formatPrecio } from '@/utils/format-price.js'
import { ESTADOS_EVENTO } from '@/constants/categorias.js'

export default function AdminEventoDetalle() {
  const { id } = useParams()

  const { data: evento, isLoading } = useQuery({
    queryKey: ['evento', id],
    queryFn: () => eventosService.getEventoById(id),
  })

  const { data: categorias = [] } = useQuery({
    queryKey: ['ticket-types', id],
    queryFn: () => ticketTypeService.getByEvento(Number(id)),
    enabled: !!id,
  })

  if (isLoading) return <p style={{ color: 'var(--color-text-muted)' }}>Cargando…</p>
  if (!evento) return <div className="empty-state"><h3>Evento no encontrado</h3></div>

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{evento.title}</h1>
          <p>
            {formatFecha(evento.dateTime)} · {formatHora(evento.dateTime)} ·{' '}
            <span className={`badge ${evento.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>
              {ESTADOS_EVENTO[evento.status] ?? evento.status}
            </span>
          </p>
        </div>
        <Link to={`/admin/eventos/${id}/editar`} className="btn btn-secondary">Editar evento</Link>
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24, maxWidth: 640 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Información</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 }}>
          {evento.description || 'Sin descripción'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
          <div><strong>Venue:</strong> {evento.venue?.name}</div>
          <div><strong>Ciudad:</strong> {evento.venue?.city}</div>
          <div><strong>Organizador:</strong> {evento.organizerName}</div>
          <div><strong>Aforo:</strong> {evento.venue?.capacity}</div>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Categorías de precio</h3>
      {categorias.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Este evento no tiene categorías configuradas.</p>
      ) : (
        <div className="table-wrap" style={{ maxWidth: 640 }}>
          <table className="data-table">
            <thead>
              <tr><th>Nombre</th><th>Precio</th><th>Vendidas</th><th>Disponibles</th></tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td className="price">{formatPrecio(c.price)}</td>
                  <td>{c.soldQty} / {c.totalQty}</td>
                  <td>{c.totalQty - c.soldQty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
