import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '@/shared/api/auth'
import type { LoginRequest, AuthResponse } from '@/shared/types'
import { useAuth } from '../context/AuthContext'

export function useLoginMutation() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (payload: LoginRequest): Promise<AuthResponse> => {
      return AuthAPI.login(payload)
    },
    onSuccess: (data) => {
      
      
      login(data.user, data.token.access_token, data.token.refresh_token)
    },
  })
}

