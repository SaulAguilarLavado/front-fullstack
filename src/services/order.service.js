import http from './http.js'

// OrderController real: POST /orders/checkout, GET /orders/history,
// GET /orders/:id, PATCH /orders/tickets/:ticketId/cancel.
//
// OrderResponse real (OrderServiceImpl.mapToOrderResponse):
// { id, userId, total, paymentStatus, paymentMethod, orderDate,
//   generatedTickets: [{ id, qrCode, status, ticketTypeName, createdAt }] }
//
// OJO: el campo es "total", no "totalAmount". Y cada ticket trae
// "status" (string del enum TicketStatus: VALID | CANCELLED), no un
// booleano "isVoid".
const orderService = {
  checkout: (paymentMethod, items) =>
    http.post('/orders/checkout', { paymentMethod, items }).then((r) => r.data.data),

  // ADMIN: todas las órdenes del sistema.
  getTodas: () =>
    http.get('/orders').then((r) => r.data.data),

  // ORGANIZER: órdenes relacionadas a eventos del organizador autenticado.
  getVentasOrganizador: () =>
    http.get('/orders/organizer-sales').then((r) => r.data.data),

  // Lista plana de OrderResponse, ordenada por fecha de pago descendente.
  getHistorial: () =>
    http.get('/orders/history').then((r) => r.data.data),

  getOrdenById: (id) =>
    http.get(`/orders/${id}`).then((r) => r.data.data),

  // Regla de negocio: solo cancela si faltan 72h+ para el evento, y solo
  // si el ticket está en estado VALID. El backend lanza
  // BusinessRuleException si no se cumple cualquiera de las dos.
  cancelarTicket: (ticketId) =>
    http.patch(`/orders/tickets/${ticketId}/cancel`).then((r) => r.data.data),
}

export default orderService
