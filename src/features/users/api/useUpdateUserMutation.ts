import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UsersAPI } from '@/shared/api'
import type { UserUpdateRequest } from '@/shared/types'
import { useAuth } from '@/features/auth/context/AuthContext'

export function useUpdateUserMutation() {
  const queryClient = useQueryClient()
  const { updateUser } = useAuth()

  return useMutation({
    mutationFn: (payload: UserUpdateRequest) => UsersAPI.updateMe(payload),
    onSuccess: (data) => {
      // Обновляем пользователя в AuthContext и localStorage
      updateUser(data)
      // Инвалидируем кэш React Query
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })
}

