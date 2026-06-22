import http from './http.js'

// TicketTypeController real: GET (?eventId=), POST, PUT/:id, DELETE/:id.
const ticketTypeService = {
  getByEvento: (eventId) =>
    http.get('/ticket-types', { params: { eventId } }).then((r) => r.data.data),

  crear: (data) =>
    http.post('/ticket-types', data).then((r) => r.data.data),

  editar: (id, data) =>
    http.put(`/ticket-types/${id}`, data).then((r) => r.data.data),

  eliminar: (id) =>
    http.delete(`/ticket-types/${id}`).then((r) => r.data.data),
}

export default ticketTypeService
