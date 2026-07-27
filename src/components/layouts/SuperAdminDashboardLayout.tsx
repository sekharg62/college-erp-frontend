import { BookOpen, Calendar, GraduationCap, LayoutDashboard } from 'lucide-react'
import { useSuperAdminAuth } from '../../context/SuperAdminAuthContext'
import DashboardLayout, { type DashboardNavItem } from './DashboardLayout'

const navItems: readonly DashboardNavItem[] = [
  {
    to: '/superadmin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/superadmin/dashboard/department',
    label: 'Departments',
    icon: GraduationCap,
    end: true,
  },
  {
    to: '/superadmin/dashboard/semester',
    label: 'Semesters',
    icon: Calendar,
    end: true,
  },
  {
    to: '/superadmin/dashboard/subject',
    label: 'Subjects',
    icon: BookOpen,
    end: true,
  },
]

export default function SuperAdminDashboardLayout() {
  const { user, logout } = useSuperAdminAuth()

  return (
    <DashboardLayout
      portalLabel="Super Admin"
      user={user}
      onLogout={logout}
      loginPath="/superadmin/login"
      navItems={navItems}
    />
  )
}
