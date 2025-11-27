import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/widgets/MainLayout/MainLayout'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { HomePage } from '@/pages/home/HomePage'
import { DashboardPage } from '@/pages/dashboard'
import { TodoPage } from '@/pages/todo/TodoPage'
import { ProfilePage } from '@/pages/profile/ProfilePage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/todo" element={<TodoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/todo" replace />} />
      </Route>
    </Routes>
  )
}

