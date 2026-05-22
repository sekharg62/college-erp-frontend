import { LayoutDashboard } from 'lucide-react'
import { useTeacherAuth } from '../../context/TeacherAuthContext'
import DashboardLayout, { type DashboardNavItem } from './DashboardLayout'

const navItems: readonly DashboardNavItem[] = [
  {
    to: '/teacher/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
]

export default function TeacherDashboardLayout() {
  const { user, logout } = useTeacherAuth()

  return (
    <DashboardLayout
      portalLabel="Teacher"
      user={user}
      onLogout={logout}
      loginPath="/teacher"
      navItems={navItems}
    />
  )
}
