import http from './http.js'

// RoleController real: GET (paginado), GET/:id, POST, PUT/:id, DELETE/:id
const roleService = {
  // GET /api/roles → Page<RoleResponse>
  getRoles: (params = {}) =>
    http.get('/roles', { params }).then((r) => r.data.data),

  // GET /api/roles/:id → RoleResponse
  getRoleById: (id) =>
    http.get(`/roles/${id}`).then((r) => r.data.data),

  // POST /api/roles → RoleRequest { name }
  crear: (data) =>
    http.post('/roles', data).then((r) => r.data.data),

  // PUT /api/roles/:id → RoleRequest { name }
  editar: (id, data) =>
    http.put(`/roles/${id}`, data).then((r) => r.data.data),

  // DELETE /api/roles/:id
  // ⚠️ El backend borra el rol sin verificar si hay usuarios asignados.
  // El front debe mostrar una advertencia fuerte antes de confirmar esta
  // acción, y lo ideal es deshabilitar el botón si el rol tiene usuarios.
  eliminar: (id) =>
    http.delete(`/roles/${id}`).then((r) => r.data.data),
}

export default roleService
