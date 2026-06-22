import http from './http.js'

// VenueController real: GET, GET/:id, POST, PUT/:id, DELETE/:id.
const venueService = {
  getVenues: (params = {}) =>
    http.get('/venues', { params }).then((r) => r.data.data),

  getVenueById: (id) =>
    http.get(`/venues/${id}`).then((r) => r.data.data),

  crear: (data) =>
    http.post('/venues', data).then((r) => r.data.data),

  editar: (id, data) =>
    http.put(`/venues/${id}`, data).then((r) => r.data.data),

  eliminar: (id) =>
    http.delete(`/venues/${id}`).then((r) => r.data.data),
}

export default venueService
