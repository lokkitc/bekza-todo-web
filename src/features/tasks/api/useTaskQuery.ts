import { useQuery } from '@tanstack/react-query'
import { TasksAPI } from '@/shared/api'

export function useTaskQuery(taskId: string) {
  return useQuery({
    queryKey: ['tasks', taskId],
    queryFn: () => TasksAPI.getById(taskId),
    enabled: !!taskId,
  })
}


