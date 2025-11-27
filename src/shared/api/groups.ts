import { apiClient } from './httpClient'
import type {
  Group,
  GroupCreateRequest,
  GroupListResponse,
  GroupMemberPayload,
  GroupUpdateRequest,
  GroupWithTasks,
} from '@/shared/types'

const GROUPS_PREFIX = 'groups'

export const GroupsAPI = {
  list() {
    return apiClient.get<GroupListResponse>(`${GROUPS_PREFIX}/`)
  },
  getById(groupId: string) {
    return apiClient.get<GroupWithTasks>(`${GROUPS_PREFIX}/${groupId}`)
  },
  create(payload: GroupCreateRequest) {
    return apiClient.post<Group, GroupCreateRequest>(`${GROUPS_PREFIX}/`, payload)
  },
  update(groupId: string, payload: GroupUpdateRequest) {
    return apiClient.put<Group, GroupUpdateRequest>(`${GROUPS_PREFIX}/${groupId}`, payload)
  },
  delete(groupId: string) {
    return apiClient.delete<void>(`${GROUPS_PREFIX}/${groupId}`)
  },
  addMember(groupId: string, payload: GroupMemberPayload) {
    return apiClient.post<Group, GroupMemberPayload>(`${GROUPS_PREFIX}/${groupId}/members`, payload)
  },
  removeMember(groupId: string, userId: string) {
    return apiClient.delete<Group>(`${GROUPS_PREFIX}/${groupId}/members/${userId}`)
  },
  listTasks(groupId: string) {
    return apiClient.get<GroupWithTasks>(`${GROUPS_PREFIX}/${groupId}/tasks`)
  },
}

