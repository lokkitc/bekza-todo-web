import { useState } from 'react'
import {
  useDeleteTaskMutation,
  useCompleteTaskMutation,
  useUpdateTaskStatusMutation,
} from '@/features/tasks/api'
import { TaskForm } from './TaskForm'
import type { Task, TaskStatus } from '@/shared/types'
import './TaskCard.css'

interface TaskCardProps {
  task: Task
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
}

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

export function TaskCard({ task }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const deleteMutation = useDeleteTaskMutation()
  const completeMutation = useCompleteTaskMutation()
  const updateStatusMutation = useUpdateTaskStatusMutation()

  const handleDelete = async () => {
    if (!confirm(`Вы уверены, что хотите удалить задачу "${task.title}"?`)) {
      return
    }

    try {
      await deleteMutation.mutateAsync(task.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления задачи')
    }
  }

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync(task.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка завершения задачи')
    }
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ taskId: task.id, payload: { status: newStatus } })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка изменения статуса')
    }
  }

  if (isEditing) {
    return (
      <TaskForm task={task} onSuccess={() => setIsEditing(false)} onCancel={() => setIsEditing(false)} />
    )
  }

  return (
    <article className="task-card">
      <header className="task-card-header">
        <div className="task-card-title-group">
          <h4 className="task-card-title">{task.title}</h4>
          <span className={`task-status task-status-${task.status}`}>
            {STATUS_LABELS[task.status]}
          </span>
        </div>
        <div className="task-card-actions">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="button-icon"
            title="Редактировать"
          >
            ✏️
          </button>
          {task.status !== 'completed' && (
            <button
              type="button"
              onClick={handleComplete}
              className="button-icon"
              title="Завершить"
              disabled={completeMutation.isPending}
            >
              ✓
            </button>
          )}
          <button
            type="button"
            onClick={handleDelete}
            className="button-icon button-danger"
            title="Удалить"
            disabled={deleteMutation.isPending}
          >
            🗑️
          </button>
        </div>
      </header>

      {task.description && <p className="task-card-description">{task.description}</p>}

      <div className="task-card-meta">
        <div className="task-meta-row">
          <span className="task-meta-label">Приоритет:</span>
          <span className={`task-priority task-priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>
        {task.group && (
          <div className="task-meta-row">
            <span className="task-meta-label">Группа:</span>
            <span
              className="task-group-badge"
              style={{ backgroundColor: task.group.color || 'var(--color-accent)' }}
            >
              {task.group.name}
            </span>
          </div>
        )}
        {task.due_date && (
          <div className="task-meta-row">
            <span className="task-meta-label">Срок:</span>
            <span className="task-due-date">
              {new Date(task.due_date).toLocaleDateString('ru-RU')}
            </span>
          </div>
        )}
        <div className="task-status-actions">
          <label className="task-status-label">
            Статус:
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="task-status-select"
              disabled={updateStatusMutation.isPending}
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
    </article>
  )
}

