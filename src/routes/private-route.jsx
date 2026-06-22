import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuthStore from '@/store/auth.store.js'
import { RUTAS } from '@/constants/rutas.js'

export default function PrivateRoute() {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()

  if (!token) {
    // guarda la ruta a la que iba para redirigir después del login
    return <Navigate to={RUTAS.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}
