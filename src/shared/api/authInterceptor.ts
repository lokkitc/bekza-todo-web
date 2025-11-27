import { apiClient } from './httpClient'
import type { AuthContextType } from '@/features/auth/context/AuthContext'

let authContext: AuthContextType | null = null

export function setupAuthInterceptor(auth: AuthContextType) {
  authContext = auth
}

export function getAuthContext(): AuthContextType | null {
  return authContext
}

/**
 * Проверяет, истек ли токен по времени
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true

  try {
    // JWT токен состоит из 3 частей, разделенных точками
    const parts = token.split('.')
    if (parts.length !== 3) return true

    // Декодируем payload (вторая часть)
    const payload = JSON.parse(atob(parts[1]))
    const exp = payload.exp

    if (!exp) return false // Если нет exp, считаем что токен валиден

    // Проверяем, истек ли токен (с запасом в 5 секунд)
    const now = Math.floor(Date.now() / 1000)
    return exp < now - 5
  } catch {
    return true
  }
}

/**
 * Проверяет токен и выполняет logout, если он истек
 */
export function checkTokenAndLogout(): void {
  const token = localStorage.getItem('access_token')
  if (isTokenExpired(token)) {
    authContext?.logout()
  }
}


