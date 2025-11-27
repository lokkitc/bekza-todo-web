import { apiClient } from './httpClient'
import type { User, UserPublic, UserStats, UserUpdateRequest, UserListParams } from '@/shared/types'

const USERS_PREFIX = 'users'

export const UsersAPI = {
  getMe(includeStats = true) {
    return apiClient.get<User>(`${USERS_PREFIX}/me`, { include_stats: includeStats })
  },
  getMeStats() {
    return apiClient.get<UserStats>(`${USERS_PREFIX}/me/stats`)
  },
  getById(userId: string) {
    return apiClient.get<UserPublic>(`${USERS_PREFIX}/${userId}`)
  },
  getByUsername(username: string) {
    return apiClient.get<UserPublic>(`${USERS_PREFIX}/username/${username}`)
  },
  list(params?: UserListParams) {
    const queryParams = params ? {
      page: params.page?.toString(),
      size: params.size?.toString(),
      search: params.search,
    } : undefined
    return apiClient.get<UserPublic[]>(`${USERS_PREFIX}/`, queryParams)
  },
  search(search: string, page = 1, size = 20) {
    return apiClient.get<UserPublic[]>(`${USERS_PREFIX}/`, { search, page, size })
  },
  updateMe(payload: UserUpdateRequest) {
    return apiClient.put<User, UserUpdateRequest>(`${USERS_PREFIX}/me`, payload)
  },
  deleteMe() {
    return apiClient.delete<void>(`${USERS_PREFIX}/me`)
  },
}

