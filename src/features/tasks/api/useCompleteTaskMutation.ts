import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TasksAPI } from '@/shared/api'
import { TASKS_QUERY_KEY } from './useTasksQuery'

export function useCompleteTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => TasksAPI.complete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

