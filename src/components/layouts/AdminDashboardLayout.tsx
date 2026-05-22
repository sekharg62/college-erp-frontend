import { GraduationCap, LayoutDashboard, Users } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext'
import DashboardLayout, { type DashboardNavItem } from './DashboardLayout'

const navItems: readonly DashboardNavItem[] = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  {
    to: '/admin/dashboard/department',
    label: 'Departments',
    icon: GraduationCap,
    end: true,
  },
  {
    to: '/admin/dashboard/teacher',
    label: 'Teachers',
    icon: Users,
    end: true,
  },
]

export default function AdminDashboardLayout() {
  const { user, logout } = useAdminAuth()

  return (
    <DashboardLayout
      portalLabel="Admin"
      user={user}
      onLogout={logout}
      loginPath="/admin/login"
      navItems={navItems}
    />
  )
}
