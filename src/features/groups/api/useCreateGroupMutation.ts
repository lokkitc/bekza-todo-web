import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'
import type { Group, GroupCreateRequest } from '@/shared/types'

export function useCreateGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GroupCreateRequest) => GroupsAPI.create(payload),
    onSuccess: (newGroup) => {
      // Инвалидируем кеш и обновляем список
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      // Оптимистично добавляем новую группу в кеш
      queryClient.setQueryData<Group[]>(['groups'], (oldData = []) => {
        return [...oldData, newGroup]
      })
    },
  })
}

