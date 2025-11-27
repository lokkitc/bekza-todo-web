import { useState, useRef } from 'react'
import {
  useUserQuery,
  useUserStatsQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from '@/features/users/api'
import { useAuth } from '@/features/auth/context/AuthContext'
import { UploadAPI } from '@/shared/api'
import { getSafeImageUrl } from '@/shared/utils/imageUrl'
import type { UserUpdateRequest } from '@/shared/types'
import './ProfilePage.css'

export function ProfilePage() {
  const { user: authUser } = useAuth()
  const { data: user, isLoading } = useUserQuery()
  const { data: stats } = useUserStatsQuery()
  const updateMutation = useUpdateUserMutation()
  const deleteMutation = useDeleteUserMutation()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UserUpdateRequest>({
    email: '',
    username: '',
    full_name: '',
    avatar_url: '',
    header_background_url: '',
    bio: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingHeader, setUploadingHeader] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const headerInputRef = useRef<HTMLInputElement>(null)

  const currentUser = user || authUser
  const displayStats = stats || user?.stats

  const handleEdit = () => {
    if (currentUser) {
      setFormData({
        email: currentUser.email || '',
        username: currentUser.username,
        full_name: currentUser.full_name || '',
        avatar_url: currentUser.avatar_url || '',
        header_background_url: currentUser.header_background_url || '',
        bio: currentUser.bio || '',
      })
      setIsEditing(true)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await updateMutation.mutateAsync(formData)
      setIsEditing(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка обновления профиля'
      setError(message)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
      return
    }

    try {
      await deleteMutation.mutateAsync()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка удаления аккаунта'
      alert(message)
    }
  }

  const handleChange = (field: keyof UserUpdateRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Валидация типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение')
      return
    }

    // Валидация размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB')
      return
    }

    setError(null)
    setUploadingAvatar(true)

    try {
      const result = await UploadAPI.uploadAvatar(file)
      setFormData((prev) => ({ ...prev, avatar_url: result.avatar_url }))
      // Обновляем пользователя в контексте
      if (currentUser) {
        updateMutation.mutate({ avatar_url: result.avatar_url })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки аватара'
      setError(message)
    } finally {
      setUploadingAvatar(false)
      if (avatarInputRef.current) {
        avatarInputRef.current.value = ''
      }
    }
  }

  const handleHeaderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Валидация типа файла
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение')
      return
    }

    // Валидация размера (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB')
      return
    }

    setError(null)
    setUploadingHeader(true)

    try {
      const result = await UploadAPI.uploadHeaderBackground(file)
      setFormData((prev) => ({ ...prev, header_background_url: result.header_background_url }))
      // Обновляем пользователя в контексте
      if (currentUser) {
        updateMutation.mutate({ header_background_url: result.header_background_url })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка загрузки header background'
      setError(message)
    } finally {
      setUploadingHeader(false)
      if (headerInputRef.current) {
        headerInputRef.current.value = ''
      }
    }
  }

  const handleDeleteAvatar = async () => {
    try {
      await UploadAPI.deleteAvatar()
      setFormData((prev) => ({ ...prev, avatar_url: '' }))
      if (currentUser) {
        updateMutation.mutate({ avatar_url: undefined })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка удаления аватара'
      setError(message)
    }
  }

  const handleDeleteHeader = async () => {
    try {
      await UploadAPI.deleteHeaderBackground()
      setFormData((prev) => ({ ...prev, header_background_url: '' }))
      if (currentUser) {
        updateMutation.mutate({ header_background_url: undefined })
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка удаления header background'
      setError(message)
    }
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <p>Загрузка...</p>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="profile-page">
        <p>Пользователь не найден</p>
      </div>
    )
  }

  const safeHeaderBgUrl = getSafeImageUrl(currentUser.header_background_url)
  const safeAvatarUrl = getSafeImageUrl(currentUser.avatar_url)

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Header Background */}
        {safeHeaderBgUrl && (
          <div
            className="profile-header-bg"
            style={{ backgroundImage: `url("${safeHeaderBgUrl}")` }}
          />
        )}

        <div className="profile-content">
          {/* Avatar */}
          <div className="profile-avatar-section">
            {safeAvatarUrl ? (
              <img
                src={safeAvatarUrl}
                alt={currentUser.username}
                className="profile-avatar"
                onError={(e) => {
                  // Если изображение не загрузилось, показываем placeholder
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const placeholder = target.nextElementSibling as HTMLElement
                  if (placeholder) {
                    placeholder.style.display = 'flex'
                  }
                }}
              />
            ) : null}
            <div
              className="profile-avatar-placeholder"
              style={{ display: safeAvatarUrl ? 'none' : 'flex' }}
            >
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <header className="profile-header">
            <div>
              <h1>{currentUser.full_name || currentUser.username}</h1>
              <p className="profile-username">@{currentUser.username}</p>
            </div>
            {!isEditing && (
              <button type="button" onClick={handleEdit} className="button-secondary">
                Редактировать
              </button>
            )}
          </header>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="form-input"
                disabled={updateMutation.isPending}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange('username')}
                className="form-input"
                disabled={updateMutation.isPending}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="full_name" className="form-label">
                Полное имя
              </label>
              <input
                id="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange('full_name')}
                className="form-input"
                disabled={updateMutation.isPending}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar" className="form-label">
                Аватар
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  ref={avatarInputRef}
                  id="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar || updateMutation.isPending}
                  style={{ display: 'none' }}
                />
                <label htmlFor="avatar" className="button-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                  {uploadingAvatar ? 'Загрузка...' : 'Выбрать файл'}
                </label>
                {formData.avatar_url && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    className="button-danger"
                    disabled={uploadingAvatar || updateMutation.isPending}
                  >
                    Удалить
                  </button>
                )}
              </div>
              {formData.avatar_url && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={formData.avatar_url}
                    alt="Avatar preview"
                    style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '50%' }}
                  />
                </div>
              )}
              <small className="form-hint">
                JPEG, PNG, WebP или GIF (максимум 5MB)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="header_background" className="form-label">
                Фоновое изображение header
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  ref={headerInputRef}
                  id="header_background"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleHeaderUpload}
                  disabled={uploadingHeader || updateMutation.isPending}
                  style={{ display: 'none' }}
                />
                <label htmlFor="header_background" className="button-secondary" style={{ cursor: 'pointer', margin: 0 }}>
                  {uploadingHeader ? 'Загрузка...' : 'Выбрать файл'}
                </label>
                {formData.header_background_url && (
                  <button
                    type="button"
                    onClick={handleDeleteHeader}
                    className="button-danger"
                    disabled={uploadingHeader || updateMutation.isPending}
                  >
                    Удалить
                  </button>
                )}
              </div>
              {formData.header_background_url && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={formData.header_background_url}
                    alt="Header background preview"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }}
                  />
                </div>
              )}
              <small className="form-hint">
                JPEG, PNG, WebP или GIF (максимум 5MB)
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                Биография
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                className="form-input"
                disabled={updateMutation.isPending}
                rows={4}
                maxLength={500}
                placeholder="Расскажите о себе..."
              />
              <small className="form-hint">{formData.bio?.length || 0}/500</small>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="button-secondary">
                Отмена
              </button>
              <button type="submit" className="button-primary" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </form>
        ) : (
          <>
            {/* Bio */}
            {currentUser.bio && (
              <div className="profile-bio">
                <p>{currentUser.bio}</p>
              </div>
            )}

            {/* Stats */}
            {displayStats && (
              <div className="profile-stats">
                <h2>Статистика</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.total_tasks}</div>
                    <div className="stat-label">Всего задач</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.completed_tasks}</div>
                    <div className="stat-label">Завершено</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.pending_tasks}</div>
                    <div className="stat-label">В ожидании</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.in_progress_tasks}</div>
                    <div className="stat-label">В работе</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.tasks_this_week}</div>
                    <div className="stat-label">За эту неделю</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.tasks_completed_this_week}</div>
                    <div className="stat-label">Завершено за неделю</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.total_groups}</div>
                    <div className="stat-label">Групп</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">{displayStats.activity_score}</div>
                    <div className="stat-label">Активность (30 дней)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Info */}
            <div className="profile-info">
              <h2>Информация</h2>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{currentUser.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Username:</span>
                <span className="info-value">{currentUser.username}</span>
              </div>
              {currentUser.full_name && (
                <div className="info-row">
                  <span className="info-label">Полное имя:</span>
                  <span className="info-value">{currentUser.full_name}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Дата регистрации:</span>
                <span className="info-value">
                  {new Date(currentUser.created_at).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </>
        )}

        {!isEditing && (
          <div className="profile-danger">
            <h3>Опасная зона</h3>
            <button
              type="button"
              onClick={handleDelete}
              className="button-danger"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Удаление...' : 'Удалить аккаунт'}
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

