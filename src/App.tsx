import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import DashboardLayout from './components/layouts/DashboardLayout'
import Nav from './components/Nav'
import { useTheme } from './context/ThemeContext'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import StudentPage from './pages/StudentPage'
import TeacherPage from './pages/TeacherPage'

function AppRoutes() {
  const location = useLocation()
  const hideNav =
    location.pathname.startsWith('/admin/dashboard') ||
    location.pathname === '/admin/login'

  return (
    <>
      {!hideNav && <Nav />}
      <Routes>
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route element={<AdminProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
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
