import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from '../hooks/useLoginMutation'
import type { LoginRequest } from '@/shared/types'
import './LoginForm.css'

export function LoginForm() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useLoginMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!identifier.trim() || !password) {
      setError('Заполните все обязательные поля')
      return
    }

    const payload: LoginRequest = {
      username: identifier.trim(),
      password,
    }

    try {
      await loginMutation.mutateAsync(payload)
      navigate('/dashboard')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка входа'
      setError(message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Вход в систему</h1>
        <p className="login-subtitle">Bekza Todo List</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-field" className="form-label">
              Email или username
            </label>
            <input
              id="login-field"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="user@example.com"
              className="form-input"
              disabled={loginMutation.isPending}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              disabled={loginMutation.isPending}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-hint">
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

