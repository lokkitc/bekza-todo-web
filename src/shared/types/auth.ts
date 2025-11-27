import type { User } from './user'

export interface RegisterRequest {
  email: string
  username: string
  password: string
  full_name?: string
  avatar_url?: string
  header_background_url?: string
  bio?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenPair {
  access_token: string
  refresh_token?: string
  token_type: 'bearer'
}

export interface AuthResponse {
  user: User
  token: TokenPair
}

export interface RefreshTokenRequest {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  token_type: 'bearer'
}

