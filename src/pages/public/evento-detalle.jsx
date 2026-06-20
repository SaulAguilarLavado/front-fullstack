import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import eventosService from '@/services/eventos.service.js'
import ticketTypeService from '@/services/ticket-type.service.js'
import useAuthStore from '@/store/auth.store.js'
import useCarritoStore from '@/store/carrito.store.js'
import useStockUpdates from '@/hooks/use-stock-updates.js'
import { formatFecha, formatHora } from '@/utils/format-date.js'
import { formatPrecio } from '@/utils/format-price.js'
import { RUTAS, toRuta } from '@/constants/rutas.js'
import { ESTADOS_EVENTO } from '@/constants/categorias.js'
import './evento-detalle.css'

export default function EventoDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { agregarItem, items, limpiarCarrito } = useCarritoStore()

  const [cantidades, setCantidades] = useState({})

  const { data: evento, isLoading: loadingEvento } = useQuery({
    queryKey: ['evento', id],
    queryFn: () => eventosService.getEventoById(id),
  })

  const { data: categorias = [], isLoading: loadingCats } = useQuery({
    queryKey: ['ticket-types', id],
    queryFn: () => ticketTypeService.getByEvento(Number(id)),
    enabled: !!id,
  })

  // WebSocket: actualiza disponibilidad en tiempo real cuando alguien compra
  const ticketTypeIds = categorias.map((c) => c.id)
  const stockLive = useStockUpdates(ticketTypeIds)

  const disponible = (cat) => {
    const liveStock = stockLive[cat.id]
    return liveStock !== undefined ? liveStock : (cat.totalQty - cat.soldQty)
  }

  const setCantidad = (catId, val) => {
    const cat = categorias.find((c) => c.id === catId)
    const max = disponible(cat)
    setCantidades((prev) => ({ ...prev, [catId]: Math.max(0, Math.min(val, max)) }))
  }

  const totalSeleccionado = categorias.reduce((sum, cat) => {
    return sum + (cantidades[cat.id] ?? 0) * cat.price
  }, 0)

  const haySeleccion = Object.values(cantidades).some((v) => v > 0)

  const handleComprar = () => {
    if (!token) {
      toast.error('Debes iniciar sesión para comprar entradas')
      navigate(RUTAS.LOGIN, { state: { from: { pathname: `/eventos/${id}` } } })
      return
    }

    limpiarCarrito()
    categorias.forEach((cat) => {
      const qty = cantidades[cat.id] ?? 0
      if (qty > 0) {
        agregarItem({
          ticketTypeId: cat.id,
          nombre: cat.name,
          precio: cat.price,
          cantidad: qty,
          eventoId: Number(id),
          eventoNombre: evento?.title,
        })
      }
    })
    navigate(toRuta(RUTAS.COMPRA, { eventoId: id }))
  }

  if (loadingEvento) {
    return (
      <div className="container detalle-page">
        <div style={{ height: 320, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)' }} />
      </div>
    )
  }

  if (!evento) {
    return (
      <div className="container detalle-page">
        <div className="empty-state">
          <span style={{ fontSize: 40 }}>🔍</span>
          <h3>Evento no encontrado</h3>
          <Link to={RUTAS.EVENTOS} className="btn btn-secondary">Ver todos los eventos</Link>
        </div>
      </div>
    )
  }

  const cancelado = evento.status === 'CANCELLED'

  return (
    <div className="container detalle-page">
      <button className="detalle-back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detalle-layout">
        {/* Columna izquierda: info */}
        <div>
          {evento.imageUrl ? (
            <img src={evento.imageUrl} alt={evento.title} className="detalle-img" />
          ) : (
            <div className="detalle-img-placeholder">🎭</div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            {evento.status && (
              <span className={`badge ${cancelado ? 'badge-danger' : evento.status === 'CONCLUDED' ? 'badge-neutral' : 'badge-success'}`}>
                {ESTADOS_EVENTO[evento.status] ?? evento.status}
              </span>
            )}
          </div>

          <h1 className="detalle-titulo">{evento.title}</h1>

          <div className="detalle-meta">
            <div className="detalle-meta-item">
              <span className="detalle-meta-icon">📅</span>
              <span>{formatFecha(evento.dateTime)} · {formatHora(evento.dateTime)}</span>
            </div>
            {evento.venue && (
              <div className="detalle-meta-item">
                <span className="detalle-meta-icon">📍</span>
                <span>
                  {evento.venue.name}
                  {evento.venue.city ? `, ${evento.venue.city}` : ''}
                </span>
              </div>
            )}
            {evento.organizerName && (
              <div className="detalle-meta-item">
                <span className="detalle-meta-icon">🏢</span>
                <span>Organizado por {evento.organizerName}</span>
              </div>
            )}
          </div>

          {evento.description && (
            <p className="detalle-desc">{evento.description}</p>
          )}
        </div>

        {/* Panel de compra */}
        <aside>
          <div className="ticket-panel">
            <div className="ticket-panel-header">
              <h3>Selecciona tus entradas</h3>
              <p>{formatFecha(evento.dateTime)}</p>
            </div>

            <div className="ticket-panel-body">
              {loadingCats ? (
                <p className="text-muted" style={{ fontSize: 14, padding: '8px 0' }}>Cargando categorías...</p>
              ) : categorias.length === 0 ? (
                <p className="text-muted" style={{ fontSize: 14, padding: '8px 0' }}>No hay categorías disponibles.</p>
              ) : (
                categorias.map((cat) => {
                  const disp = disponible(cat)
                  const agotado = disp <= 0 || cancelado
                  const qty = cantidades[cat.id] ?? 0
                  return (
                    <div key={cat.id} className={`categoria-row ${agotado ? 'agotado' : ''}`}>
                      <div className="categoria-info">
                        <h4>{cat.name}</h4>
                        <div className="categoria-stock">
                          {agotado ? (
                            <span className="stock-badge">Agotado</span>
                          ) : disp <= 10 ? (
                            <span className="stock-badge">¡Solo quedan {disp}!</span>
                          ) : (
                            <span>{disp} disponibles</span>
                          )}
                        </div>
                      </div>
                      <span className="categoria-precio">{formatPrecio(cat.price)}</span>
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          disabled={qty === 0}
                          onClick={() => setCantidad(cat.id, qty - 1)}
                        >−</button>
                        <span className="qty-value">{qty}</span>
                        <button
                          className="qty-btn"
                          disabled={agotado || qty >= disp}
                          onClick={() => setCantidad(cat.id, qty + 1)}
                        >+</button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="ticket-panel-footer">
              <div className="ticket-panel-total">
                <span className="ticket-panel-total-label">Total estimado</span>
                <span className="ticket-panel-total-amount">{formatPrecio(totalSeleccionado)}</span>
              </div>
              <button
                className="btn btn-primary btn-block btn-lg"
                disabled={!haySeleccion || cancelado}
                onClick={handleComprar}
              >
                {cancelado ? 'Evento cancelado' : 'Comprar entradas'}
              </button>
              {!token && (
                <p style={{ fontSize: 12, color: 'var(--color-text-faint)', marginTop: 10, textAlign: 'center' }}>
                  Necesitas <Link to={RUTAS.LOGIN} style={{ color: 'var(--color-accent)' }}>iniciar sesión</Link> para comprar.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
