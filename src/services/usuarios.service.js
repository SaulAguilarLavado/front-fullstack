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
const usuariosService = {
  getUsuarios: (params = {}) =>
    http.get('/users', { params }).then((r) => r.data.data),

  // Perfil del usuario autenticado — reemplaza al viejo getUsuarioById(id)
  // para el caso de "ver/editar mi propio perfil".
  getMyProfile: () =>
    http.get('/users/me').then((r) => r.data.data),

  // ProfileUpdateRequest: { fullName } — sin roleId. Es la única forma
  // en que un cliente puede editar sus propios datos.
  updateMyProfile: (data) =>
    http.put('/users/me', data).then((r) => r.data.data),

  // Solo ADMIN. Ver perfil de cualquier usuario por id.
  getUsuarioById: (id) =>
    http.get(`/users/${id}`).then((r) => r.data.data),

  // Solo ADMIN. UserRequest: { email, password, fullName, roleId }
  crearUsuario: (data) =>
    http.post('/users', data).then((r) => r.data.data),

  // Solo ADMIN. UserUpdateRequest: { fullName, roleId } — este SÍ
  // permite cambiar el rol, a diferencia de updateMyProfile.
  actualizarUsuario: (id, data) =>
    http.put(`/users/${id}`, data).then((r) => r.data.data),

  // PasswordChangeRequest: { newPassword }
  // NOTA: el backend actual no exige la contraseña actual para
  // confirmar el cambio — vale la pena señalarlo para una futura mejora.
  cambiarPassword: (id, newPassword) =>
    http.patch(`/users/${id}/password`, { newPassword }).then((r) => r.data.data),

  // Solo ADMIN. Regla de negocio: nunca se elimina un usuario, solo se
  // desactiva.
  desactivarUsuario: (id) =>
    http.patch(`/users/${id}/deactivate`).then((r) => r.data.data),
}

export default usuariosService
