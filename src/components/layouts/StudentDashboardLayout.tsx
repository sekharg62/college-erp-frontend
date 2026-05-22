import { LayoutDashboard } from 'lucide-react'
import { useStudentAuth } from '../../context/StudentAuthContext'
import DashboardLayout, { type DashboardNavItem } from './DashboardLayout'

const navItems: readonly DashboardNavItem[] = [
  {
    to: '/student/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
]

export default function StudentDashboardLayout() {
  const { user, logout } = useStudentAuth()

  return (
    <DashboardLayout
      portalLabel="Student"
      user={user}
      onLogout={logout}
      loginPath="/student"
      navItems={navItems}
    />
  )
}
