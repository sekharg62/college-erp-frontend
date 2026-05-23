import { useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { getStudentYearActivityPageThemeClasses } from './studentYearActivityPage'

export function useStudentYearActivityPageTheme() {
  const { theme } = useTheme()
  return useMemo(() => getStudentYearActivityPageThemeClasses(theme), [theme])
}
