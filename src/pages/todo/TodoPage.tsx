import { useState } from 'react'
import { useGroupsQuery } from '@/features/groups/api'
import { useDeleteGroupMutation } from '@/features/groups/api'
import { useTasksQuery } from '@/features/tasks/api'
import { GroupForm } from '@/features/groups/components/GroupForm'
import { GroupMembersManager } from '@/features/groups/components/GroupMembersManager'
import { TaskForm } from '@/features/tasks/components/TaskForm'
import { TaskCard } from '@/features/tasks/components/TaskCard'
import './TodoPage.css'

export function TodoPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null)
  const [showMembersManager, setShowMembersManager] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: groupsData, isLoading: groupsLoading, isError: groupsError } = useGroupsQuery()
  const deleteGroupMutation = useDeleteGroupMutation()
  
  const { data: tasksData, isLoading: tasksLoading } = useTasksQuery()

  const groups = groupsData || []
  const allTasks = tasksData?.items || []
  const selectedGroup = groups.find((g) => g.id === selectedGroupId)
  
  
  const tasks =
    selectedGroupId === 'ungrouped'
      ? allTasks.filter((task) => !task.group_id)
      : selectedGroupId
        ? allTasks.filter((task) => task.group_id === selectedGroupId)
        : []

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId)
    setIsCreatingTask(false)
    setSidebarOpen(false) 
  }

  const handleCreateGroup = () => {
    setIsCreatingGroup(true)
    setSelectedGroupId(null)
  }

  const handleCreateTask = () => {
    setIsCreatingTask(true)
  }

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить группу "${groupName}"?`)) {
      return
    }

    try {
      await deleteGroupMutation.mutateAsync(groupId)
      if (selectedGroupId === groupId) {
        setSelectedGroupId(null)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления группы')
    }
  }

  if (groupsLoading) {
    return (
      <div className="todo-page">
        <p>Загрузка...</p>
      </div>
    )
  }

  if (groupsError) {
    const errorMessage =
      groupsError && typeof groupsError === 'object' && 'message' in groupsError
        ? String((groupsError as { message: string }).message)
        : 'Неизвестная ошибка'
    return (
      <div className="todo-page">
        <div className="error-alert">Ошибка загрузки групп: {errorMessage}</div>
      </div>
    )
  }

  return (
    <div className={`todo-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className={`todo-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <header className="todo-sidebar-header">
          <h2>Группы</h2>
          <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
            <button
              type="button"
              className="sidebar-close-mobile"
              onClick={() => setSidebarOpen(false)}
              aria-label="Закрыть меню"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={handleCreateGroup}
              className="button-icon-add"
              disabled={isCreatingGroup}
              title="Создать группу"
            >
              +
            </button>
          </div>
        </header>

        {isCreatingGroup && (
          <div className="todo-form-container">
            <GroupForm
              onSuccess={() => {
                setIsCreatingGroup(false)
              }}
              onCancel={() => setIsCreatingGroup(false)}
            />
          </div>
        )}

        <div className="groups-list">
          <div
            className={`group-item ${selectedGroupId === 'ungrouped' ? 'active' : ''}`}
            onClick={() => handleGroupSelect('ungrouped')}
          >
            <div className="group-item-content">
              <div className="group-item-info">
                <span className="group-item-name">Без группы</span>
              </div>
            </div>
          </div>
          {groups.length === 0 ? (
            <div className="empty-state-small">
              <p>Нет групп. Создайте первую группу.</p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="group-item-wrapper">
                {editingGroupId === group.id ? (
                  <GroupForm
                    group={group}
                    onSuccess={() => setEditingGroupId(null)}
                    onCancel={() => setEditingGroupId(null)}
                  />
                ) : (
                  <div
                    className={`group-item ${selectedGroupId === group.id ? 'active' : ''}`}
                    onClick={() => handleGroupSelect(group.id)}
                  >
                    <div className="group-item-content">
                      {group.color && (
                        <span
                          className="group-item-dot"
                          style={{ backgroundColor: group.color }}
                        />
                      )}
                      <div className="group-item-info">
                        <span className="group-item-name">{group.name}</span>
                        {group.description && (
                          <span className="group-item-description">{group.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="group-item-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setEditingGroupId(group.id)}
                        className="button-icon-small"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        className="button-icon-small button-danger"
                        title="Удалить"
                        disabled={deleteGroupMutation.isPending}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="todo-content">
        {selectedGroupId !== null ? (
          <>
            <header className="todo-content-header">
              <button
                type="button"
                className="sidebar-toggle-mobile"
                onClick={() => setSidebarOpen(true)}
                aria-label="Открыть меню групп"
              >
                ☰ Группы
              </button>
              <div>
                <h1>
                  {selectedGroup?.color && (
                    <span
                      className="group-header-dot"
                      style={{ backgroundColor: selectedGroup.color }}
                    />
                  )}
                  {selectedGroupId === 'ungrouped'
                    ? 'Без группы'
                    : selectedGroup?.name || 'Группа'}
                </h1>
                {selectedGroup?.description && (
                  <p className="todo-content-subtitle">{selectedGroup.description}</p>
                )}
                {selectedGroup && selectedGroupId !== 'ungrouped' && (
                  <p className="todo-content-meta">
                    Участников: {selectedGroup.members?.length ?? 0}
                  </p>
                )}
              </div>
              <div className="todo-content-actions">
                {selectedGroupId !== 'ungrouped' && selectedGroup && (
                  <button
                    type="button"
                    onClick={() => setShowMembersManager(true)}
                    className="button-secondary"
                  >
                    👥 Участники
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCreateTask}
                  className="button-primary"
                  disabled={isCreatingTask}
                >
                  + Создать задачу
                </button>
              </div>
            </header>

            {isCreatingTask && (
              <div className="todo-form-container">
                <TaskForm
                  defaultGroupId={selectedGroupId === 'ungrouped' ? undefined : selectedGroupId || undefined}
                  onSuccess={() => {
                    setIsCreatingTask(false)
                  }}
                  onCancel={() => setIsCreatingTask(false)}
                />
              </div>
            )}

            {tasksLoading ? (
              <p>Загрузка задач...</p>
            ) : tasks.length === 0 ? (
              <div className="empty-state">
                <p>Нет задач в этой группе. Создайте первую задачу.</p>
              </div>
            ) : (
              <div className="tasks-list">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="todo-empty-selection">
            <button
              type="button"
              className="sidebar-toggle-mobile"
              onClick={() => setSidebarOpen(true)}
            >
              ☰ Выберите группу
            </button>
            <p>Выберите группу, чтобы просмотреть задачи</p>
          </div>
        )}
      </div>

      {}
      {showMembersManager && selectedGroupId && selectedGroupId !== 'ungrouped' && (
        <div
          className="group-members-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMembersManager(false)
            }
          }}
        >
          <GroupMembersManager
            groupId={selectedGroupId}
            onClose={() => setShowMembersManager(false)}
          />
        </div>
      )}
    </div>
  )
}

