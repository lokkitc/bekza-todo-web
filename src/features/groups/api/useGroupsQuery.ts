import { useQuery } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'

export function useGroupsQuery() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: () => GroupsAPI.list(),
  })
}

