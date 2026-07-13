import SalesPage from '@/components/ventas/sales-page.jsx'
import orderService from '@/services/order.service.js'

export default function AdminVentas() {
  return (
    <SalesPage
      title="Ventas"
      subtitle="Todas las órdenes del sistema"
      queryKey={['admin-ventas']}
      queryFn={orderService.getTodas}
      showPaymentStatus
      emptyIcon="💳"
      emptyTitle="No hay ventas registradas"
    />
  )
}
