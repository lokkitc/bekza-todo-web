import './MainLayout.css'
import { useState, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTheme } from '@/shared/theme'
import { useLogoutMutation } from '@/features/auth/hooks/useLogoutMutation'
import { useAuth } from '@/features/auth/context/AuthContext'
import { getSafeImageUrl } from '@/shared/utils/imageUrl'

const NAV_ITEMS = [
  // { label: 'Главная', to: '/' },
  // { label: 'Dashboard', to: '/dashboard' },
  { label: 'Задачи', to: '/todo' },
  { label: 'Профиль', to: '/profile' },
]

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { mode, toggleTheme } = useTheme()
  const { user } = useAuth()
  const logoutMutation = useLogoutMutation()

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const closeSidebarOnMobile = () => {
    setSidebarOpen(false)
  }

  // Получаем безопасный URL аватара
  const safeAvatarUrl = getSafeImageUrl(user?.avatar_url)

  const [avatarError, setAvatarError] = useState(false)

  // Сбрасываем ошибку при изменении URL аватара
  useEffect(() => {
    setAvatarError(false)
  }, [user?.avatar_url])

  return (
    <div className={`main-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">BT</div>
          <div>
            <p>Bekza Todo</p>
            <small>Design System</small>
          </div>
        </div>
        <nav className="sidebar__nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                ['nav-link', isActive ? 'nav-link--active' : ''].join(' ').trim()
              }
              onClick={closeSidebarOnMobile}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="layout-shell">
        <header className="topbar">
          <div className="topbar-levels">
          <div className="topbar__left">
            <button
              className="sidebar-toggle"
              type="button"
              aria-label="Toggle sidebar"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
            <p className="topbar__title">Интерфейс</p>
          </div>
          <div className="topbar__actions">
            <button className="theme-toggle" type="button" onClick={toggleTheme}>
              {mode === 'light' ? 'Темная тема' : 'Светлая тема'}
            </button>
            {user ? (
              <div className="user-chip">
                {safeAvatarUrl && !avatarError ? (
                  <img
                    src={safeAvatarUrl}
                    alt={user.username || 'User'}
                    className="user-chip-avatar"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="user-chip-avatar-placeholder">
                    {user.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
                <span>{user.full_name || user.username || user.email || 'Пользователь'}</span>
                <button type="button" onClick={handleLogout} disabled={logoutMutation.isPending}>
                  {logoutMutation.isPending ? '...' : 'Выйти'}
                </button>
              </div>
            ) : null}
          </div>
          
          </div>
          <div className="topbar-border">
            <div className="topbar-border-left"></div>
           
          </div>
        </header>


        <main className="layout-content">
          <div className="layout-content-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

