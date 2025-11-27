import type { ApiMethod } from '@/shared/types'

export interface ApiCatalogEntry {
  method: ApiMethod
  path: string
  description: string
}

export interface ApiCatalogSection {
  title: string
  endpoints: ApiCatalogEntry[]
}

export const apiCatalog: ApiCatalogSection[] = [
  {
    title: 'Аутентификация /auth',
    endpoints: [
      { method: 'POST', path: '/api/v1/auth/register', description: 'Регистрация нового пользователя и выдача токенов' },
      { method: 'POST', path: '/api/v1/auth/login', description: 'Вход по email/username и пароль' },
      { method: 'POST', path: '/api/v1/auth/refresh', description: 'Обновление короткоживущего access токена' },
      { method: 'POST', path: '/api/v1/auth/logout', description: 'Инвалидация текущего токена' },
    ],
  },
  {
    title: 'Пользователи /users',
    endpoints: [
      { method: 'GET', path: '/api/v1/users/me', description: 'Получить профиль текущего пользователя' },
      { method: 'GET', path: '/api/v1/users/{user_id}', description: 'Получить профиль по ID (ограничен правами)' },
      { method: 'PUT', path: '/api/v1/users/me', description: 'Обновить собственный профиль' },
      { method: 'DELETE', path: '/api/v1/users/me', description: 'Удалить собственный аккаунт (soft delete)' },
    ],
  },
  {
    title: 'Задачи /tasks',
    endpoints: [
      { method: 'GET', path: '/api/v1/tasks', description: 'Список задач текущего пользователя с фильтрами и пагинацией' },
      { method: 'GET', path: '/api/v1/tasks/{task_id}', description: 'Получить задачу по ID' },
      { method: 'POST', path: '/api/v1/tasks', description: 'Создать новую задачу' },
      { method: 'PUT', path: '/api/v1/tasks/{task_id}', description: 'Обновить задачу' },
      { method: 'DELETE', path: '/api/v1/tasks/{task_id}', description: 'Удалить задачу (soft delete)' },
      { method: 'PATCH', path: '/api/v1/tasks/{task_id}/complete', description: 'Отметить задачу как выполненную' },
      { method: 'PATCH', path: '/api/v1/tasks/{task_id}/status', description: 'Изменить статус задачи' },
    ],
  },
  {
    title: 'Группы /groups',
    endpoints: [
      { method: 'GET', path: '/api/v1/groups', description: 'Список групп текущего пользователя' },
      { method: 'GET', path: '/api/v1/groups/{group_id}', description: 'Получить группу и связанные задачи' },
      { method: 'POST', path: '/api/v1/groups', description: 'Создать новую группу' },
      { method: 'PUT', path: '/api/v1/groups/{group_id}', description: 'Обновить существующую группу' },
      { method: 'DELETE', path: '/api/v1/groups/{group_id}', description: 'Удалить группу' },
      { method: 'POST', path: '/api/v1/groups/{group_id}/members', description: 'Добавить участника в группу' },
      { method: 'DELETE', path: '/api/v1/groups/{group_id}/members/{user_id}', description: 'Удалить участника из группы' },
      { method: 'GET', path: '/api/v1/groups/{group_id}/tasks', description: 'Получить задачи группы с фильтрацией' },
    ],
  },
]

