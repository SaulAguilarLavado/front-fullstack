import http from './http.js'

const authService = {
  login: (data) =>
    http.post('/auth/login', data).then((r) => r.data.data),
  register: (data) =>
    http.post('/auth/register', data).then((r) => r.data.data),
}

export default authService
