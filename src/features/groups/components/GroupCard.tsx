import { useState } from 'react'
import { useDeleteGroupMutation } from '@/features/groups/api'
import { GroupForm } from './GroupForm'
import { GroupMembersManager } from './GroupMembersManager'
import type { Group } from '@/shared/types'
import './GroupCard.css'

interface GroupCardProps {
  group: Group
}

export function GroupCard({ group }: GroupCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const deleteMutation = useDeleteGroupMutation()

  const handleDelete = async () => {
    if (!confirm(`Вы уверены, что хотите удалить группу "${group.name}"?`)) {
      return
    }

    try {
      await deleteMutation.mutateAsync(group.id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления группы')
    }
  }

  if (isEditing) {
    return (
      <GroupForm
        group={group}
        onSuccess={() => setIsEditing(false)}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <article className="group-card">
      <header className="group-card-header">
        <div className="group-card-title">
          {group.color && (
            <span
              className="group-color-dot"
              style={{ backgroundColor: group.color }}
            />
          )}
          <h3>{group.name}</h3>
        </div>
        <div className="group-card-actions">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="button-icon"
            title="Редактировать"
          >
            ✏️
          </button>
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

      {group.description && (
        <p className="group-card-description">{group.description}</p>
      )}

      <div className="group-card-meta">
        <span className="group-meta-item">
          Участников: {group.members?.length ?? 0}
        </span>
        <span className="group-meta-item">
          Создана: {new Date(group.created_at).toLocaleDateString('ru-RU')}
        </span>
      </div>

      <div className="group-card-footer">
        <button
          type="button"
          onClick={() => setShowMembers(true)}
          className="button-secondary"
        >
          Управление участниками
        </button>
      </div>

      {showMembers && (
        <div
          className="group-members-modal"
          onClick={(e) => {
            
            if (e.target === e.currentTarget) {
              setShowMembers(false)
            }
          }}
        >
          <GroupMembersManager
            groupId={group.id}
            onClose={() => setShowMembers(false)}
          />
        </div>
      )}
    </article>
  )
}

