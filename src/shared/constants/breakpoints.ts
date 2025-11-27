export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1200,
} as const

export type BreakpointKey = keyof typeof BREAKPOINTS

