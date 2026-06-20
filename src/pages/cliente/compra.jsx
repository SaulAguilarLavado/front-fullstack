import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import orderService from '@/services/order.service.js'
import useCarritoStore from '@/store/carrito.store.js'
import { METODOS_PAGO } from '@/constants/categorias.js'
import { formatPrecio } from '@/utils/format-price.js'
import { RUTAS } from '@/constants/rutas.js'

export default function Compra() {
  const navigate = useNavigate()
  const { items, total, toOrderRequest, limpiarCarrito } = useCarritoStore()
  const [metodoPago, setMetodoPago] = useState('CARD')

  const checkoutMut = useMutation({
    mutationFn: () => {
      const req = toOrderRequest(metodoPago)
      return orderService.checkout(req.paymentMethod, req.items)
    },
    onSuccess: (orden) => {
      limpiarCarrito()
      navigate(RUTAS.COMPRA_CONFIRMACION, { state: { orden } })
    },
    onError: (e) => toast.error(e.message ?? 'Error al procesar el pago'),
  })

  if (items.length === 0) {
    navigate(RUTAS.EVENTOS, { replace: true })
    return null
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Confirmar compra</h1>
          <p>Revisa tu selección antes de pagar</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, maxWidth: 840 }}>
        {/* Resumen */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Tu selección</h3>
          {items.map((item) => (
            <div
              key={item.ticketTypeId}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 0', borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{item.nombre}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                  {item.cantidad} × {formatPrecio(item.precio)}
                </div>
              </div>
              <span className="price">{formatPrecio(item.precio * item.cantidad)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, fontWeight: 600 }}>
            <span>Total</span>
            <span className="price" style={{ fontSize: 18 }}>{formatPrecio(total)}</span>
          </div>
        </div>

        {/* Método de pago */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Método de pago</h3>
          <div className="field">
            {METODOS_PAGO.map((m) => (
              <label
                key={m.value}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  border: `1px solid ${metodoPago === m.value ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  borderRadius: 'var(--radius)', marginBottom: 8, cursor: 'pointer',
                  background: metodoPago === m.value ? 'var(--color-accent-light)' : '#fff',
                }}
              >
                <input
                  type="radio"
                  name="metodo"
                  value={m.value}
                  checked={metodoPago === m.value}
                  onChange={() => setMetodoPago(m.value)}
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                <span style={{ fontSize: 14 }}>{m.label}</span>
              </label>
            ))}
          </div>

          <button
            className="btn btn-primary btn-block btn-lg"
            disabled={checkoutMut.isPending}
            onClick={() => checkoutMut.mutate()}
          >
            {checkoutMut.isPending ? 'Procesando…' : `Pagar ${formatPrecio(total)}`}
          </button>
          <button
            className="btn btn-ghost btn-block btn-sm"
            style={{ marginTop: 8 }}
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  )
}
