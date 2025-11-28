import type { AuthContextType } from '@/features/auth/context/AuthContext'

let authContext: AuthContextType | null = null

export function setupAuthInterceptor(auth: AuthContextType) {
  authContext = auth
}

export function getAuthContext(): AuthContextType | null {
  return authContext
}


export function isTokenExpired(token: string | null): boolean {
  if (!token) return true

  try {
    
    const parts = token.split('.')
    if (parts.length !== 3) return true

    
    const payload = JSON.parse(atob(parts[1]))
    const exp = payload.exp

    if (!exp) return false 

    
    const now = Math.floor(Date.now() / 1000)
    return exp < now - 5
  } catch {
    return true
  }
}


export function checkTokenAndLogout(): void {
  const token = localStorage.getItem('access_token')
  if (isTokenExpired(token)) {
    authContext?.logout()
  }
}

