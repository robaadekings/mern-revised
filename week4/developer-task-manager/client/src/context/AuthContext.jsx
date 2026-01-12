import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  // Persist token and validate on startup
  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')

    // If token exists, validate it by pinging a protected endpoint.
    // If invalid, clear it so unauthenticated users are redirected to login.
    let cancelled = false
    const validate = async () => {
      if (!token) return
      try {
        await API.get('/tasks/me')
      } catch (err) {
        if (!cancelled) setToken(null)
      }
    }
    validate()
    return () => { cancelled = true }
  }, [token])

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password })
    setToken(res.data.token)
    return res
  }

  const signup = async (email, password) => {
    const res = await API.post('/auth/signup', { email, password })
    // some servers return token, otherwise you'll need to login after signup
    if (res.data.token) setToken(res.data.token)
    return res
  }

  const logout = () => setToken(null)

  return (
    <AuthContext.Provider value={{ token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

export default AuthContext
