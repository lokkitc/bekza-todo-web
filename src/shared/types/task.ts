import type { PaginatedResponse } from './common'
import type { GroupSummary } from './group'
import type { UserSummary } from './user'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string
  completed_at?: string
  user_id: string
  group_id?: string
  created_at: string
  updated_at: string
  user?: UserSummary
  group?: GroupSummary
}

export interface TaskCreateRequest {
  title: string
  description?: string
  priority?: TaskPriority
  due_date?: string
  group_id?: string
}

export interface TaskUpdateRequest extends Partial<TaskCreateRequest> {
  status?: TaskStatus
  completed_at?: string | null
}

export interface TaskStatusUpdatePayload {
  status: TaskStatus
}

export interface TaskFilters extends Record<string, string | number | boolean | undefined> {
  status?: TaskStatus
  priority?: TaskPriority
  group_id?: string
  page?: number
  limit?: number
}

export type TaskListResponse = PaginatedResponse<Task>

