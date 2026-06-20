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
    const url = error.config?.url
    
    if (status === 401) {
      console.log('🚨 401 Unauthorized en:', url)
      localStorage.removeItem('auth-storage')
      
      // Solo redirige si NO estamos en una petición de datos públicos
      // o de validación inicial. Las peticiones públicas (eventos, etc)
      // pueden fallar con 401 sin que debamos deslogear.
      const isPublicDataFetch = url?.includes('/eventos') || url?.includes('/venues')
      const isInitialValidation = url?.includes('/users/me')
      
      if (!isPublicDataFetch && !isInitialValidation) {
        console.log('↪️ Redirigiendo a login')
        window.location.href = '/login'
      } else {
        console.log('⏭️ No redirigiendo (petición pública o validación)')
      }
    }
    
    // Intenta obtener el mensaje del backend
    let msg = error.message
    try {
      msg = error.response?.data?.message || msg
    } catch (e) {
      if (status === 401) msg = 'Acceso denegado'
      else if (status === 403) msg = 'No tienes permisos para esta acción.'
      else if (status === 404) msg = 'Recurso no encontrado.'
      else if (status >= 500) msg = 'Error del servidor. Intenta más tarde.'
    }
    
    return Promise.reject({ ...error, message: msg })
  }
)

export default http
