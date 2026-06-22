import http from './http.js'

// AuthController real: solo login y register.
const authService = {
  // POST /api/auth/login → LoginRequest { email, password }
  // → ApiResponse<LoginResponse { token, userId, role }>
  login: (data) =>
    http.post('/auth/login', data).then((r) => r.data.data),

  // POST /api/auth/register → RegisterRequest { email, password }
  // → ApiResponse<RegisterResponse { userId, email, role }>
  // El backend SIEMPRE asigna el rol CLIENT internamente
  // (roleRepository.findByName("CLIENT")) — RegisterRequest ya ni
  // siquiera tiene un campo roleId, así que no hay nada que forzar
  // desde el front.
  register: (data) =>
    http.post('/auth/register', data).then((r) => r.data.data),
}

export default authService
