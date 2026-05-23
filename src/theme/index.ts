export { getButtonThemeClasses, getButtonVariantClass, type ButtonVariant } from './button'
export {
  getStudentYearActivityPageThemeClasses,
  type StudentYearActivityPageThemeClasses,
} from './studentYearActivityPage'
export { getFormThemeClasses } from './form'
export { getLayoutThemeClasses } from './layout'
export { getTableThemeClasses } from './table'
export { useStudentYearActivityPageTheme } from './useStudentYearActivityPageTheme'

/** @deprecated Use useStudentYearActivityPageTheme */
export { useStudentYearActivityPageTheme as useStudentFirstYearPageTheme } from './useStudentYearActivityPageTheme'

/** @deprecated Use getStudentYearActivityPageThemeClasses */
export {
  getStudentYearActivityPageThemeClasses as getStudentFirstYearPageThemeClasses,
  type StudentYearActivityPageThemeClasses as StudentFirstYearPageThemeClasses,
} from './studentYearActivityPage'
