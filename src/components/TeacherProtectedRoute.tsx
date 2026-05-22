import { Navigate, Outlet } from 'react-router-dom'
import { useTeacherAuth } from '../context/TeacherAuthContext'

export default function TeacherProtectedRoute() {
  const { isAuthenticated } = useTeacherAuth()

  if (!isAuthenticated) {
    return <Navigate to="/teacher" replace />
  }

  return <Outlet />
}
