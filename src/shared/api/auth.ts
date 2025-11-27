import { apiClient } from './httpClient'
import type {
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
} from '@/shared/types'

const AUTH_PREFIX = 'auth'

export const AuthAPI = {
  register(payload: RegisterRequest) {
    return apiClient.post<AuthResponse, RegisterRequest>(`${AUTH_PREFIX}/register`, payload)
  },
  login(payload: LoginRequest) {
    const formData = new URLSearchParams()
    formData.append('username', payload.username)
    formData.append('password', payload.password)
    return apiClient.postForm<AuthResponse>(`${AUTH_PREFIX}/login`, formData)
  },
  refresh(payload: RefreshTokenRequest) {
    return apiClient.post<RefreshTokenResponse, RefreshTokenRequest>(
      `${AUTH_PREFIX}/refresh`,
      payload,
    )
  },
  logout() {
    return apiClient.post<void>(`${AUTH_PREFIX}/logout`)
  },
}

