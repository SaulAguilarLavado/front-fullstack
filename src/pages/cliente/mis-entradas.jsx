import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import orderService from '@/services/order.service.js'
import QrCodeTools from '@/components/entradas/qr-code-tools.jsx'

export default function MisEntradas() {
  const qc = useQueryClient()

  const { data: historial = [], isLoading } = useQuery({
    queryKey: ['historial'],
    queryFn: orderService.getHistorial,
  })

  const cancelMut = useMutation({
    mutationFn: (ticketId) => orderService.cancelarTicket(ticketId),
    onSuccess: () => {
      toast.success('Entrada anulada')
      qc.invalidateQueries(['historial'])
    },
    onError: (e) => toast.error(e.message ?? 'No se pudo anular'),
  })

  // Extraer todos los tickets de todas las órdenes. Cada ticket trae
  // status (VALID | CANCELLED) y ticketTypeName directo desde el backend.
  const tickets = historial.flatMap((orden) =>
    (orden.generatedTickets ?? []).map((t) => ({ ...t, orden }))
  )

  if (isLoading) {
    return (
      <div>
        <div className="page-header"><h1>Mis entradas</h1></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ height: 260, background: 'var(--color-bg-secondary)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (tickets.length === 0) {
    return (
      <div>
        <div className="page-header"><h1>Mis entradas</h1></div>
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🎟</span>
          <h3>Aún no tienes entradas</h3>
          <p>Cuando compres, tus entradas aparecerán aquí con su código QR.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Mis entradas</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16 }}>
        {tickets.map((ticket) => {
          const anulado = ticket.status === 'CANCELLED'
          return (
            <div key={ticket.id} className="card" style={{ padding: 20, textAlign: 'center', opacity: anulado ? 0.55 : 1 }}>
              <QrCodeTools
                value={ticket.qrCode}
                filename={`ticketflow-${ticket.id.slice(0, 8)}`}
                label={`QR de entrada ${ticket.id.slice(0, 8).toUpperCase()}`}
                size={130}
              />
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                {ticket.id.slice(0, 8).toUpperCase()}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
                {ticket.ticketTypeName}
              </div>
              {anulado ? (
                <span className="badge badge-danger" style={{ margin: '4px auto' }}>Anulada</span>
              ) : (
                <span className="badge badge-success" style={{ margin: '4px auto' }}>Válida</span>
              )}
              {!anulado && (
                <button
                  className="btn btn-danger btn-sm btn-block"
                  style={{ marginTop: 12 }}
                  disabled={cancelMut.isPending}
                  onClick={() => {
                    if (confirm('¿Anular esta entrada? Solo puedes hacerlo 72h antes del evento.')) {
                      cancelMut.mutate(ticket.id)
                    }
                  }}
                >
                  Anular entrada
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
