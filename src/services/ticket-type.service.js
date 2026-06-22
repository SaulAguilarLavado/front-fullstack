import http from './http.js'

// TicketTypeController real: GET (?eventId=), POST, PUT/:id, DELETE/:id.
// TicketTypeRequest: { eventId, name, price, totalQty }. soldQty lo
// calcula el backend, nunca se manda desde el front.
const ticketTypeService = {
  getByEvento: (eventId) =>
    http.get('/ticket-types', { params: { eventId } }).then((r) => r.data.data),

  // Solo ORGANIZER (dueño del evento) o ADMIN.
  crear: (data) =>
    http.post('/ticket-types', data).then((r) => r.data.data),

  // Regla de negocio: el backend rechaza si totalQty < soldQty actual.
  editar: (id, data) =>
    http.put(`/ticket-types/${id}`, data).then((r) => r.data.data),

  // Regla de negocio: el backend rechaza si ya hay ventas (soldQty > 0).
  eliminar: (id) =>
    http.delete(`/ticket-types/${id}`).then((r) => r.data.data),
}

export default ticketTypeService
