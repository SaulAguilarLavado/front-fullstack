import { useQuery } from '@tanstack/react-query'
import orderService from '@/services/order.service.js'
import { formatPrecio } from '@/utils/format-price.js'
import { ESTADOS_PAGO } from '@/constants/categorias.js'

export default function Historial() {
  const { data: ordenes = [], isLoading } = useQuery({
    queryKey: ['historial'],
    queryFn: orderService.getHistorial,
  })

  return (
    <div>
      <div className="page-header">
        <h1>Historial de compras</h1>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Cargando…</div>
      ) : ordenes.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>📋</span>
          <h3>Sin compras aún</h3>
          <p>Aquí verás el historial de todas tus órdenes.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Entradas</th>
                <th>Total</th>
                <th>Método de pago</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 13 }}>
                    #{o.id?.slice(0, 8).toUpperCase()}
                  </td>
                  <td>{(o.generatedTickets ?? []).length} entrada(s)</td>
                  <td className="price">{formatPrecio(o.total)}</td>
                  <td style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{o.paymentMethod}</td>
                  <td>
                    <span className={`badge ${o.paymentStatus === 'PAID' ? 'badge-success' : o.paymentStatus === 'FAILED' || o.paymentStatus === 'CANCELLED' ? 'badge-danger' : 'badge-neutral'}`}>
                      {ESTADOS_PAGO[o.paymentStatus] ?? o.paymentStatus}
                    </span>
                  </td>
                  <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                    {o.orderDate ? new Date(o.orderDate).toLocaleDateString('es-PE') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
