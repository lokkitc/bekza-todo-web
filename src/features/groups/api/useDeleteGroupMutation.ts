import { useMutation, useQueryClient } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'
import { TASKS_QUERY_KEY } from '@/features/tasks/api/useTasksQuery'

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: string) => GroupsAPI.delete(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

