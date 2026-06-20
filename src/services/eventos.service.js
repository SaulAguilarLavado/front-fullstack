import http from './http.js'

// EventController real: GET (con filtros + paginación), GET/:id, POST,
// PUT/:id, DELETE/:id. EventRequest real: { title, description, dateTime,
// imageUrl, venueId } — un solo dateTime, no startsAt/endsAt.
// EventResponse viene anidado con venue completo, organizerName y minPrice
// ya calculado en el backend.
const eventosService = {
  // params soportados: title, city, minPrice, maxPrice, page, size, sort
  getEventos: (params = {}) =>
    http.get('/events', { params }).then((r) => r.data.data),

  getEventoById: (id) =>
    http.get(`/events/${id}`).then((r) => r.data.data),

  // EventRequest: { title, description, dateTime, imageUrl, venueId }
  // dateTime debe ser ISO string futuro (@Future en el backend).
  crearEvento: (data) =>
    http.post('/events', data).then((r) => r.data.data),

  editarEvento: (id, data) =>
    http.put(`/events/${id}`, data).then((r) => r.data.data),

  // Regla de negocio: el backend bloquea el delete si el evento ya
  // tiene ventas y quien llama no es ADMIN.
  eliminarEvento: (id) =>
    http.delete(`/events/${id}`).then((r) => r.data.data),
}

export default eventosService
