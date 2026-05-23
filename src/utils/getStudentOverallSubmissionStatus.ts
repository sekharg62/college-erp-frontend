import type { StudentActivitySubmissionStatusValue } from '../constants'

/** Minimum approved points for overall student status to be Approved */
export const STUDENT_APPROVED_POINTS_THRESHOLD = 25

const statusAliases: Record<string, StudentActivitySubmissionStatusValue> = {
  APPROVE: 'APPROVED',
  ACCEPT: 'APPROVED',
  ACCEPTED: 'APPROVED',
  PEND: 'PENDING',
  REJECT: 'REJECTED',
  REGENT: 'REJECTED',
  DECLINED: 'REJECTED',
  DENIED: 'REJECTED',
}

export function normalizeActivitySubmissionStatus(
  raw: string,
): StudentActivitySubmissionStatusValue | null {
  const upper = String(raw ?? '').trim().toUpperCase()
  if (upper === 'PENDING' || upper === 'APPROVED' || upper === 'REJECTED') {
    return upper
  }
  return statusAliases[upper] ?? null
}

export type ActivityForOverallStatus = {
  status: string
  points: number
}

/**
 * Overall student status: Approved only when total points from
 * approved activities is ≥ 25; otherwise Pending.
 */
export function getStudentOverallSubmissionStatus(
  activities: ActivityForOverallStatus[],
): Extract<StudentActivitySubmissionStatusValue, 'APPROVED' | 'PENDING'> {
  const approvedPoints = activities.reduce((sum, activity) => {
    if (normalizeActivitySubmissionStatus(activity.status) !== 'APPROVED') {
      return sum
    }
    return sum + activity.points
  }, 0)

  if (approvedPoints >= STUDENT_APPROVED_POINTS_THRESHOLD) {
    return 'APPROVED'
  }

  return 'PENDING'
}
