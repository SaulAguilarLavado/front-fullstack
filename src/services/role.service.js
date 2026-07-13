import http from './http.js'

// RoleController real: el frontend solo necesita GET /roles para llenar
// selects de usuarios/organizadores. No se expone administración de roles
// desde la UI.
const roleService = {
  // GET /api/roles → Page<RoleResponse>
  getRoles: (params = {}) =>
    http.get('/roles', { params }).then((r) => r.data.data),
}

export default roleService
