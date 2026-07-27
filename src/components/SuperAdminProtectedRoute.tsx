import { Navigate, Outlet } from 'react-router-dom'
import { useSuperAdminAuth } from '../context/SuperAdminAuthContext'

export default function SuperAdminProtectedRoute() {
  const { isAuthenticated } = useSuperAdminAuth()

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace />
  }

  return <Outlet />
}
