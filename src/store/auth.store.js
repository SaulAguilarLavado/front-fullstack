import { create } from 'zustand'

const AUTH_STORAGE_KEY = 'auth-storage'

function readStoredAuth() {
  if (typeof window === 'undefined') return { user: null, token: null }

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return { user: null, token: null }

    const parsed = JSON.parse(raw)
    return {
      user: parsed?.state?.user ?? null,
      token: parsed?.state?.token ?? null,
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
    return { user: null, token: null }
  }
}

function writeStoredAuth(user, token) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      state: { user, token },
      version: 0,
    })
  )
}

function clearStoredAuth() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

const initialAuth = readStoredAuth()

const useAuthStore = create((set) => ({
  user: initialAuth.user,
  token: initialAuth.token,

  setAuth: (userData, token) => {
    writeStoredAuth(userData, token)
    set({ user: userData, token })
  },

  updateUser: (data) => {
    set((s) => {
      const user = s.user ? { ...s.user, ...data } : null
      writeStoredAuth(user, s.token)
      return { user }
    })
  },

  logout: () => {
    clearStoredAuth()
    set({ user: null, token: null })
  },
}))

export default useAuthStore
