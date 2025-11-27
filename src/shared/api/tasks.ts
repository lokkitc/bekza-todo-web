import { apiClient } from './httpClient'
import type {
  Task,
  TaskCreateRequest,
  TaskFilters,
  TaskListResponse,
  TaskStatusUpdatePayload,
  TaskUpdateRequest,
} from '@/shared/types'

const TASKS_PREFIX = 'tasks'

export const TasksAPI = {
  list(filters?: TaskFilters) {
    return apiClient.get<TaskListResponse>(`${TASKS_PREFIX}/`, filters)
  },
  getById(taskId: string) {
    return apiClient.get<Task>(`${TASKS_PREFIX}/${taskId}`)
  },
  create(payload: TaskCreateRequest) {
    return apiClient.post<Task, TaskCreateRequest>(`${TASKS_PREFIX}/`, payload)
  },
  update(taskId: string, payload: TaskUpdateRequest) {
    return apiClient.put<Task, TaskUpdateRequest>(`${TASKS_PREFIX}/${taskId}`, payload)
  },
  delete(taskId: string) {
    return apiClient.delete<void>(`${TASKS_PREFIX}/${taskId}`)
  },
  complete(taskId: string) {
    return apiClient.patch<Task>(`${TASKS_PREFIX}/${taskId}/complete`)
  },
  updateStatus(taskId: string, payload: TaskStatusUpdatePayload) {
    return apiClient.patch<Task, TaskStatusUpdatePayload>(
      `${TASKS_PREFIX}/${taskId}/status`,
      payload,
    )
  },
}

