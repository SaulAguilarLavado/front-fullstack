import SalesPage from '@/components/ventas/sales-page.jsx'
import orderService from '@/services/order.service.js'

export default function OrgVentas() {
  return (
    <SalesPage
      title="Mis ventas"
      subtitle="Órdenes asociadas a tus eventos"
      queryKey={['org-ventas']}
      queryFn={orderService.getVentasOrganizador}
      ticketTypeHeader="Tipos de entrada"
      emptyIcon="📊"
      emptyTitle="Aún no tienes ventas"
      emptyDescription="Cuando un cliente compre entradas de tus eventos, aparecerán aquí."
    />
  )
}
