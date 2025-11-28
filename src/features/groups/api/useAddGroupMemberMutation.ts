import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'
import type { GroupMemberPayload } from '@/shared/types'
import { TASKS_QUERY_KEY } from '@/features/tasks/api/useTasksQuery'

export function useAddGroupMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, payload }: { groupId: string; payload: GroupMemberPayload }) =>
      GroupsAPI.addMember(groupId, payload),
    onSuccess: (_, variables) => {
      
      queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

