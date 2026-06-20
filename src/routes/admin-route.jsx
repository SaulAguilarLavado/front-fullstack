import { Navigate, Outlet } from 'react-router-dom'
import { toast } from 'sonner'
import useAuthStore from '@/store/auth.store.js'
import { ROLES } from '@/constants/roles.js'
import { RUTAS } from '@/constants/rutas.js'

export default function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)

  if (!token) return <Navigate to={RUTAS.LOGIN} replace />

  if (user?.roleName !== ROLES.ADMIN) {
    toast.error('Acceso restringido a administradores.')
    return <Navigate to={RUTAS.HOME} replace />
  }

  return <Outlet />
}
