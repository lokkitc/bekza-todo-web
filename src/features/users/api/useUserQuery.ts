import { useQuery } from '@tanstack/react-query'
import { UsersAPI } from '@/shared/api'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useEffect } from 'react'

export function useUserQuery() {
  const { updateUser } = useAuth()
  
  const query = useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => UsersAPI.getMe(),
  })

  
  useEffect(() => {
    if (query.data) {
      updateUser(query.data)
    }
  }, [query.data, updateUser])

  return query
}

