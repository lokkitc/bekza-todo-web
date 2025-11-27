import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { AuthAPI } from '@/shared/api/auth'
import { useAuth } from '../context/AuthContext'

export function useLogoutMutation() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      try {
        await AuthAPI.logout()
      } catch {
        // Игнорируем ошибки при logout на сервере
        // Все равно очищаем локальные данные
      }
    },
    onSuccess: () => {
      // Очищаем все кэши React Query
      queryClient.clear()
      // Выполняем logout
      logout()
      // Перенаправляем на страницу логина
      navigate('/login', { replace: true })
    },
    onError: () => {
      // Даже если сервер вернул ошибку, очищаем локальное состояние
      queryClient.clear()
      logout()
      // Перенаправляем на страницу логина
      navigate('/login', { replace: true })
    },
  })
}

