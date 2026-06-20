// ⚠️ TIPOS_EVENTO no tiene respaldo en el backend todavía. Event.java
// solo tiene title/description/dateTime/imageUrl/status — no existe un
// campo "tipo de evento" (concierto/teatro/etc.) en el modelo real.
// Si se necesita para filtrar el catálogo, hay que agregarlo a la
// entidad Event y a EventRequest/EventResponse en el backend primero.
// Se deja comentado para no mostrar un filtro que no funciona:
//
// export const TIPOS_EVENTO = [
//   { value: 'CONCERT', label: 'Concierto' },
//   { value: 'THEATER', label: 'Teatro' },
//   { value: 'STAND_UP', label: 'Unipersonal' },
// ]

// Event.status real: "ACTIVE" | "CONCLUDED" | "CANCELLED" (String simple,
// no enum Java — así que cualquier valor pasa la validación del backend,
// hay que ser consistentes desde el front).
export const ESTADOS_EVENTO = {
  ACTIVE: 'Activo',
  CONCLUDED: 'Finalizado',
  CANCELLED: 'Cancelado',
}

// TicketStatus real (enums/TicketStatus.java)
export const ESTADOS_TICKET = {
  VALID: 'Válida',
  USED: 'Usada',
  CANCELLED: 'Cancelada',
}

// PaymentStatus real (order/enums/PaymentStatus.java). OJO: el flujo de
// compra actual (OrderServiceImpl.createOrder) SIEMPRE crea la orden con
// PaymentStatus.PAID directo — no hay un estado intermedio PENDING en
// la práctica todavía, aunque el enum lo contemple.
export const ESTADOS_PAGO = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  FAILED: 'Fallido',
  CANCELLED: 'Cancelado',
}

export const ESTADOS_USUARIO = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
}

// OrderRequest.paymentMethod es un String libre en el backend (no enum) —
// estos valores son una convención del front, hay que mantenerlos
// consistentes con lo que se muestre en los reportes de admin.
export const METODOS_PAGO = [
  { value: 'CARD', label: 'Tarjeta de crédito/débito' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'TRANSFER', label: 'Transferencia bancaria' },
]
