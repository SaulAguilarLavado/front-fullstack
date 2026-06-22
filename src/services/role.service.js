import http from './http.js'

// RoleController real: GET (paginado), GET/:id, POST, PUT/:id, DELETE/:id
const roleService = {
  
  getRoles: (params = {}) =>
    http.get('/roles', { params }).then((r) => r.data.data),

  getRoleById: (id) =>
    http.get(`/roles/${id}`).then((r) => r.data.data),

  crear: (data) =>
    http.post('/roles', data).then((r) => r.data.data),

  editar: (id, data) =>
    http.put(`/roles/${id}`, data).then((r) => r.data.data),

  eliminar: (id) =>
    http.delete(`/roles/${id}`).then((r) => r.data.data),
}

export default roleService
