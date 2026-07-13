import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import useMetricsUpdates from '@/hooks/use-metrics-updates.js'
import { LIVE_QUERY_OPTS } from '@/constants/query-options.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { formatPrecio } from '@/utils/format-price.js'

const summarizeOrder = (order) => {
  const tickets = order.generatedTickets ?? []
  const events = [...new Set(tickets.map((ticket) => ticket.eventTitle).filter(Boolean))]
  const ticketTypes = [...new Set(tickets.map((ticket) => ticket.ticketTypeName).filter(Boolean))]

  return {
    tickets,
    eventsText: events.length ? events.join(', ') : '—',
    ticketTypesText: ticketTypes.length ? ticketTypes.join(', ') : '—',
  }
}

export default function SalesPage({
  title,
  subtitle,
  queryKey,
  queryFn,
  showPaymentStatus = false,
  ticketTypeHeader = 'Tipo de Entrada',
  emptyIcon = '💳',
  emptyTitle = 'No hay ventas registradas',
  emptyDescription,
}) {
  useMetricsUpdates()
  const [ticketTypeFilter, setTicketTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const { data: orders = [], isLoading } = useQuery({
    queryKey,
    queryFn,
    ...LIVE_QUERY_OPTS,
  })

  const ticketTypes = [...new Set(
    orders.flatMap((order) => (order.generatedTickets ?? []).map((ticket) => ticket.ticketTypeName).filter(Boolean))
  )].sort()

  const eventCategories = [...new Set(
    orders.flatMap((order) => (order.generatedTickets ?? []).map((ticket) => ticket.eventCategoryName).filter(Boolean))
  )].sort()

  const filteredOrders = orders.filter((order) => {
    const tickets = order.generatedTickets ?? []
    const matchesTicketType = !ticketTypeFilter || tickets.some((ticket) => ticket.ticketTypeName === ticketTypeFilter)
    const matchesCategory = !categoryFilter || tickets.some((ticket) => ticket.eventCategoryName === categoryFilter)
    return matchesTicketType && matchesCategory
  })

  const hasFilters = Boolean(ticketTypeFilter || categoryFilter)
  const totalSold = filteredOrders.reduce((sum, order) => sum + Number(order.total ?? 0), 0)
  const totalTickets = filteredOrders.reduce((sum, order) => sum + (order.generatedTickets?.length ?? 0), 0)

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-label">Recaudado</div>
          <div className="stat-card-value">{formatPrecio(totalSold)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Órdenes</div>
          <div className="stat-card-value">{filteredOrders.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Entradas</div>
          <div className="stat-card-value">{totalTickets}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div className="field" style={{ maxWidth: 280, marginBottom: 0 }}>
            <label className="field-label">Filtrar por categoría de evento</label>
            <select className="select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">Todas</option>
              {eventCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ maxWidth: 280, marginBottom: 0 }}>
            <label className="field-label">Filtrar por tipo de entrada</label>
            <select className="select" value={ticketTypeFilter} onChange={(event) => setTicketTypeFilter(event.target.value)}>
              <option value="">Todos</option>
              {ticketTypes.map((ticketType) => (
                <option key={ticketType} value={ticketType}>{ticketType}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando ventas...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>{emptyIcon}</span>
          <h3>{hasFilters ? 'No hay ventas con esos filtros' : emptyTitle}</h3>
          {!hasFilters && emptyDescription && <p>{emptyDescription}</p>}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Orden</th>
                <th>Cliente</th>
                <th>Evento</th>
                <th>{ticketTypeHeader}</th>
                <th>Entradas</th>
                <th>Total</th>
                {showPaymentStatus && <th>Pago</th>}
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const summary = summarizeOrder(order)
                return (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600 }}>{order.id?.slice(0, 8).toUpperCase()}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {order.userFullName || order.userEmail || order.userId}
                    </td>
                    <td>{summary.eventsText}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{summary.ticketTypesText}</td>
                    <td>{summary.tickets.length}</td>
                    <td className="price">{formatPrecio(order.total ?? 0)}</td>
                    {showPaymentStatus && (
                      <td>
                        <span className={order.paymentStatus === 'PAID' ? 'badge badge-success' : 'badge badge-neutral'}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    )}
                    <td style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
                      {formatFecha(order.orderDate)} · {formatHora(order.orderDate)}
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
