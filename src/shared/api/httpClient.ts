import { API_BASE_URL } from '@/shared/config/env'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type QueryParams = Record<string, number | string | boolean | undefined>

export interface ApiRequestConfig<TBody = unknown> {
  path: string
  method?: HttpMethod
  body?: TBody
  params?: QueryParams
  headers?: HeadersInit
}

interface HttpClientOptions {
  baseUrl: string
  getToken?: () => string | null
  onUnauthorized?: () => void
}

export class HttpClient {
  private readonly options: HttpClientOptions

  constructor(options: HttpClientOptions) {
    this.options = options
  }

  async request<TResponse, TBody = unknown>(config: ApiRequestConfig<TBody>): Promise<TResponse> {
    const { path, method = 'GET', body, params, headers } = config
    const url = new URL(path, this.options.baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return
        }
        url.searchParams.append(key, String(value))
      })
    }

    const token = this.options.getToken?.()
    
    // Определяем, нужно ли отправлять как form-data
    const isFormData = body instanceof URLSearchParams
    const contentType = isFormData ? 'application/x-www-form-urlencoded' : 'application/json'
    
    const response = await fetch(url, {
      method,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': contentType }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      // Обработка 401 Unauthorized - автоматический logout
      if (response.status === 401) {
        // Вызываем callback для logout
        this.options.onUnauthorized?.()
        // Не бросаем ошибку для запросов, которые не требуют авторизации
        // Но для защищенных endpoints это вызовет редирект через ProtectedRoute
      }

      let errorMessage = `Request failed with status ${response.status}`
      try {
        const errorData = await response.json()
        // FastAPI возвращает ошибки в формате {detail: "..."} или {detail: [...]}
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ')
          } else {
            errorMessage = String(errorData.detail)
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        // Если не JSON, пробуем текст
        const errorText = await response.text()
        if (errorText) {
          errorMessage = errorText
        }
      }
      const error = new Error(errorMessage)
      ;(error as any).status = response.status
      ;(error as any).response = response
      throw error
    }

    if (response.status === 204) {
      return undefined as TResponse
    }

    return (await response.json()) as TResponse
  }

  get<TResponse>(path: string, params?: ApiRequestConfig['params']) {
    return this.request<TResponse>({ path, method: 'GET', params })
  }

  post<TResponse, TBody = unknown>(path: string, body?: TBody) {
    return this.request<TResponse, TBody>({ path, method: 'POST', body })
  }

  postForm<TResponse>(path: string, formData: URLSearchParams) {
    return this.request<TResponse>({
      path,
      method: 'POST',
      body: formData as any,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  put<TResponse, TBody = unknown>(path: string, body?: TBody) {
    return this.request<TResponse, TBody>({ path, method: 'PUT', body })
  }

  patch<TResponse, TBody = unknown>(path: string, body?: TBody) {
    return this.request<TResponse, TBody>({ path, method: 'PATCH', body })
  }

  delete<TResponse>(path: string) {
    return this.request<TResponse>({ path, method: 'DELETE' })
  }

  async uploadFile<TResponse>(path: string, file: File): Promise<TResponse> {
    const url = new URL(path, this.options.baseUrl)
    const token = this.options.getToken?.()
    
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    if (!response.ok) {
      if (response.status === 401) {
        this.options.onUnauthorized?.()
      }

      let errorMessage = `Upload failed with status ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((err: any) => err.msg || JSON.stringify(err)).join(', ')
          } else {
            errorMessage = String(errorData.detail)
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } catch {
        const errorText = await response.text()
        if (errorText) {
          errorMessage = errorText
        }
      }
      const error = new Error(errorMessage)
      ;(error as any).status = response.status
      ;(error as any).response = response
      throw error
    }

    return (await response.json()) as TResponse
  }
}

// Создаем apiClient с базовой конфигурацией
// onUnauthorized будет установлен в AppProviders
let logoutCallback: (() => void) | undefined

export function setupApiClientLogout(callback: () => void) {
  logoutCallback = callback
}

export const apiClient = new HttpClient({
  baseUrl: API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`,
  getToken: () => localStorage.getItem('access_token'),
  onUnauthorized: () => {
    logoutCallback?.()
  },
})

