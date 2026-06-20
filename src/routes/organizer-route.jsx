import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import useAuthStore from '@/store/auth.store.js'
import { ROLES } from '@/constants/roles.js'
import { RUTAS } from '@/constants/rutas.js'

export default function OrganizerRoute() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)

  if (!token) return <Navigate to={RUTAS.LOGIN} replace />

  if (user?.roleName === ROLES.ADMIN) {
    return <Navigate to={RUTAS.ADMIN_DASHBOARD} replace />
  }

  const tieneAcceso = user?.roleName === ROLES.ORGANIZADOR

  if (!tieneAcceso) {
    toast.error('No tienes permisos para acceder a esta sección.')
    return <Navigate to={RUTAS.HOME} replace />
  }

  return <Outlet />
}
