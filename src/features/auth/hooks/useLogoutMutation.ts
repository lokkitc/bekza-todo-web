import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AuthAPI } from '@/shared/api/auth'
import { useAuth } from '../context/AuthContext'

export function useLogoutMutation() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      try {
        await AuthAPI.logout()
      } catch {
        
        
      }
    },
    onSuccess: () => {
      
      queryClient.clear()
      
      logout()
      
      navigate('/login', { replace: true })
    },
    onError: () => {
      
      queryClient.clear()
      logout()
      
      navigate('/login', { replace: true })
    },
  })
}

