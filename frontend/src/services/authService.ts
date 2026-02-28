/**
 * Authentication API service
 */
import api from './api'
import { User, UserLogin, UserRegister, AuthToken } from '@/types/user'

export const authService = {
  /**
   * Register a new user
   */
  async register(data: UserRegister): Promise<User> {
    const response = await api.post<User>('/auth/register', data)
    return response.data
  },

  /**
   * Login user and get token
   */
  async login(data: UserLogin): Promise<AuthToken> {
    const response = await api.post<AuthToken>('/auth/login', data)
    return response.data
  },

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  /**
   * Store auth token in localStorage
   */
  storeToken(token: string): void {
    localStorage.setItem('auth_token', token)
  },

  /**
   * Get auth token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token')
  },

  /**
   * Remove auth token from localStorage
   */
  removeToken(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
  },

  /**
   * Store user in localStorage
   */
  storeUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user))
  },

  /**
   * Get user from localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}

export default authService
