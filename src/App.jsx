import { useEffect, useState } from 'react'
import AppRoutes from '@/routes/index.jsx'
import useAuthStore from '@/store/auth.store.js'
import usuariosService from '@/services/usuarios.service.js'
import './App.css'

export default function App() {
  const { token, setAuth, logout } = useAuthStore()
  const [isValidating, setIsValidating] = useState(!!token)

  // Al montar: si hay token en storage, valida que siga siendo correcto
  // pidiendo el perfil propio. No existe GET /api/auth/me en el
  // backend — se usa GET /api/users/me, que identifica al usuario por
  // el JWT del header (no por id en la URL, así cualquier rol puede
  // llamarlo sobre sí mismo sin necesitar permisos de admin).
  useEffect(() => {
    if (!token) {
      console.log('🔓 Sin token en storage, renderizando App directamente')
      setIsValidating(false)
      return
    }

    console.log('🔐 Token encontrado, validando con backend...')
    usuariosService.getMyProfile()
      .then((userResponse) => {
        console.log('✅ Token válido, perfil cargado:', userResponse)
        setAuth(userResponse, token)
        setIsValidating(false)
      })
      .catch((err) => {
        console.log('❌ Token inválido o error en validación:', err?.message)
        logout()
        setIsValidating(false)
      })
  }, []) // solo al montar

  // Mientras se valida el token, espera sin mostrar nada
  if (isValidating) {
    return null
  }

  return <AppRoutes />
}
