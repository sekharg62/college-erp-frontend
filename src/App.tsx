import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import Nav from './components/Nav'
import { useTheme } from './context/ThemeContext'
import AdminPage from './pages/AdminPage'
import StudentPage from './pages/StudentPage'
import TeacherPage from './pages/TeacherPage'

function App() {
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <Toaster theme={theme} richColors closeButton position="top-right" />
      <Nav />

      <Routes>
        <Route path="/student" element={<StudentPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
