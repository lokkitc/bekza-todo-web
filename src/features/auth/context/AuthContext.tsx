import { createContext, useContext, useState, useEffect, type PropsWithChildren } from 'react'
import type { User } from '@/shared/types'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, accessToken: string, refreshToken?: string) => void
  logout: () => void
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Восстанавливаем состояние из localStorage при монтировании
    const storedUser = localStorage.getItem(USER_KEY)
    const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY)

    if (storedUser && storedToken) {
      try {
        // Проверяем, не истек ли токен
        const isExpired = checkTokenExpiration(storedToken)
        if (isExpired) {
          // Токен истек, очищаем все
          localStorage.removeItem(USER_KEY)
          localStorage.removeItem(ACCESS_TOKEN_KEY)
          localStorage.removeItem(REFRESH_TOKEN_KEY)
          setUser(null)
        } else {
          setUser(JSON.parse(storedUser))
        }
      } catch {
        // Если не удалось распарсить, очищаем
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        setUser(null)
      }
    } else {
      // Нет токена или пользователя, очищаем на всякий случай
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      setUser(null)
    }

    setIsLoading(false)
  }, [])

  // Функция проверки истечения токена
  function checkTokenExpiration(token: string): boolean {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return true

      const payload = JSON.parse(atob(parts[1]))
      const exp = payload.exp

      if (!exp) return false // Если нет exp, считаем что токен валиден

      const now = Math.floor(Date.now() / 1000)
      return exp < now - 5 // Запас в 5 секунд
    } catch {
      return true
    }
  }

  const login = (userData: User, accessToken: string, refreshToken?: string) => {
    setUser(userData)
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    // Очищаем все данные из localStorage, связанные с пользователем
    // Очистка React Query кэша будет выполнена через useLogoutMutation
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

