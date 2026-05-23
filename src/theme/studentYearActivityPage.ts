import type { Theme } from '../context/ThemeContext'
import { getButtonThemeClasses } from './button'
import { getFormThemeClasses } from './form'
import { getLayoutThemeClasses } from './layout'
import { getTableThemeClasses } from './table'

export type StudentYearActivityPageThemeClasses = ReturnType<
  typeof getStudentYearActivityPageThemeClasses
>

export function getStudentYearActivityPageThemeClasses(theme: Theme) {
  return {
    ...getLayoutThemeClasses(theme),
    ...getTableThemeClasses(theme),
    ...getFormThemeClasses(theme),
    ...getButtonThemeClasses(theme),
  }
}
