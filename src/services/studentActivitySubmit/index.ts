import type {
  AcademicYear,
  StudentActivitySubmissionStatusValue,
} from '../../constants'
import { studentApiClient } from '../index'

const BASE = '/student-activity-submits'

/** New submissions must be PENDING (API requirement) */
export const DEFAULT_STUDENT_ACTIVITY_SUBMIT_STATUS = 'PENDING' as const

export type StudentActivitySubmitStatus = StudentActivitySubmissionStatusValue

export type StudentActivitySubmit = {
  id: string
  studentId: string
  activityId: string
  subActivityId: string
  academicYear: string
  points: number
  proofUrl: string
  status: StudentActivitySubmitStatus
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type CreateStudentActivitySubmitInput = {
  activityId: string
  subActivityId: string
  /** Program year: 1, 2, 3, or 4 */
  academicYear: AcademicYear
  points: number
  proofUrl: string
  /** Defaults to PENDING when omitted */
  status?: typeof DEFAULT_STUDENT_ACTIVITY_SUBMIT_STATUS
  notes?: string
}

export const getStudentActivitySubmits = (academicYear: AcademicYear) =>
  studentApiClient.get<StudentActivitySubmit[]>(
    `${BASE}?academicYear=${encodeURIComponent(academicYear)}`,
  )

export const createStudentActivitySubmit = ({
  status = DEFAULT_STUDENT_ACTIVITY_SUBMIT_STATUS,
  ...data
}: CreateStudentActivitySubmitInput) =>
  studentApiClient.post<StudentActivitySubmit>(BASE, {
    ...data,
    status,
  })
