export { AUTH_STORAGE_KEYS, type UserRole } from './authStorage'
export { SITE_CONFIG, type SiteConfig } from './siteConfig'


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