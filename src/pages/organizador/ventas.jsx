import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import orderService from '@/services/order.service.js'
import useMetricsUpdates from '@/hooks/use-metrics-updates.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { formatPrecio } from '@/utils/format-price.js'

const LIVE_OPTS = { staleTime: 0, refetchInterval: 15000, refetchOnWindowFocus: true }

const resumenOrden = (orden) => {
  const tickets = orden.generatedTickets ?? []
  const eventos = [...new Set(tickets.map((t) => t.eventTitle).filter(Boolean))]
  const tiposEntrada = [...new Set(tickets.map((t) => t.ticketTypeName).filter(Boolean))]

  return {
    tickets,
    eventos: eventos.length ? eventos.join(', ') : '—',
    tiposEntrada,
    tiposEntradaTexto: tiposEntrada.length ? tiposEntrada.join(', ') : '—',
  }
}

export default function OrgVentas() {
  useMetricsUpdates()
  const [tipoEntradaFiltro, setTipoEntradaFiltro] = useState('')

  const { data: ordenes = [], isLoading } = useQuery({
    queryKey: ['org-ventas'],
    queryFn: orderService.getVentasOrganizador,
    ...LIVE_OPTS,
  })

  const tiposEntrada = [...new Set(
    ordenes.flatMap((orden) => (orden.generatedTickets ?? []).map((t) => t.ticketTypeName).filter(Boolean))
  )].sort()

  const ordenesFiltradas = tipoEntradaFiltro
    ? ordenes.filter((orden) => (orden.generatedTickets ?? []).some((t) => t.ticketTypeName === tipoEntradaFiltro))
    : ordenes

  const totalVendido = ordenesFiltradas.reduce((sum, orden) => sum + Number(orden.total ?? 0), 0)
  const totalTickets = ordenesFiltradas.reduce((sum, orden) => sum + (orden.generatedTickets?.length ?? 0), 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mis ventas</h1>
          <p>Órdenes asociadas a tus eventos</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-label">Recaudado</div>
          <div className="stat-card-value">{formatPrecio(totalVendido)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Órdenes</div>
          <div className="stat-card-value">{ordenesFiltradas.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Entradas</div>
          <div className="stat-card-value">{totalTickets}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div className="field" style={{ maxWidth: 280, marginBottom: 0 }}>
          <label className="field-label">Filtrar por tipo de entrada</label>
          <select className="select" value={tipoEntradaFiltro} onChange={(e) => setTipoEntradaFiltro(e.target.value)}>
            <option value="">Todos</option>
            {tiposEntrada.map((tipo) => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando ventas...</p>
      ) : ordenesFiltradas.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>📊</span>
          <h3>{tipoEntradaFiltro ? 'No hay ventas con ese tipo de entrada' : 'Aún no tienes ventas'}</h3>
          {!tipoEntradaFiltro && <p>Cuando un cliente compre entradas de tus eventos, aparecerán aquí.</p>}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Evento</th>
                <th>Tipos de entrada</th>
                <th>Entradas</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenesFiltradas.map((orden) => {
                const resumen = resumenOrden(orden)
                return (
                  <tr key={orden.id}>
                    <td style={{ fontWeight: 600 }}>{orden.id?.slice(0, 8).toUpperCase()}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {orden.userFullName || orden.userEmail || orden.userId}
                    </td>
                    <td>{resumen.eventos}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{resumen.tiposEntradaTexto}</td>
                    <td>{resumen.tickets.length}</td>
                    <td className="price">{formatPrecio(orden.total ?? 0)}</td>
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
