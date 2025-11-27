import type { PaginatedResponse } from './common'
import type { Task } from './task'
import type { UserPublic } from './user'

export interface GroupSummary {
  id: string
  name: string
  color?: string
}

export interface Group extends GroupSummary {
  description?: string
  created_by: string
  created_at: string
  updated_at: string
  members?: UserPublic[]
}

export interface GroupCreateRequest {
  name: string
  description?: string
  color?: string
}

export type GroupUpdateRequest = Partial<GroupCreateRequest>

export interface GroupMemberPayload {
  user_id: string
}

export interface GroupWithTasks extends Group {
  tasks: Task[]
}

export type GroupListResponse = Group[]

