import http from './http.js'

// CategoryController real: GET (lista pública), GET/:id, POST, PUT/:id,
// DELETE/:id. Escritura solo ADMIN. CategoryRequest: { name, description }.
const categoryService = {
  // GET /api/categories → [{ id, name, description, createdAt }]
  getAll: () =>
    http.get('/categories').then((r) => r.data.data),

  getById: (id) =>
    http.get(`/categories/${id}`).then((r) => r.data.data),

  crear: (data) =>
    http.post('/categories', data).then((r) => r.data.data),

  editar: (id, data) =>
    http.put(`/categories/${id}`, data).then((r) => r.data.data),

  // El backend rechaza (409) si la categoría tiene eventos asociados.
  eliminar: (id) =>
    http.delete(`/categories/${id}`).then((r) => r.data.data),
}

export default categoryService
