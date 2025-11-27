import { useMutation, useQueryClient } from '@tanstack/react-query'
import { TasksAPI } from '@/shared/api'
import type { Task, TaskCreateRequest } from '@/shared/types'
import { TASKS_QUERY_KEY } from './useTasksQuery'

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TaskCreateRequest) => TasksAPI.create(payload),
    onSuccess: (createdTask: Task) => {
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
      return createdTask
    },
  })
}

