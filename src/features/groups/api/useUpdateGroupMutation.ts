import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'
import type { GroupUpdateRequest } from '@/shared/types'

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: GroupUpdateRequest }) =>
      GroupsAPI.update(groupId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

