export interface PaginationMeta {
  total: number
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

