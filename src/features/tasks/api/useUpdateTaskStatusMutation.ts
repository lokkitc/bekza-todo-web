import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TasksAPI } from '@/shared/api'
import type { TaskStatusUpdatePayload } from '@/shared/types'
import { TASKS_QUERY_KEY } from './useTasksQuery'

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: TaskStatusUpdatePayload }) =>
      TasksAPI.updateStatus(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    },
  })
}

