import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { SuperAdminAuthProvider } from './context/SuperAdminAuthContext'
import { StudentAuthProvider } from './context/StudentAuthContext'
import { TeacherAuthProvider } from './context/TeacherAuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <SuperAdminAuthProvider>
        <AdminAuthProvider>
          <TeacherAuthProvider>
            <StudentAuthProvider>
              <App />
            </StudentAuthProvider>
          </TeacherAuthProvider>
        </AdminAuthProvider>
      </SuperAdminAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
