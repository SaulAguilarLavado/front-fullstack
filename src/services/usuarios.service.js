import http from './http.js'

// UserController real:
//   GET    /users          (solo ADMIN, paginado)
//   GET    /users/me       (perfil propio, identificado por JWT)
//   PUT    /users/me       (editar perfil propio — ProfileUpdateRequest, sin roleId)
//   GET    /users/:id      (solo ADMIN)
//   POST   /users          (solo ADMIN, crea con roleId)
//   PUT    /users/:id      (solo ADMIN, UserUpdateRequest CON roleId)
//   PATCH  /users/:id/password
//   PATCH  /users/:id/deactivate (solo ADMIN)
//   PATCH  /users/:id/activate (solo ADMIN)
const usuariosService = {
  getUsuarios: (params = {}) =>
    http.get('/users', { params }).then((r) => r.data.data),

  getMyProfile: () =>
    http.get('/users/me').then((r) => r.data.data),

  updateMyProfile: (data) =>
    http.put('/users/me', data).then((r) => r.data.data),

  getUsuarioById: (id) =>
    http.get(`/users/${id}`).then((r) => r.data.data),

  crearUsuario: (data) =>
    http.post('/users', data).then((r) => r.data.data),

  actualizarUsuario: (id, data) =>
    http.put(`/users/${id}`, data).then((r) => r.data.data),

  cambiarPassword: (id, newPassword) =>
    http.patch(`/users/${id}/password`, { newPassword }).then((r) => r.data.data),

  desactivarUsuario: (id) =>
    http.patch(`/users/${id}/deactivate`).then((r) => r.data.data),

  activarUsuario: (id) =>
    http.patch(`/users/${id}/activate`).then((r) => r.data.data),
}

export default usuariosService
