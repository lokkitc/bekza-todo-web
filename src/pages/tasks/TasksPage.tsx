import { useState } from 'react'
import './TasksPage.css'
import { TaskGroupsBoard } from '@/features/tasks/components/TaskGroupsBoard'
import { TaskForm } from '@/features/tasks/components/TaskForm'
import { useTasksQuery } from '@/features/tasks/api'
import { TaskCard } from '@/features/tasks/components/TaskCard'

export function TasksPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const { data, isLoading, isError, error } = useTasksQuery()

  const tasks = data?.items || []

  return (
    <div className="tasks-page">
      <header className="tasks-page-header">
        <div>
          <h1>Задачи</h1>
          <p className="tasks-subtitle">Управление задачами</p>
        </div>
        <div className="tasks-header-actions">
          <div className="view-toggle">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={viewMode === 'board' ? 'active' : ''}
            >
              Доска
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'active' : ''}
            >
              Список
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="button-primary"
            disabled={isCreating}
          >
            Создать задачу
          </button>
        </div>
      </header>

      {isCreating && (
        <div className="task-form-container">
          <TaskForm onSuccess={() => setIsCreating(false)} onCancel={() => setIsCreating(false)} />
        </div>
      )}

      {isError && (
        <div className="error-alert">
          Ошибка загрузки задач: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </div>
      )}

      {viewMode === 'board' ? (
        <TaskGroupsBoard />
      ) : (
        <div className="tasks-list-view">
          {isLoading ? (
            <p>Загрузка задач...</p>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>Нет задач. Создайте первую задачу.</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

