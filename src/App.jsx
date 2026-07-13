import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import AppRoutes from '@/routes/index.jsx'
import useAuthStore from '@/store/auth.store.js'
import usuariosService from '@/services/usuarios.service.js'
import './App.css'

export default function App() {
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout = useAuthStore((s) => s.logout)

  const profileQuery = useQuery({
    queryKey: ['auth-profile', token],
    queryFn: usuariosService.getMyProfile,
    enabled: Boolean(token),
    retry: false,
    staleTime: 0,
  })

  useEffect(() => {
    if (token && profileQuery.data) {
      setAuth(profileQuery.data, token)
    }
  }, [token, profileQuery.data, setAuth])

  useEffect(() => {
    if (token && profileQuery.error?.response?.status === 401) {
      logout()
    }
  }, [token, profileQuery.error, logout])

  if (token && profileQuery.isFetching) return null

  return <AppRoutes />
}
