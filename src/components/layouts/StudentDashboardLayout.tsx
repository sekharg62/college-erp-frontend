import { BookOpen, LayoutDashboard, List } from 'lucide-react'
import { useStudentAuth } from '../../context/StudentAuthContext'
import DashboardLayout, { type DashboardNavItem } from './DashboardLayout'

const navItems: readonly DashboardNavItem[] = [
  {
    to: '/student/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/student/dashboard/1st-year',
    label: '1st Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/student/dashboard/2nd-year',
    label: '2nd Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/student/dashboard/3rd-year',
    label: '3rd Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/student/dashboard/4th-year',
    label: '4th Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/student/dashboard/maar-list',
    label: 'MAAR List',
    icon: List,
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
