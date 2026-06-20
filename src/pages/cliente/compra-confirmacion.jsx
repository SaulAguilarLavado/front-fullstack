import { useLocation, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { RUTAS } from '@/constants/rutas.js'
import { formatPrecio } from '@/utils/format-price.js'

export default function CompraConfirmacion() {
  const { state } = useLocation()
  const orden = state?.orden

  if (!orden) {
    return (
      <div className="empty-state">
        <h3>No hay información de la orden</h3>
        <Link to={RUTAS.EVENTOS} className="btn btn-primary">Ver eventos</Link>
      </div>
    )
  }

  // OrderResponse real: { id, total, generatedTickets: [{ id, qrCode,
  // status, ticketTypeName, createdAt }] } — campo "total", no "totalAmount".
  const tickets = orden.generatedTickets ?? []

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '32px 0 24px' }}>
        <span style={{ fontSize: 48 }}>✅</span>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>¡Compra confirmada!</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
          Orden #{orden.id?.slice(0, 8).toUpperCase()} · Total: {formatPrecio(orden.total)}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, maxWidth: 840 }}>
        {tickets.map((ticket) => (
          <div key={ticket.id} className="card" style={{ padding: 20, textAlign: 'center' }}>
            <QRCodeSVG value={ticket.qrCode} size={140} style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', letterSpacing: '0.06em' }}>
              {ticket.id.slice(0, 8).toUpperCase()}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text)', marginTop: 4, fontWeight: 500 }}>
              {ticket.ticketTypeName}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
        <Link to={RUTAS.MIS_ENTRADAS} className="btn btn-primary">Ver mis entradas</Link>
        <Link to={RUTAS.EVENTOS} className="btn btn-secondary">Seguir explorando</Link>
      </div>
    </div>
  )
}
