import { useQuery } from '@tanstack/react-query'
import { UsersAPI } from '@/shared/api'
import type { UserPublic, UserListParams } from '@/shared/types'

export function useUsersListQuery(params?: UserListParams) {
  return useQuery<UserPublic[]>({
    queryKey: ['users', 'list', params],
    queryFn: () => UsersAPI.list(params),
  })
}


