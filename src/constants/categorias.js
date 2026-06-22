
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


export const METODOS_PAGO = [
  { value: 'CARD', label: 'Tarjeta de crédito/débito' },
  { value: 'YAPE', label: 'Yape' },
  { value: 'PLIN', label: 'Plin' },
  { value: 'TRANSFER', label: 'Transferencia bancaria' },
]
