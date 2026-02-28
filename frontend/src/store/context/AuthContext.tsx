/**
 * Authentication Context Provider
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '@/types/user'
import authService from '@/services/authService'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    const initAuth = async () => {
      const storedToken = authService.getToken()
      const storedUser = authService.getStoredUser()

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
        
        // Verify token is still valid
        try {
          const currentUser = await authService.getCurrentUser()
          setUser(currentUser)
          authService.storeUser(currentUser)
        } catch (error) {
          // Token invalid, clear auth
          authService.removeToken()
          setToken(null)
          setUser(null)
        }
      }
      
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const authToken = await authService.login({ username, password })
      authService.storeToken(authToken.access_token)
      setToken(authToken.access_token)

      const currentUser = await authService.getCurrentUser()
      authService.storeUser(currentUser)
      setUser(currentUser)
    } catch (error) {
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      await authService.register({ username, email, password })
      // After registration, log in
      await login(username, password)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.removeToken()
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
