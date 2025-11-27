import { useQuery } from '@tanstack/react-query'
import { TasksAPI } from '@/shared/api'
import type { TaskFilters } from '@/shared/types'

const TASKS_QUERY_KEY = 'tasks'

export function useTasksQuery(filters?: TaskFilters) {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, filters],
    queryFn: () => TasksAPI.list(filters),
    staleTime: 30_000,
  })
}

export { TASKS_QUERY_KEY }

