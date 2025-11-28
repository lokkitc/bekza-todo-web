import './HomePage.css'
import { useAuth } from '@/features/auth/context/AuthContext'
import { useUserStatsQuery } from '@/features/users/api/useUserStatsQuery'
import { CircularProgress } from './components/CircularProgress'

function getMotivationalMessage(stats: { completed_tasks: number; total_tasks: number; activity_score: number }) {
  const completionRate = stats.total_tasks > 0 ? (stats.completed_tasks / stats.total_tasks) * 100 : 0

  if (stats.total_tasks === 0) {
    return '🎯 Начните свой путь к продуктивности! Создайте первую задачу.'
  }

  if (completionRate === 100 && stats.total_tasks > 0) {
    return '🏆 Потрясающе! Вы выполнили все задачи! Вы настоящий мастер продуктивности!'
  }

  if (completionRate >= 80) {
    return '🔥 Отличная работа! Вы на правильном пути к успеху!'
  }

  if (completionRate >= 50) {
    return '💪 Хороший прогресс! Продолжайте в том же духе!'
  }

  if (completionRate >= 25) {
    return '📈 Вы движетесь вперед! Каждый шаг важен!'
  }

  return '🌱 Начало положено! Время действовать!'
}

function getActivityLevel(score: number) {
  if (score >= 80) return { level: '🔥 Огненная', color: '#ef4444' }
  if (score >= 60) return { level: '⚡ Высокая', color: '#f59e0b' }
  if (score >= 40) return { level: '💪 Хорошая', color: '#3b82f6' }
  if (score >= 20) return { level: '📊 Средняя', color: '#8b5cf6' }
  return { level: '🌱 Начальная', color: '#10b981' }
}

export function HomePage() {
  const { user } = useAuth()
  const { data: stats, isLoading } = useUserStatsQuery()

  if (isLoading) {
    return (
      <div className="home-page">
        <div className="home-page-content">
          <p>Загрузка статистики...</p>
        </div>
      </div>
    )
  }

  const statsData = stats || {
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    in_progress_tasks: 0,
    tasks_this_week: 0,
    tasks_completed_this_week: 0,
    total_groups: 0,
    activity_score: 0,
  }

  const activityInfo = getActivityLevel(statsData.activity_score)
  const motivationalMessage = getMotivationalMessage(statsData)

  return (
    <div className="home-page">
      <div className="home-page-header">
        <div>
          <h1>Добро пожаловать{user ? `, ${user.full_name || user.username || 'друг'}` : ''}!</h1>
          <p className="home-page-subtitle">Ваша статистика продуктивности</p>
        </div>
      </div>

      <div className="home-page-stats-grid">
        {/* Основной прогресс завершенных задач */}
        <div className="home-stat-card home-stat-card-primary">
          <div className="home-stat-header">
            <h3>Общий прогресс</h3>
            <p className="home-stat-description">Выполнено задач</p>
          </div>
          <div className="home-stat-progress">
            <CircularProgress
              value={statsData.completed_tasks}
              max={statsData.total_tasks}
              size={140}
              strokeWidth={10}
              color="var(--color-accent)"
            />
            <div className="home-stat-numbers">
              <div className="home-stat-number-large">
                {statsData.completed_tasks} / {statsData.total_tasks}
              </div>
              <div className="home-stat-number-label">задач выполнено</div>
            </div>
          </div>
          <div className="home-stat-motivation">
            {motivationalMessage}
          </div>
        </div>

        {/* Прогресс за неделю */}
        <div className="home-stat-card">
          <div className="home-stat-header">
            <h3>Эта неделя</h3>
            <p className="home-stat-description">Прогресс за 7 дней</p>
          </div>
          <div className="home-stat-progress">
            <CircularProgress
              value={statsData.tasks_completed_this_week}
              max={statsData.tasks_this_week || 1}
              size={120}
              strokeWidth={8}
              color="#10b981"
            />
            <div className="home-stat-numbers">
              <div className="home-stat-number-large">
                {statsData.tasks_completed_this_week}
              </div>
              <div className="home-stat-number-label">из {statsData.tasks_this_week} задач</div>
            </div>
          </div>
        </div>

        {/* Активность */}
        <div className="home-stat-card">
          <div className="home-stat-header">
            <h3>Активность</h3>
            <p className="home-stat-description">Ваш уровень активности</p>
          </div>
          <div className="home-stat-progress">
            <CircularProgress
              value={statsData.activity_score}
              max={100}
              size={120}
              strokeWidth={8}
              color={activityInfo.color}
            />
            <div className="home-stat-numbers">
              <div className="home-stat-number-large" style={{ color: activityInfo.color }}>
                {statsData.activity_score}
              </div>
              <div className="home-stat-number-label">{activityInfo.level}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика по статусам */}
      <div className="home-page-details-grid">
        <div className="home-detail-card">
          <div className="home-detail-icon" style={{ backgroundColor: 'rgba(250, 204, 21, 0.15)', color: '#ca8a04' }}>
            ⏳
          </div>
          <div className="home-detail-content">
            <div className="home-detail-value">{statsData.pending_tasks}</div>
            <div className="home-detail-label">В ожидании</div>
          </div>
        </div>

        <div className="home-detail-card">
          <div className="home-detail-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' }}>
            🔄
          </div>
          <div className="home-detail-content">
            <div className="home-detail-value">{statsData.in_progress_tasks}</div>
            <div className="home-detail-label">В работе</div>
          </div>
        </div>

        <div className="home-detail-card">
          <div className="home-detail-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#059669' }}>
            ✅
          </div>
          <div className="home-detail-content">
            <div className="home-detail-value">{statsData.completed_tasks}</div>
            <div className="home-detail-label">Завершено</div>
          </div>
        </div>

        <div className="home-detail-card">
          <div className="home-detail-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            👥
          </div>
          <div className="home-detail-content">
            <div className="home-detail-value">{statsData.total_groups}</div>
            <div className="home-detail-label">Групп</div>
          </div>
        </div>
      </div>
    </div>
  )
}

