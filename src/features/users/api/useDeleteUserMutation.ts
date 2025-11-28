import { useMutation } from '@tanstack/react-query'
import { UsersAPI } from '@/shared/api'
import { useAuth } from '@/features/auth/context/AuthContext'

export function useDeleteUserMutation() {
  const { logout } = useAuth()

  return useMutation({
    mutationFn: () => UsersAPI.deleteMe(),
    onSuccess: () => {
      logout()
    },
  })
}

