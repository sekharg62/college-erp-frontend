import { Navigate, Outlet } from 'react-router-dom'
import { useStudentAuth } from '../context/StudentAuthContext'

export default function StudentProtectedRoute() {
  const { isAuthenticated } = useStudentAuth()

  if (!isAuthenticated) {
    return <Navigate to="/student" replace />
  }

  return <Outlet />
}
