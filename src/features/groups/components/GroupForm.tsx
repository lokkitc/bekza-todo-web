import { useState, useEffect } from 'react'
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from '@/features/groups/api'
import type { Group, GroupCreateRequest, GroupUpdateRequest } from '@/shared/types'
import './GroupForm.css'

interface GroupFormProps {
  group?: Group
  onSuccess: () => void
  onCancel: () => void
}

export function GroupForm({ group, onSuccess, onCancel }: GroupFormProps) {
  const isEditing = !!group
  const createMutation = useCreateGroupMutation()
  const updateMutation = useUpdateGroupMutation()

  const [formData, setFormData] = useState<GroupCreateRequest>({
    name: '',
    description: '',
    color: '',
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name,
        description: group.description || '',
        color: group.color || '',
      })
    }
  }, [group])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      setError('Название группы обязательно')
      return
    }

    
    let validatedColor: string | undefined = formData.color?.trim()
    if (validatedColor) {
      
      validatedColor = validatedColor.replace(/^#/, '')
      if (!/^[0-9A-Fa-f]{6}$/.test(validatedColor)) {
        setError('Цвет должен быть в формате hex (например: #6366f1 или 6366f1)')
        return
      }
      validatedColor = `#${validatedColor}`
    } else {
      validatedColor = undefined
    }

    try {
      if (isEditing && group) {
        const updatePayload: GroupUpdateRequest = {
          name: trimmedName,
          description: formData.description?.trim() || undefined,
          color: validatedColor,
        }
        await updateMutation.mutateAsync({ groupId: group.id, payload: updatePayload })
      } else {
        const createPayload: GroupCreateRequest = {
          name: trimmedName,
          description: formData.description?.trim() || undefined,
          color: validatedColor,
        }
        await createMutation.mutateAsync(createPayload)
      }
      onSuccess()
    } catch (err) {
      let message = 'Ошибка сохранения группы'
      if (err instanceof Error) {
        message = err.message
        
        if (message.includes('422') || message.includes('validation')) {
          message = 'Проверьте правильность заполнения полей. ' + message
        }
      }
      setError(message)
    }
  }

  const handleChange = (field: keyof GroupCreateRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="group-form">
      <div className="group-form-header">
        <h3>{isEditing ? 'Редактировать группу' : 'Создать группу'}</h3>
      </div>

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Название *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
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
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="color" className="form-label">
          Цвет (hex)
        </label>
        <div className="color-input-group">
          <input
            id="color"
            type="color"
            value={formData.color || '#6366f1'}
            onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
            className="form-color-input"
            disabled={isLoading}
          />
          <input
            type="text"
            value={formData.color}
            onChange={handleChange('color')}
            className="form-input"
            placeholder="#6366f1"
            disabled={isLoading}
            pattern="^#[0-9A-Fa-f]{6}$"
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

