import { useMemo, useState } from 'react'
import { useCreateTaskMutation, useTasksQuery } from '../api'
import type { Task, TaskStatus } from '@/shared/types'

const fallbackTasks: Task[] = [
  {
    id: 't-1',
    title: 'Дизайн схемы данных',
    description: 'User, Task, Group + связи',
    status: 'in_progress',
    priority: 'high',
    user_id: 'u-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    due_date: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 't-2',
    title: 'Интеграция AuthAPI',
    status: 'pending',
    priority: 'medium',
    user_id: 'u-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 't-3',
    title: 'Синхронизация групп',
    status: 'completed',
    priority: 'low',
    user_id: 'u-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  },
]

const statusLabel: Record<TaskStatus, string> = {
  pending: 'Назначено',
  in_progress: 'В работе',
  completed: 'Готово',
  cancelled: 'Отменено',
}

export function TodoList() {
  const { data, isLoading, isFetching, isError, error, refetch } = useTasksQuery()
  const createTaskMutation = useCreateTaskMutation()
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const tasksFromApi = data?.items ?? []
  const tasks = tasksFromApi.length ? tasksFromApi : fallbackTasks
  const grouped = useMemo(() => {
    return tasks.reduce<Record<TaskStatus, Task[]>>(
      (acc, task) => {
        acc[task.status] = [...acc[task.status], task]
        return acc
      },
      { pending: [], in_progress: [], completed: [], cancelled: [] },
    )
  }, [tasks])

  const errorMessage =
    isError && error instanceof Error ? error.message : isError ? 'Неизвестная ошибка' : null
  const isUsingFallback = !tasksFromApi.length

  const handleCreateDemoTask = async () => {
    setActionMessage('Отправляем POST /api/v1/tasks ...')
    try {
      const result = await createTaskMutation.mutateAsync({
        title: `Demo task ${new Date().toLocaleTimeString()}`,
        description: 'Быстрый POST запрос из фронта',
        priority: 'medium',
      })
      setActionMessage(`API ответило, создана задача: ${result.title}`)
    } catch (mutationError) {
      const message =
        mutationError instanceof Error ? mutationError.message : 'Неизвестная ошибка'
      setActionMessage(`Ошибка при создании задачи: ${message}`)
    }
  }

  return (
    <article className="card">
      <header className="card-header">
        <h2>Срез задач</h2>
        <p>
          React Query сразу кидает запрос в FastAPI (`GET /api/v1/tasks`). Если бэкенд недоступен,
          показываем демо-данные и текст ошибки.
        </p>
      </header>

      <div className="task-actions">
        <button onClick={() => refetch()} disabled={isFetching}>
          {isFetching ? 'Обновляем...' : 'Запросить /tasks'}
        </button>
        <button onClick={handleCreateDemoTask} disabled={createTaskMutation.isPending}>
          {createTaskMutation.isPending ? 'POST /tasks ...' : 'Создать демо-задачу'}
        </button>
      </div>

      {(isLoading || isFetching) && <p className="api-alert">Запрашиваем данные у API ...</p>}
      {errorMessage && (
        <p className="api-alert error">
          API недоступно: {errorMessage}. Показаны мок-данные для разработки.
        </p>
      )}
      {actionMessage && <p className="api-alert">{actionMessage}</p>}
      {isUsingFallback && !isError && (
        <p className="api-alert">API вернул пустой список — показываем пустой борт.</p>
      )}

      <div className="kanban-grid">
        {Object.entries(grouped).map(([status, tasksByStatus]) => (
          <div key={status} className="kanban-column">
            <p className="kanban-title">
              {statusLabel[status as TaskStatus]}
              {tasksFromApi.length ? ` — ${tasksByStatus.length}` : ''}
            </p>
            <ul>
              {tasksByStatus.map((task) => (
                <li key={task.id} className={`task-card priority-${task.priority}`}>
                  <strong>{task.title}</strong>
                  {task.description && <p>{task.description}</p>}
                  <span className="task-meta">
                    Приоритет: {task.priority} • Обновлено:{' '}
                    {new Date(task.updated_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
              {!tasksByStatus.length && <p className="empty-state">Нет задач</p>}
            </ul>
          </div>
        ))}
      </div>
    </article>
  )
}

