import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { RUTAS } from '@/constants/rutas.js'
import orderService from '@/services/order.service.js'
import QrCodeTools from '@/components/entradas/qr-code-tools.jsx'

export default function EntradaDetalle() {
  const { id } = useParams()
  const { data: ordenes = [], isLoading } = useQuery({
    queryKey: ['historial'],
    queryFn: orderService.getHistorial,
  })
  const ticket = ordenes
    .flatMap((orden) => (orden.generatedTickets ?? []).map((t) => ({ ...t, orden })))
    .find((t) => t.id === id)

  if (isLoading) {
    return (
      <div>
        <div className="page-header">
          <h1>Detalle de entrada</h1>
        </div>
        <div className="card" style={{ maxWidth: 340, height: 320, background: 'var(--color-bg-secondary)' }} />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="empty-state">
        <h3>Entrada no encontrada</h3>
        <Link to={RUTAS.MIS_ENTRADAS} className="btn btn-primary">Volver a mis entradas</Link>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Detalle de entrada</h1>
      </div>
      <div className="card" style={{ maxWidth: 340, padding: 32, textAlign: 'center' }}>
        <QrCodeTools
          value={ticket.qrCode}
          filename={`ticketflow-${ticket.id.slice(0, 8)}`}
          label={`QR de entrada ${ticket.id.slice(0, 8).toUpperCase()}`}
          size={200}
        />
        <div className="eyebrow" style={{ marginBottom: 8 }}>
          {ticket.id?.slice(0, 8).toUpperCase()}
        </div>
        <h3 style={{ fontSize: 16, marginBottom: 8 }}>{ticket.ticketTypeName}</h3>
        <span className={`badge ${ticket.status === 'CANCELLED' ? 'badge-danger' : 'badge-success'}`}>
          {ticket.status === 'CANCELLED' ? 'Anulada' : 'Válida'}
        </span>
        <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
          Muestra este código QR en la entrada del evento.
        </p>
        <Link to={RUTAS.MIS_ENTRADAS} className="btn btn-ghost btn-sm" style={{ marginTop: 20 }}>
          ← Mis entradas
        </Link>
      </div>
    </div>
  )
}
