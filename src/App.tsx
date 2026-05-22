import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminDashboardLayout from './components/layouts/AdminDashboardLayout'
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
import TeacherLoginPage from './pages/TeacherLoginPage'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import TeacherBulkStudentsPage from './pages/teacher/TeacherBulkStudentsPage'
import TeacherStudentsPage from './pages/teacher/TeacherStudentsPage'

function AppRoutes() {
  const location = useLocation()
  const hideNav =
    location.pathname.startsWith('/admin/dashboard') ||
    location.pathname === '/admin/login' ||
    location.pathname.startsWith('/teacher/dashboard') ||
    location.pathname === '/teacher' ||
    location.pathname.startsWith('/student/dashboard') ||
    location.pathname === '/student'

  return (
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/student" element={<StudentLoginPage />} />
        <Route path="/teacher" element={<TeacherLoginPage />} />

        <Route element={<StudentProtectedRoute />}>
          <Route element={<StudentDashboardLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          </Route>
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<TeacherProtectedRoute />}>
          <Route element={<TeacherDashboardLayout />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
            <Route
              path="/teacher/dashboard/students"
              element={<TeacherStudentsPage />}
            />
            <Route
              path="/teacher/dashboard/students/bulk"
              element={<TeacherBulkStudentsPage />}
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
