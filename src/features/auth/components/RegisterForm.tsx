import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRegisterMutation } from '../hooks/useRegisterMutation'
import type { RegisterRequest } from '@/shared/types'
import './RegisterForm.css'

export function RegisterForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
    full_name: '',
  })
  const [error, setError] = useState<string | null>(null)

  const registerMutation = useRegisterMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.email.trim() || !formData.username.trim() || !formData.password) {
      setError('Заполните все обязательные поля')
      return
    }

    if (formData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов')
      return
    }

    try {
      await registerMutation.mutateAsync(formData)
      navigate('/')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка регистрации'
      setError(message)
    }
  }

  const handleChange = (field: keyof RegisterRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>
        <p className="auth-subtitle">Создайте новый аккаунт</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="user@example.com"
              className="form-input"
              disabled={registerMutation.isPending}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange('username')}
              placeholder="username"
              className="form-input"
              disabled={registerMutation.isPending}
              autoComplete="username"
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
              placeholder="Иван Иванов"
              className="form-input"
              disabled={registerMutation.isPending}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль *
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              className="form-input"
              disabled={registerMutation.isPending}
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="auth-button" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  )
}


