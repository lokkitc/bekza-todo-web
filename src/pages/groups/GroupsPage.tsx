import { useState } from 'react'
import { useGroupsQuery } from '@/features/groups/api'
import { GroupCard } from '@/features/groups/components/GroupCard'
import { GroupForm } from '@/features/groups/components/GroupForm'
import './GroupsPage.css'

export function GroupsPage() {
  const { data, isLoading, isError, error } = useGroupsQuery()
  const [isCreating, setIsCreating] = useState(false)

  if (isLoading) {
    return (
      <div className="groups-page">
        <p>Загрузка групп...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="groups-page">
        <div className="error-alert">
          Ошибка загрузки групп: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </div>
      </div>
    )
  }

  const groups = data || []

  return (
    <div className="groups-page">
      <header className="groups-header">
        <div>
          <h1>Группы</h1>
          <p className="groups-subtitle">Управление группами задач</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="button-primary"
          disabled={isCreating}
        >
          Создать группу
        </button>
      </header>

      {isCreating && (
        <div className="group-form-container">
          <GroupForm onSuccess={() => setIsCreating(false)} onCancel={() => setIsCreating(false)} />
        </div>
      )}

      {groups.length === 0 ? (
        <div className="empty-state">
          <p>Нет групп. Создайте первую группу для организации задач.</p>
        </div>
      ) : (
        <div className="groups-grid">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}

