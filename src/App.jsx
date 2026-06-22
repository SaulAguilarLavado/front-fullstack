import { useEffect, useState } from 'react'
import AppRoutes from '@/routes/index.jsx'
import useAuthStore from '@/store/auth.store.js'
import usuariosService from '@/services/usuarios.service.js'
import './App.css'

export default function App() {
  const token = useAuthStore((s) => s.token)
  const setAuth = useAuthStore((s) => s.setAuth)
  const logout = useAuthStore((s) => s.logout)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (!token) {
      setIsValidating(false)
      return
    }

    let active = true
    setIsValidating(true)

    usuariosService.getMyProfile()
      .then((userResponse) => {
        if (active) setAuth(userResponse, token)
      })
      .catch((err) => {
        if (active && err?.response?.status === 401) logout()
      })
      .finally(() => {
        if (active) setIsValidating(false)
      })

    return () => {
      active = false
    }
  }, [token, setAuth, logout])

  if (isValidating) return null

  return <AppRoutes />
}
