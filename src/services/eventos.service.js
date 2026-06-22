import http from './http.js'

const eventosService = {
  getEventos: (params = {}) =>
    http.get('/events', { params }).then((r) => r.data.data),

  getEventoById: (id) =>
    http.get(`/events/${id}`).then((r) => r.data.data),
  getMisEventos: (params = {}) =>
    http.get('/events/my', { params }).then((r) => r.data.data),

  crearEvento: (data) =>
    http.post('/events', data).then((r) => r.data.data),

  editarEvento: (id, data) =>
    http.put(`/events/${id}`, data).then((r) => r.data.data),

  eliminarEvento: (id) =>
    http.delete(`/events/${id}`).then((r) => r.data.data),
}

export default eventosService
