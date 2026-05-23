import { BookOpen, GraduationCap, LayoutDashboard, Upload } from 'lucide-react'
import { useTeacherAuth } from '../../context/TeacherAuthContext'
import DashboardLayout, { type DashboardNavItem } from './DashboardLayout'

const navItems: readonly DashboardNavItem[] = [
  {
    to: '/teacher/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: '/teacher/dashboard/1st-year',
    label: '1st Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/teacher/dashboard/2nd-year',
    label: '2nd Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/teacher/dashboard/3rd-year',
    label: '3rd Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/teacher/dashboard/4th-year',
    label: '4th Year',
    icon: BookOpen,
    end: true,
  },
  {
    to: '/teacher/dashboard/students',
    label: 'Students',
    icon: GraduationCap,
    end: true,
  },
  {
    to: '/teacher/dashboard/students/bulk',
    label: 'Bulk add',
    icon: Upload,
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
