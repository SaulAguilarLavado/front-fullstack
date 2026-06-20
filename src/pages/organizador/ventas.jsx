export default function OrgVentas() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Mis ventas</h1>
          <p>Reporte de ventas por evento</p>
        </div>
      </div>

      <div className="empty-state">
        <span style={{ fontSize: 40 }}>📊</span>
        <h3>Reporte en construcción</h3>
        <p>
          El backend todavía no expone un endpoint de reporte de ventas por
          organizador. Por ahora puedes ver vendidas/disponibles directamente
          en la pantalla de <strong>Categorías</strong> de cada evento.
        </p>
      </div>
    </div>
  )
}
