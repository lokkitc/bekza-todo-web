import { useQuery } from '@tanstack/react-query'
import { UsersAPI } from '@/shared/api'
import type { UserStats } from '@/shared/types'

export function useUserStatsQuery() {
  return useQuery<UserStats>({
    queryKey: ['user', 'me', 'stats'],
    queryFn: () => UsersAPI.getMeStats(),
  })
}

