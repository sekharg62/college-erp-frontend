import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { TeacherAuthProvider } from './context/TeacherAuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AdminAuthProvider>
        <TeacherAuthProvider>
          <App />
        </TeacherAuthProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
