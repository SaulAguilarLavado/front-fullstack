import { useEffect } from 'react'
import AppRoutes from '@/routes/index.jsx'
import useAuthStore from '@/store/auth.store.js'
import usuariosService from '@/services/usuarios.service.js'

export default function App() {
  const { token, setAuth, logout } = useAuthStore()

  // Al montar: si hay token en storage, valida que siga siendo correcto
  // pidiendo el perfil propio. No existe GET /api/auth/me en el
  // backend — se usa GET /api/users/me, que identifica al usuario por
  // el JWT del header (no por id en la URL, así cualquier rol puede
  // llamarlo sobre sí mismo sin necesitar permisos de admin).
  useEffect(() => {
    if (!token) return

    usuariosService.getMyProfile()
      .then((userResponse) => setAuth(userResponse, token))
      .catch(() => logout())
  }, []) // solo al montar

  return <AppRoutes />
}
