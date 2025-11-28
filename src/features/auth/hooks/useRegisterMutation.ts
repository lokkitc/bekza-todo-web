import { useMutation } from '@tanstack/react-query'
import { AuthAPI } from '@/shared/api'
import { useAuth } from '../context/AuthContext'
import type { RegisterRequest } from '@/shared/types'

export function useRegisterMutation() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const response = await AuthAPI.register(payload)
      login(response.user, response.token.access_token, response.token.refresh_token)
      return response
    },
  })
}

