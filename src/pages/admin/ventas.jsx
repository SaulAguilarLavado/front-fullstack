import { useQuery } from '@tanstack/react-query'
import orderService from '@/services/order.service.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { formatPrecio } from '@/utils/format-price.js'

const resumenOrden = (orden) => {
  const tickets = orden.generatedTickets ?? []
  const eventos = [...new Set(tickets.map((t) => t.eventTitle).filter(Boolean))]
  const categorias = [...new Set(tickets.map((t) => t.ticketTypeName).filter(Boolean))]

  return {
    tickets,
    eventos: eventos.length ? eventos.join(', ') : '—',
    categorias: categorias.length ? categorias.join(', ') : '—',
  }
}

export default function AdminVentas() {
  const { data: ordenes = [], isLoading } = useQuery({
    queryKey: ['admin-ventas'],
    queryFn: orderService.getTodas,
  })

  const totalVendido = ordenes.reduce((sum, orden) => sum + Number(orden.total ?? 0), 0)
  const totalTickets = ordenes.reduce((sum, orden) => sum + (orden.generatedTickets?.length ?? 0), 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ventas</h1>
          <p>Todas las órdenes del sistema</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-label">Recaudado</div>
          <div className="stat-card-value">{formatPrecio(totalVendido)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Órdenes</div>
          <div className="stat-card-value">{ordenes.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Entradas</div>
          <div className="stat-card-value">{totalTickets}</div>
        </div>
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando ventas...</p>
      ) : ordenes.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>💳</span>
          <h3>No hay ventas registradas</h3>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Evento</th>
                <th>Categorías</th>
                <th>Entradas</th>
                <th>Total</th>
                <th>Pago</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => {
                const resumen = resumenOrden(orden)
                return (
                  <tr key={orden.id}>
                    <td style={{ fontWeight: 600 }}>{orden.id?.slice(0, 8).toUpperCase()}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {orden.userFullName || orden.userEmail || orden.userId}
                    </td>
                    <td>{resumen.eventos}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{resumen.categorias}</td>
                    <td>{resumen.tickets.length}</td>
                    <td className="price">{formatPrecio(orden.total ?? 0)}</td>
                    <td>
                      <span className={orden.paymentStatus === 'PAID' ? 'badge badge-success' : 'badge badge-neutral'}>
                        {orden.paymentStatus}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {formatFecha(orden.orderDate)} · {formatHora(orden.orderDate)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
