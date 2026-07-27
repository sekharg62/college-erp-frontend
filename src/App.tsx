import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute'
import AdminDashboardLayout from './components/layouts/AdminDashboardLayout'
import SuperAdminDashboardLayout from './components/layouts/SuperAdminDashboardLayout'
import TeacherDashboardLayout from './components/layouts/TeacherDashboardLayout'
import StudentDashboardLayout from './components/layouts/StudentDashboardLayout'
import StudentProtectedRoute from './components/StudentProtectedRoute'
import TeacherProtectedRoute from './components/TeacherProtectedRoute'
import Nav from './components/Nav'
import { useTheme } from './context/ThemeContext'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminDepartmentPage from './pages/admin/AdminDepartmentPage'
import AdminTeacherPage from './pages/admin/AdminTeacherPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import StudentLoginPage from './pages/StudentLoginPage'
import StudentDashboardPage from './pages/student/StudentDashboardPage'
import StudentFirstYearPage from './pages/student/StudentFirstYearPage'
import StudentFourthYearPage from './pages/student/StudentFourthYearPage'
import StudentSecondYearPage from './pages/student/StudentSecondYearPage'
import MaarListPage from './pages/student/MaarListPage'
import StudentSettingsPage from './pages/student/StudentSettingsPage'
import StudentThirdYearPage from './pages/student/StudentThirdYearPage'
import TeacherLoginPage from './pages/TeacherLoginPage'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import TeacherBulkStudentsPage from './pages/teacher/TeacherBulkStudentsPage'
import TeacherFirstYearPage from './pages/teacher/TeacherFirstYearPage'
import TeacherFourthYearPage from './pages/teacher/TeacherFourthYearPage'
import TeacherSecondYearPage from './pages/teacher/TeacherSecondYearPage'
import TeacherStudentsPage from './pages/teacher/TeacherStudentsPage'
import TeacherSettingsPage from './pages/teacher/TeacherSettingsPage'
import TeacherSubmitMaarPage from './pages/teacher/TeacherSubmitMaarPage'
import TeacherThirdYearPage from './pages/teacher/TeacherThirdYearPage'
import HomePage from './pages/HomePage'
import SuperAdminLoginPage from './pages/SuperAdminLoginPage'
import SuperAdminDashboardPage from './pages/superadmin/SuperAdminDashboardPage'
import SuperAdminDepartmentPage from './pages/superadmin/SuperAdminDepartmentPage'
import SuperAdminSemesterPage from './pages/superadmin/SuperAdminSemesterPage'
import SuperAdminSubjectPage from './pages/superadmin/SuperAdminSubjectPage'

function AppRoutes() {
  const location = useLocation()
  const hideNav =
    location.pathname.startsWith('/admin/dashboard') ||
    location.pathname.startsWith('/superadmin/dashboard') ||
    location.pathname.startsWith('/teacher/dashboard') ||
    location.pathname.startsWith('/student/dashboard')

  return (
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/student" element={<StudentLoginPage />} />
        <Route path="/teacher" element={<TeacherLoginPage />} />

        <Route element={<StudentProtectedRoute />}>
          <Route element={<StudentDashboardLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
            <Route
              path="/student/dashboard/1st-year"
              element={<StudentFirstYearPage />}
            />
            <Route
              path="/student/dashboard/2nd-year"
              element={<StudentSecondYearPage />}
            />
            <Route
              path="/student/dashboard/3rd-year"
              element={<StudentThirdYearPage />}
            />
            <Route
              path="/student/dashboard/4th-year"
              element={<StudentFourthYearPage />}
            />
            <Route
              path="/student/dashboard/maar-list"
              element={<MaarListPage />}
            />
            <Route
              path="/student/dashboard/settings"
              element={<StudentSettingsPage />}
            />
          </Route>
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />

        <Route element={<TeacherProtectedRoute />}>
          <Route element={<TeacherDashboardLayout />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
            <Route
              path="/teacher/dashboard/submit-maar"
              element={<TeacherSubmitMaarPage />}
            />
            <Route
              path="/teacher/dashboard/1st-year"
              element={<TeacherFirstYearPage />}
            />
            <Route
              path="/teacher/dashboard/2nd-year"
              element={<TeacherSecondYearPage />}
            />
            <Route
              path="/teacher/dashboard/3rd-year"
              element={<TeacherThirdYearPage />}
            />
            <Route
              path="/teacher/dashboard/4th-year"
              element={<TeacherFourthYearPage />}
            />
            <Route
              path="/teacher/dashboard/students"
              element={<TeacherStudentsPage />}
            />
            <Route
              path="/teacher/dashboard/students/bulk"
              element={<TeacherBulkStudentsPage />}
            />
            <Route
              path="/teacher/dashboard/settings"
              element={<TeacherSettingsPage />}
            />
          </Route>
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminDashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route
              path="/admin/dashboard/department"
              element={<AdminDepartmentPage />}
            />
            <Route
              path="/admin/dashboard/teacher"
              element={<AdminTeacherPage />}
            />
          </Route>
        </Route>

        <Route element={<SuperAdminProtectedRoute />}>
          <Route element={<SuperAdminDashboardLayout />}>
            <Route
              path="/superadmin/dashboard"
              element={<SuperAdminDashboardPage />}
            />
            <Route
              path="/superadmin/dashboard/department"
              element={<SuperAdminDepartmentPage />}
            />
            <Route
              path="/superadmin/dashboard/semester"
              element={<SuperAdminSemesterPage />}
            />
            <Route
              path="/superadmin/dashboard/subject"
              element={<SuperAdminSubjectPage />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

function App() {
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <Toaster theme={theme} richColors closeButton position="top-right" />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
