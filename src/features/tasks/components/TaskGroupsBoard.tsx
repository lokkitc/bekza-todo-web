import './TaskGroupsBoard.css'
import { useMemo, useState, useCallback, useEffect } from 'react'
import { useTasksQuery } from '@/features/tasks/api'
import type { Task } from '@/shared/types'

interface TaskGroupBucket {
  id: string
  name: string
  color?: string
  tasks: Task[]
}

const sortTasks = (tasks: Task[]) =>
  [...tasks].sort((a, b) => a.created_at.localeCompare(b.created_at))

export function TaskGroupsBoard() {
  const { data, isLoading, isFetching, isError, error, refetch } = useTasksQuery()
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const buckets = useMemo<TaskGroupBucket[]>(() => {
    const allTasks = data?.items ?? []
    const map = new Map<string, TaskGroupBucket>()

    allTasks.forEach((task) => {
      const groupId = task.group?.id ?? 'ungrouped'
      const bucket = map.get(groupId)
      const payload: TaskGroupBucket = bucket ?? {
        id: groupId,
        name: task.group?.name ?? 'Без группы',
        color: task.group?.color,
        tasks: [],
      }
      payload.tasks.push(task)
      map.set(groupId, payload)
    })

    if (!map.size) {
      map.set('empty', {
        id: 'empty',
        name: 'Нет задач',
        color: undefined,
        tasks: [],
      })
    }

    return Array.from(map.values()).map((bucket) => ({
      ...bucket,
      tasks: sortTasks(bucket.tasks),
    }))
  }, [data])

  const toggleGroup = useCallback((groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refetch()
      }
    }
    const handleFocus = () => refetch()
    const handleOnline = () => refetch()

    window.addEventListener('focus', handleFocus)
    window.addEventListener('online', handleOnline)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('online', handleOnline)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [refetch])

  const errorMessage =
    isError && error instanceof Error ? error.message : isError ? 'Неизвестная ошибка' : null

  return (
    <section className="task-groups-board">
      <header className="task-groups-header">
        <div>
          {/* <p className="eyebrow">Задачи</p> */}
          <h2 style={{ margin: 0 }}>Группы задач</h2>
          {isFetching && <p className="group-meta">Обновляем...</p>}
        </div>
      </header>

      {isLoading && <p className="board-alert">Загружаем задачи...</p>}
      {errorMessage && <p className="board-alert error">Ошибка API: {errorMessage}</p>}

      <div className="task-groups-grid">
        {buckets.map((bucket) => (
          <article key={bucket.id} className="task-group-card">
            <header>
              <div className="group-title">
                <span
                  className="group-dot"
                  style={{ backgroundColor: bucket.color || 'var(--color-accent)' }}
                />
                <div className='group-title-content'>
                  <p className="group-name">{bucket.name}</p>
                  <p className="group-meta">{bucket.tasks.length} задач</p>
                </div>
              </div>
              <button
                type="button"
                className="collapse-toggle"
                onClick={() => toggleGroup(bucket.id)}
                aria-expanded={!collapsedGroups[bucket.id]}
              >
                {collapsedGroups[bucket.id] ? 'Раскрыть' : 'Свернуть'}
              </button>
            </header>
            {!collapsedGroups[bucket.id] && (
              <ul>
                {bucket.tasks.length ? (
                  bucket.tasks.map((task) => (
                    <li key={task.id} className="group-task">
                      <div className="group-task-content" >
                        <p className="group-task-title">{task.title}</p>
                        {task.description && <p>{task.description}</p>}
                      </div>
                      <span className={`status status-${task.status}`}>{task.status}</span>
                    </li>
                  ))
                ) : (
                  <li className="empty-state">Нет задач в данной группе</li>
                )}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

