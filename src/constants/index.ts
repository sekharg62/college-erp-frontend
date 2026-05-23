export { SITE_CONFIG, type SiteConfig } from './siteConfig'

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  TOKEN_TYPE: 'tokenType',
  ADMIN_USER: 'adminUser',
  TEACHER_ACCESS_TOKEN: 'teacherAccessToken',
  TEACHER_TOKEN_TYPE: 'teacherTokenType',
  TEACHER_USER: 'teacherUser',
  STUDENT_ACCESS_TOKEN: 'studentAccessToken',
  STUDENT_TOKEN_TYPE: 'studentTokenType',
  STUDENT_USER: 'studentUser',
} as const


export const studentActivitySubmissionStatus = [
  {
    label: 'Pending',
    value: 'PENDING',
  },
  {
    label: 'Approved',
    value: 'APPROVED',
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
  },
] as const

export type StudentActivitySubmissionStatusValue =
  (typeof studentActivitySubmissionStatus)[number]['value']

export const ACADEMIC_YEARS = ['1', '2', '3', '4'] as const
export type AcademicYear = (typeof ACADEMIC_YEARS)[number]