import { useQuery } from '@tanstack/react-query'
import { UsersAPI } from '@/shared/api'
import type { UserPublic } from '@/shared/types'

export function useUserByUsernameQuery(username: string) {
  return useQuery<UserPublic>({
    queryKey: ['user', 'username', username],
    queryFn: () => UsersAPI.getByUsername(username),
    enabled: !!username,
  })
}

