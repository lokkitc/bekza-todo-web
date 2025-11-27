import type { ThemeMode } from './theme'

export interface ColorPalette {
  background: string
  backgroundMuted: string
  surface: string
  surfaceAlt: string
  text: string
  textMuted: string
  border: string
  accent: string
  accentHover: string
  success: string
  danger: string
  warning: string
}

export const COLORS: Record<ThemeMode, ColorPalette> = {
  light: {
    background: '#f5f6fa',
    backgroundMuted: '#e5e7eb',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    text: '#0f172a',
    textMuted: '#475569',
    border: '#e2e8f0',
    accent: '#6366f1',
    accentHover: '#4f46e5',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  dark: {
    background: '#0b1120',
    backgroundMuted: '#111827',
    surface: '#111827',
    surfaceAlt: '#1f2937',
    text: '#f8fafc',
    textMuted: '#cbd5f5',
    border: '#1f2937',
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    success: '#34d399',
    danger: '#f87171',
    warning: '#fbbf24',
  },
} as const

