export const THEME_STORAGE_KEY = 'app-theme-mode'

export const THEME_MODES = ['light', 'dark'] as const

export type ThemeMode = (typeof THEME_MODES)[number]

export interface ThemeConfig {
  mode: ThemeMode
  prefersDark: boolean
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  mode: 'light',
  prefersDark: false,
}

