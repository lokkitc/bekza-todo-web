import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'
import type { Group, GroupCreateRequest } from '@/shared/types'

export function useCreateGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: GroupCreateRequest) => GroupsAPI.create(payload),
    onSuccess: (newGroup) => {
      
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      
      queryClient.setQueryData<Group[]>(['groups'], (oldData = []) => {
        return [...oldData, newGroup]
      })
    },
  })
}

