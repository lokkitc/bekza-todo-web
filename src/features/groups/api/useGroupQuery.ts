import { useQuery } from '@tanstack/react-query'
import { GroupsAPI } from '@/shared/api'

export function useGroupQuery(groupId: string) {
  return useQuery({
    queryKey: ['groups', groupId],
    queryFn: () => GroupsAPI.getById(groupId),
    enabled: !!groupId,
  })
}


