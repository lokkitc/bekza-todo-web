import { API_BASE_URL } from '@/shared/config/env'

/**
 * Константы для формирования URL изображений
 */
export const IMAGE_URL_CONSTANTS = {
  // Стандартный URL Google Cloud Storage
  GCS_BASE_URL: 'https://storage.googleapis.com',
  // Bucket для загрузок
  GCS_BUCKET: 'bekza-todo-uploads',
  // API endpoint для получения изображений через прокси
  API_IMAGE_ENDPOINT: '/api/v1/upload/image',
} as const

/**
 * Проверяет, является ли строка полным URL
 */
export function isFullUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url.trim())
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

/**
 * Извлекает путь к файлу из полного URL или возвращает исходную строку
 */
export function extractFilePath(url: string | null | undefined): string | null {
  if (!url) return null
  
  // Если это уже путь (не URL), возвращаем как есть
  if (!isFullUrl(url)) {
    return url.trim()
  }
  
  try {
    const urlObj = new URL(url.trim())
    const pathname = urlObj.pathname
    
    // Извлекаем путь после bucket name
    // Формат: /bucket-name/path/to/file.jpg
    const parts = pathname.split('/')
    if (parts.length > 2) {
      return parts.slice(2).join('/')
    }
    
    return null
  } catch {
    return url.trim()
  }
}

/**
 * Формирует полный URL для изображения
 * 
 * @param url - Относительный путь или полный URL
 * @returns Полный URL для изображения
 */
export function getImageUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null
  
  const trimmedUrl = url.trim()
  
  // Если это уже полный URL (начинается с http:// или https://), возвращаем его
  if (isFullUrl(trimmedUrl)) {
    return trimmedUrl
  }
  
  // Если это путь (например, "users/.../avatar/...jpg"), используем API endpoint для проксирования
  // Это безопаснее, чем прямой доступ к GCS, так как API контролирует доступ
  const baseUrl = API_BASE_URL.replace('/api/v1', '')
  return `${baseUrl}${IMAGE_URL_CONSTANTS.API_IMAGE_ENDPOINT}/${encodeURIComponent(trimmedUrl)}`
}

/**
 * Безопасная функция для получения URL изображения с fallback
 * 
 * @param url - URL или путь к изображению
 * @param fallback - URL для fallback (например, placeholder)
 * @returns Полный URL или fallback
 */
export function getSafeImageUrl(
  url: string | null | undefined,
  fallback?: string | null
): string | null {
  const imageUrl = getImageUrl(url)
  return imageUrl || fallback || null
}
