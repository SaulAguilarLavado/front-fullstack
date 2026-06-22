import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import authService from '@/services/auth.service.js'
import usuariosService from '@/services/usuarios.service.js'
import useAuthStore from '@/store/auth.store.js'
import { ROLES } from '@/constants/roles.js'
import { RUTAS } from '@/constants/rutas.js'

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth, logout: clearAuth, user } = useAuthStore()

  // Flujo real de 2 pasos porque LoginResponse solo trae
  // { token, userId, role } — sin nombre ni email.
  const login = async (email, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const { token, userId, role } = await authService.login({ email, password })

      // Paso 1: guarda lo mínimo para que las siguientes llamadas autenticadas
      // ya lleven el token en el header (http.js lo lee del storage).
      setAuth({ id: userId, roleName: role }, token)

      // Paso 2: trae el perfil propio (fullName, email, etc.) usando
      // /users/me — identificado por el JWT, no por id en la URL.
      // getUsuarioById(id) ahora es exclusivo de ADMIN en el backend,
      // así que un cliente recién logueado no podría usarlo sobre sí mismo.
      const userResponse = await usuariosService.getMyProfile()
      setAuth(userResponse, token)

      // redirige según rol, o a la ruta que el usuario intentaba visitar
      const destino = location.state?.from?.pathname
      if (destino) {
        navigate(destino, { replace: true })
      } else if (role === ROLES.ADMIN) {
        navigate(RUTAS.ADMIN_DASHBOARD, { replace: true })
      } else if (role === ROLES.ORGANIZADOR) {
        navigate(RUTAS.ORG_DASHBOARD, { replace: true })
      } else {
        navigate(RUTAS.HOME, { replace: true })
      }

      toast.success('Bienvenido de nuevo')
    } catch (err) {
      const msg = err.message || 'Credenciales inválidas'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // El registro público SIEMPRE crea cuentas de tipo cliente — el
  // backend lo fuerza internamente con roleRepository.findByName("CLIENT")
  // dentro de AuthService.register(). RegisterRequest ya ni siquiera
  // tiene un campo roleId, así que el front no necesita (ni puede)
  // mandar nada relacionado al rol.
  const register = async ({ email, password }) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.register({ email, password })
      toast.success('Cuenta creada. Ahora puedes iniciar sesión.')
      navigate(RUTAS.LOGIN, { replace: true })
    } catch (err) {
      const msg = err.message || 'No se pudo crear la cuenta'
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    clearAuth()
    navigate(RUTAS.LOGIN, { replace: true })
  }

  return { login, register, logout, isLoading, error, user }
}
