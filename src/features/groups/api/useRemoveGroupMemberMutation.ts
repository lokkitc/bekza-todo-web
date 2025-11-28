import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'
import { TASKS_QUERY_KEY } from '@/features/tasks/api/useTasksQuery'

export function useRemoveGroupMemberMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      GroupsAPI.removeMember(groupId, userId),
    onSuccess: (_, variables) => {
      
      queryClient.invalidateQueries({ queryKey: ['groups', variables.groupId] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

