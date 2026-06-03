import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authService } from '../services/authService'
import { tokenStorage } from '../services/api'

const AuthContext = createContext(null)

const USER_KEY = 'tms.user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [loading, setLoading] = useState(false)

  // Keep the persisted user in sync with state.
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  function persistSession(auth) {
    tokenStorage.set(auth.token)
    setUser({ id: auth.userId, email: auth.email })
  }

  async function login(credentials) {
    setLoading(true)
    try {
      persistSession(await authService.login(credentials))
    } finally {
      setLoading(false)
    }
  }

  async function register(payload) {
    setLoading(true)
    try {
      persistSession(await authService.register(payload))
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    tokenStorage.clear()
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, register, logout }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
