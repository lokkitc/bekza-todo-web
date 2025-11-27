import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TasksAPI } from '@/shared/api'
import type { TaskUpdateRequest } from '@/shared/types'
import { TASKS_QUERY_KEY } from './useTasksQuery'

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: TaskUpdateRequest }) =>
      TasksAPI.update(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

