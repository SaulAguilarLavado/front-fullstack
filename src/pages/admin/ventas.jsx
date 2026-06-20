export default function AdminVentas() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Ventas</h1>
          <p>Todas las órdenes del sistema</p>
        </div>
      </div>

      <div className="empty-state">
        <span style={{ fontSize: 40 }}>💳</span>
        <h3>Falta un endpoint en el backend</h3>
        <p>
          El <code>OrderController</code> actual solo expone{' '}
          <code>GET /orders/history</code> (órdenes del usuario autenticado) y{' '}
          <code>GET /orders/{'{id}'}</code> (una orden puntual). No existe un{' '}
          <code>GET /api/orders</code> que liste TODAS las órdenes del sistema
          para el admin. Hay que agregarlo en <code>OrderController</code> +{' '}
          <code>OrderService</code> antes de poder construir esta pantalla.
        </p>
      </div>
    </div>
  )
}
