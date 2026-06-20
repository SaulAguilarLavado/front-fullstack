import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage')
  if (raw) {
    try {
      const { state } = JSON.parse(raw)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    } catch { /* storage corrupto */ }
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    const msg =
      error.response?.data?.message ||
      (status === 403 ? 'No tienes permisos para esta acción.' :
       status === 404 ? 'Recurso no encontrado.' :
       status >= 500 ? 'Error del servidor. Intenta más tarde.' :
       error.message)
    return Promise.reject({ ...error, message: msg })
  }
)

export default http
