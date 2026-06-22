import http from './http.js'

const orderService = {
  checkout: (paymentMethod, items) =>
    http.post('/orders/checkout', { paymentMethod, items }).then((r) => r.data.data),

  getTodas: () =>
    http.get('/orders').then((r) => r.data.data),

  getVentasOrganizador: () =>
    http.get('/orders/organizer-sales').then((r) => r.data.data),

  getHistorial: () =>
    http.get('/orders/history').then((r) => r.data.data),

  getOrdenById: (id) =>
    http.get(`/orders/${id}`).then((r) => r.data.data),

  cancelarTicket: (ticketId) =>
    http.patch(`/orders/tickets/${ticketId}/cancel`).then((r) => r.data.data),
}

export default orderService
