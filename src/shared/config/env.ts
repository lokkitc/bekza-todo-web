// Константы для API URL
export const API_URLS = {
  DEVELOPMENT: 'http://127.0.0.1:8000/api/v1',
  PRODUCTION: 'https://bekza-todo-api-866428924028.us-central1.run.app/api/v1',
} as const

const FALLBACK_API_BASE_URL = API_URLS.DEVELOPMENT

export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL?.replace(/\/$/, '') || FALLBACK_API_BASE_URL

