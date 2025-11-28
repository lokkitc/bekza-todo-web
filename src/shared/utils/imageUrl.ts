import { API_BASE_URL } from '@/shared/config/env'


export const IMAGE_URL_CONSTANTS = {
  
  GCS_BASE_URL: 'https://storage.googleapis.com',
  
  GCS_BUCKET: 'bekza-todo-uploads',
  
  API_IMAGE_ENDPOINT: '/api/v1/upload/image',
} as const


export function isFullUrl(url: string | null | undefined): boolean {
  if (!url) return false
  try {
    const urlObj = new URL(url.trim())
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}


export function extractFilePath(url: string | null | undefined): string | null {
  if (!url) return null
  
  
  if (!isFullUrl(url)) {
    return url.trim()
  }
  
  try {
    const urlObj = new URL(url.trim())
    const pathname = urlObj.pathname
    
    
    const parts = pathname.split('/')
    if (parts.length > 2) {
      return parts.slice(2).join('/')
    }
    
    return null
  } catch {
    return url.trim()
  }
}


export function getImageUrl(url: string | null | undefined): string | null {
  if (!url || !url.trim()) return null
  
  const trimmedUrl = url.trim()
  
  
  if (isFullUrl(trimmedUrl)) {
    return trimmedUrl
  }
  
  
  const baseUrl = API_BASE_URL.replace('/api/v1', '')
  return `${baseUrl}${IMAGE_URL_CONSTANTS.API_IMAGE_ENDPOINT}/${encodeURIComponent(trimmedUrl)}`
}


export function getSafeImageUrl(
  url: string | null | undefined,
  fallback?: string | null
): string | null {
  const imageUrl = getImageUrl(url)
  return imageUrl || fallback || null
}
