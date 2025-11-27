export interface UserStats {
  total_tasks: number
  completed_tasks: number
  pending_tasks: number
  in_progress_tasks: number
  tasks_this_week: number
  tasks_completed_this_week: number
  total_groups: number
  activity_score: number
}

export interface User {
  id: string
  email: string
  username: string
  full_name?: string
  avatar_url?: string
  header_background_url?: string
  bio?: string
  is_active: boolean
  is_superuser: boolean
  created_at: string
  updated_at: string
  stats?: UserStats
}

export interface UserPublic {
  id: string
  username: string
  full_name?: string
  avatar_url?: string
  header_background_url?: string
  bio?: string
  created_at: string
  stats?: UserStats
}

export type UserSummary = Pick<User, 'id' | 'email' | 'username' | 'full_name'>

export interface UserCreateRequest {
  email: string
  username: string
  password: string
  full_name?: string
  avatar_url?: string
  header_background_url?: string
  bio?: string
}

export interface UserUpdateRequest {
  email?: string
  username?: string
  full_name?: string
  avatar_url?: string
  header_background_url?: string
  bio?: string
  password?: string
}

export interface UserListParams {
  page?: number
  size?: number
  search?: string
}

