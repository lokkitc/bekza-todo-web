import { useState, useEffect } from 'react'
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/features/tasks/api'
import { useGroupsQuery } from '@/features/groups/api'
import type { Task, TaskCreateRequest, TaskUpdateRequest, TaskStatus, TaskPriority } from '@/shared/types'
import './TaskForm.css'

interface TaskFormProps {
  task?: Task
  defaultGroupId?: string
  onSuccess: () => void
  onCancel: () => void
}

const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed', 'cancelled']
const TASK_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

export function TaskForm({ task, defaultGroupId, onSuccess, onCancel }: TaskFormProps) {
  const isEditing = !!task
  const createMutation = useCreateTaskMutation()
  const updateMutation = useUpdateTaskMutation()
  const { data: groupsData } = useGroupsQuery()

  const [formData, setFormData] = useState<TaskCreateRequest & { status?: TaskStatus }>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    group_id: defaultGroupId || '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        group_id: task.group_id || '',
        status: task.status,
      })
    } else if (defaultGroupId) {
      setFormData((prev) => ({ ...prev, group_id: defaultGroupId }))
    }
  }, [task, defaultGroupId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Название задачи обязательно')
      return
    }

    try {
      if (isEditing && task) {
        const updatePayload: TaskUpdateRequest = {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          due_date: formData.due_date || undefined,
          group_id: formData.group_id || undefined,
          status: formData.status,
        }
        await updateMutation.mutateAsync({ taskId: task.id, payload: updatePayload })
      } else {
        const createPayload: TaskCreateRequest = {
          title: formData.title,
          description: formData.description || undefined,
          priority: formData.priority,
          due_date: formData.due_date || undefined,
          group_id: formData.group_id || undefined,
        }
        await createMutation.mutateAsync(createPayload)
      }
      onSuccess()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка сохранения задачи'
      setError(message)
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const isLoading = createMutation.isPending || updateMutation.isPending
  const groups = groupsData || []

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-form-header">
        <h3>{isEditing ? 'Редактировать задачу' : 'Создать задачу'}</h3>
      </div>

      <div className="form-group">
        <label htmlFor="title" className="form-label">
          Название *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={handleChange('title')}
          className="form-input"
          disabled={isLoading}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Описание
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={handleChange('description')}
          className="form-textarea"
          disabled={isLoading}
          rows={4}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status" className="form-label">
            Статус
          </label>
          <select
            id="status"
            value={formData.status || 'pending'}
            onChange={handleChange('status')}
            className="form-select"
            disabled={isLoading || !isEditing}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority" className="form-label">
            Приоритет
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={handleChange('priority')}
            className="form-select"
            disabled={isLoading}
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="group_id" className="form-label">
            Группа
          </label>
          <select
            id="group_id"
            value={formData.group_id}
            onChange={handleChange('group_id')}
            className="form-select"
            disabled={isLoading}
          >
            <option value="">Без группы</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="due_date" className="form-label">
            Срок выполнения
          </label>
          <input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange('due_date')}
            className="form-input"
            disabled={isLoading}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="button-secondary" disabled={isLoading}>
          Отмена
        </button>
        <button type="submit" className="button-primary" disabled={isLoading}>
          {isLoading ? 'Сохранение...' : isEditing ? 'Сохранить' : 'Создать'}
        </button>
      </div>
    </form>
  )
}

