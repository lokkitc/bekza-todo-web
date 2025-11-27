import './HomePage.css'
import { useMemo } from 'react'
import { COLORS } from '@/shared/constants/colors'
import { SPACING } from '@/shared/constants/spacing'
import { FONTS } from '@/shared/constants/fonts'
import { RADIUS } from '@/shared/constants/radius'
import { BREAKPOINTS } from '@/shared/constants/breakpoints'
import { LAYOUT } from '@/shared/constants/layout'
import { Z_INDEX } from '@/shared/constants/zindex'
import { useTheme } from '@/shared/theme'

export function HomePage() {
  const { mode } = useTheme()

  const palette = useMemo(() => COLORS[mode], [mode])

  return (
    <div className="home-grid">
      <section className="home-card home-hero">
        <div>
          <p className="home-eyebrow">Design System</p>
          <h1>Токены интерфейса Bekza Todo</h1>
          <p>
            Единая палитра, типографика, отступы и сетка. Тема переключается мгновенно, без
            перезагрузки, а layout остаётся общим для всех страниц.
          </p>
        </div>
        <div className="hero-badges">
          <span>Тема: {mode === 'light' ? 'Light' : 'Dark'}</span>
          <span>Breakpoint ≥ {BREAKPOINTS.tablet}px</span>
          <span>Sidebar {LAYOUT.sidebarWidth}px</span>
        </div>
      </section>

      <section className="home-card">
        <header>
          <h2>Palette</h2>
          <p>Светлая и тёмная палитры синхронизированы между собой.</p>
        </header>
        <div className="palette-grid">
          {Object.entries(palette).map(([token, value]) => (
            <div key={token} className="palette-swatch">
              <span className="swatch-color" style={{ backgroundColor: value }} />
              <div>
                <p className="token-name">{token}</p>
                <p className="token-value">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-card">
        <header>
          <h2>Spacing</h2>
          <p>Все отступы вынесены в константы и экспортируются в CSS переменные.</p>
        </header>
        <div className="spacing-row">
          {Object.entries(SPACING).map(([token, value]) => (
            <div key={token} className="spacing-item">
              <span style={{ width: `${value}px` }} />
              <p>{token}</p>
              <p>{value}px</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-card two-columns">
        <div>
          <h2>Типографика</h2>
          <p>
            Базовый шрифт: <strong>{FONTS.family.base}</strong>
          </p>
          <ul className="list">
            {Object.entries(FONTS.size).map(([token, value]) => (
              <li key={token}>
                <span>{token}</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Радиус / Z-index</h2>
          <ul className="list">
            {Object.entries(RADIUS).map(([token, value]) => (
              <li key={token}>
                <span>{token}</span>
                <span>{value}px</span>
              </li>
            ))}
          </ul>
          <ul className="list">
            {Object.entries(Z_INDEX).map(([token, value]) => (
              <li key={token}>
                <span>Z {token}</span>
                <span>{value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-card">
        <header>
          <h2>Layout baseline</h2>
          <p>Sidebar {LAYOUT.sidebarWidth}px → {LAYOUT.sidebarCollapsedWidth}px, header {LAYOUT.headerHeight}px.</p>
        </header>
        <div className="layout-demo">
          <div className="sidebar-demo">Sidebar</div>
          <div className="content-demo">
            <div className="header-demo">Header</div>
            <div className="body-demo">Content area</div>
          </div>
        </div>
      </section>
    </div>
  )
}

