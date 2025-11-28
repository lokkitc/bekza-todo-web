import './HomePage.css'
import { useAuth } from '@/features/auth/context/AuthContext'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <div className="home-page-content">
        <h1>Добро пожаловать в Bekza Todo!</h1>
        {user && (
          <p className="home-page-greeting">
            Привет, {user.full_name || user.username || user.email}!
          </p>
        )}
        <p className="home-page-description">
          Это ваша главная страница. Здесь вы можете управлять своими задачами и группами.
        </p>
        <div className="home-page-actions">
          <p>Начните работу, перейдя в раздел "Задачи" в меню слева.</p>
        </div>
      </div>
    </div>
  )
}

