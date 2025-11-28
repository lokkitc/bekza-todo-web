import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { COLORS } from '@/shared/constants/colors'
import { FONTS } from '@/shared/constants/fonts'
import { SPACING } from '@/shared/constants/spacing'
import { RADIUS } from '@/shared/constants/radius'
import { BREAKPOINTS } from '@/shared/constants/breakpoints'
import { LAYOUT } from '@/shared/constants/layout'
import { Z_INDEX } from '@/shared/constants/zindex'
import { THEME_STORAGE_KEY, THEME_MODES } from '@/shared/constants/theme'
import type { ThemeMode } from '@/shared/constants/theme'

interface ThemeContextValue {
  mode: ThemeMode
  toggleTheme: () => void
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const isBrowser = typeof window !== 'undefined'

const camelToKebab = (value: string) =>
  value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

const applyStaticVariables = () => {
  if (!isBrowser) return
  const root = document.documentElement

  
  root.style.setProperty('--font-family-base', FONTS.family.base)
  root.style.setProperty('--font-family-mono', FONTS.family.mono)
  Object.entries(FONTS.size).forEach(([key, size]) => {
    root.style.setProperty(`--font-size-${camelToKebab(key)}`, size)
  })

  Object.entries(FONTS.weight).forEach(([key, weight]) => {
    root.style.setProperty(`--font-weight-${camelToKebab(key)}`, weight.toString())
  })

  Object.entries(FONTS.lineHeight).forEach(([key, value]) => {
    root.style.setProperty(`--line-height-${camelToKebab(key)}`, value.toString())
  })

  
  Object.entries(SPACING).forEach(([token, value]) => {
    root.style.setProperty(`--space-${camelToKebab(token)}`, `${value}px`)
  })

  
  Object.entries(RADIUS).forEach(([token, value]) => {
    root.style.setProperty(`--radius-${camelToKebab(token)}`, `${value}px`)
  })

  
  Object.entries(BREAKPOINTS).forEach(([token, value]) => {
    root.style.setProperty(`--breakpoint-${camelToKebab(token)}`, `${value}px`)
  })

  
  Object.entries(LAYOUT).forEach(([token, value]) => {
    root.style.setProperty(`--layout-${camelToKebab(token)}`, `${value}px`)
  })

  
  Object.entries(Z_INDEX).forEach(([token, value]) => {
    root.style.setProperty(`--zindex-${camelToKebab(token)}`, `${value}`)
  })
}

const applyThemeVariables = (mode: ThemeMode) => {
  if (!isBrowser) return
  const root = document.documentElement
  const palette = COLORS[mode]

  Object.entries(palette).forEach(([token, value]) => {
    root.style.setProperty(`--color-${camelToKebab(token)}`, value)
  })

  root.dataset.theme = mode
}

const isThemeMode = (value: string): value is ThemeMode =>
  (THEME_MODES as readonly string[]).includes(value)

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>('light')
  const staticVarsApplied = useRef(false)

  useEffect(() => {
    if (!staticVarsApplied.current) {
      applyStaticVariables()
      staticVarsApplied.current = true
    }

    if (!isBrowser) {
      return
    }

    const storedMode = localStorage.getItem(THEME_STORAGE_KEY)
    if (storedMode && isThemeMode(storedMode)) {
      setMode(storedMode)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setMode(prefersDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    applyThemeVariables(mode)
    if (isBrowser) {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    }
  }, [mode])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const value = useMemo(
    () => ({
      mode,
      setMode,
      toggleTheme,
    }),
    [mode],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

