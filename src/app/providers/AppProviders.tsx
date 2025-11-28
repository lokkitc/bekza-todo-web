import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useRef, type PropsWithChildren } from 'react'
import { AuthProvider, useAuth } from '@/features/auth/context/AuthContext'
import { ThemeProvider } from '@/shared/theme'
import { setupApiClientLogout } from '@/shared/api/httpClient'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      retryOnMount: false,
    },
  },
})

function AuthSetup() {
  const { logout, user } = useAuth()
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    
    setupApiClientLogout(() => {
      logout()
    })
  }, [logout])

  useEffect(() => {
    
    if (user) {
      checkIntervalRef.current = setInterval(() => {
        const token = localStorage.getItem('access_token')
        if (!token || isTokenExpired(token)) {
          logout()
        }
      }, 30000) 
    } else {
      
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
        checkIntervalRef.current = null
      }
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [user, logout])

  return null
}

function isTokenExpired(token: string | null): boolean {
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

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AuthSetup />
          {children}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

