import { apiClient } from './httpClient'

export interface UploadAvatarResponse {
  avatar_url: string
  message: string
}

export interface UploadHeaderBackgroundResponse {
  header_background_url: string
  message: string
}

export const UploadAPI = {
  
  uploadAvatar: async (file: File): Promise<UploadAvatarResponse> => {
    return apiClient.uploadFile<UploadAvatarResponse>('/api/v1/upload/avatar', file)
  },

  
  uploadHeaderBackground: async (file: File): Promise<UploadHeaderBackgroundResponse> => {
    return apiClient.uploadFile<UploadHeaderBackgroundResponse>('/api/v1/upload/header-background', file)
  },

  
  deleteAvatar: async (): Promise<void> => {
    return apiClient.delete('/api/v1/upload/avatar')
  },

  
  deleteHeaderBackground: async (): Promise<void> => {
    return apiClient.delete('/api/v1/upload/header-background')
  },
}

