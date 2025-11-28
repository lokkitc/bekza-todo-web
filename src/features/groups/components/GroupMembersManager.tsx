import { useState, useMemo } from 'react'
import { useGroupQuery } from '../api/useGroupQuery'
import { useAddGroupMemberMutation, useRemoveGroupMemberMutation } from '../api'
import { UsersAPI } from '@/shared/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/context/AuthContext'
import { TASKS_QUERY_KEY } from '@/features/tasks/api/useTasksQuery'
import { getSafeImageUrl } from '@/shared/utils/imageUrl'
import type { UserPublic } from '@/shared/types'
import './GroupMembersManager.css'

interface GroupMembersManagerProps {
  groupId: string
  onClose?: () => void
}

export function GroupMembersManager({ groupId, onClose }: GroupMembersManagerProps) {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const { data: group, isLoading: groupLoading } = useGroupQuery(groupId)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddMember, setShowAddMember] = useState(false)

  const addMemberMutation = useAddGroupMemberMutation()
  const removeMemberMutation = useRemoveGroupMemberMutation()

  
  const { data: searchResults = [], isLoading: searchLoading } = useQuery({
    queryKey: ['users', 'search', searchQuery],
    queryFn: () => UsersAPI.search(searchQuery, 1, 10),
    enabled: showAddMember && searchQuery.length >= 2,
  })

  
  const availableUsers = useMemo(() => {
    if (!group || !searchResults) return []
    const memberIds = new Set(group.members?.map((m) => m.id) || [])
    return searchResults.filter((user) => !memberIds.has(user.id) && user.id !== currentUser?.id)
  }, [searchResults, group, currentUser?.id])

  const handleAddMember = async (userId: string) => {
    try {
      await addMemberMutation.mutateAsync({ groupId, payload: { user_id: userId } })
      setSearchQuery('')
      setShowAddMember(false)
      
      queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY] })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка добавления участника')
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого участника из группы?')) {
      return
    }

    try {
      await removeMemberMutation.mutateAsync({ groupId, userId })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка удаления участника')
    }
  }

  if (groupLoading) {
    return (
      <div className="group-members-manager">
        <p>Загрузка...</p>
      </div>
    )
  }

  if (!group) {
    return (
      <div className="group-members-manager">
        <p>Группа не найдена</p>
      </div>
    )
  }

  const members = group.members || []
  const isCreator = group.created_by === currentUser?.id

  return (
    <div className="group-members-manager">
      <div className="group-members-header">
        <h3>Участники группы "{group.name}"</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="button-icon">
            ✕
          </button>
        )}
      </div>

      <div className="group-members-content">
        {}
        {!showAddMember ? (
          <button
            type="button"
            onClick={() => setShowAddMember(true)}
            className="button-primary"
            style={{ marginBottom: 'var(--space-lg)' }}
          >
            + Добавить участника
          </button>
        ) : (
          <div className="add-member-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Поиск по username или email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowAddMember(false)
                  setSearchQuery('')
                }}
                className="button-secondary"
              >
                Отмена
              </button>
            </div>

            {searchQuery.length < 2 ? (
              <p className="search-hint">Введите минимум 2 символа для поиска</p>
            ) : searchLoading ? (
              <p>Поиск...</p>
            ) : availableUsers.length === 0 ? (
              <p className="no-results">Пользователи не найдены</p>
            ) : (
              <div className="user-search-results">
                {availableUsers.map((user) => (
                  <UserSearchResult
                    key={user.id}
                    user={user}
                    onAdd={() => handleAddMember(user.id)}
                    isAdding={addMemberMutation.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {}
        <div className="members-list">
          <h4>Участники ({members.length})</h4>
          {members.length === 0 ? (
            <p className="empty-members">В группе пока нет участников</p>
          ) : (
            <div className="members-grid">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isCreator={isCreator}
                  isCurrentUser={member.id === currentUser?.id}
                  onRemove={() => handleRemoveMember(member.id)}
                  isRemoving={removeMemberMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface UserSearchResultProps {
  user: UserPublic
  onAdd: () => void
  isAdding: boolean
}

function UserSearchResult({ user, onAdd, isAdding }: UserSearchResultProps) {
  return (
    <div className="user-search-result">
      <div className="user-info">
        {getSafeImageUrl(user.avatar_url) ? (
          <img src={getSafeImageUrl(user.avatar_url)!} alt={user.username} className="user-avatar-small" />
        ) : (
          <div className="user-avatar-placeholder-small">
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="user-name">{user.full_name || user.username}</div>
          <div className="user-username">@{user.username}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="button-primary button-small"
        disabled={isAdding}
      >
        {isAdding ? 'Добавление...' : 'Добавить'}
      </button>
    </div>
  )
}

interface MemberCardProps {
  member: { id: string; username: string; full_name?: string; avatar_url?: string }
  isCreator: boolean
  isCurrentUser: boolean
  onRemove: () => void
  isRemoving: boolean
}

function MemberCard({ member, isCreator, isCurrentUser, onRemove, isRemoving }: MemberCardProps) {
  const canRemove = isCreator || isCurrentUser

  return (
    <div className="member-card">
      <div className="member-info">
        {getSafeImageUrl(member.avatar_url) ? (
          <img src={getSafeImageUrl(member.avatar_url)!} alt={member.username} className="member-avatar" />
        ) : (
          <div className="member-avatar-placeholder">
            {member.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <div className="member-name">{member.full_name || member.username}</div>
          <div className="member-username">@{member.username}</div>
        </div>
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="button-icon button-danger"
          disabled={isRemoving}
          title={isCurrentUser ? 'Покинуть группу' : 'Удалить участника'}
        >
          ✕
        </button>
      )}
    </div>
  )
}

