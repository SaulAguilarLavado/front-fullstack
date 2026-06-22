import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ROLES } from '@/constants/roles.js'

// user guarda el UserResponse completo del backend una vez que se hidrata:
// { id, email, fullName, roleId, roleName, isActive, createdAt, updatedAt }
//
// El flujo de login NO entrega esto directo. AuthService.login() solo
// retorna LoginResponse { token, userId, role }. Por eso setAuth() se
// llama dos veces en use-auth.js: primero con los datos mínimos del
// login, luego se reemplaza con el UserResponse completo de
// GET /api/users/me (identificado por el JWT, no por id en la URL).
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      get isAuth() { return !!get().token },
      get rol() { return get().user?.roleName ?? null },
      get isAdmin() { return get().user?.roleName === ROLES.ADMIN },
      get isOrganizador() { return get().user?.roleName === ROLES.ORGANIZADOR },
      get isCliente() { return get().user?.roleName === ROLES.CLIENTE },

      setAuth: (userData, token) => set({ user: userData, token }),

      updateUser: (data) =>
        set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ user: s.user, token: s.token }),
    }
  )
)

export default useAuthStore
