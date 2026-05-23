import { getStudentOverallSubmissionStatus } from './getStudentOverallSubmissionStatus'
import type { GroupedStudentWithActivities } from './groupActivitySubmissionsByStudent'

function includesQuery(value: string | number | null | undefined, query: string) {
  if (value == null || value === '') return false
  return String(value).toLowerCase().includes(query)
}

function studentMatchesQuery(
  student: GroupedStudentWithActivities,
  query: string,
) {
  if (
    includesQuery(student.name, query) ||
    includesQuery(student.rollNo, query) ||
    includesQuery(student.phoneNo, query) ||
    includesQuery(student.admissionYear, query) ||
    includesQuery(getStudentOverallSubmissionStatus(student.activities), query)
  ) {
    return true
  }

  return student.activities.some(
    (activity) =>
      includesQuery(activity.activityId, query) ||
      includesQuery(activity.subActivityId, query) ||
      includesQuery(activity.status, query) ||
      includesQuery(activity.proofUrl, query) ||
      includesQuery(activity.notes, query) ||
      includesQuery(activity.points, query),
  )
}

export function filterGroupedStudentsBySearch(
  students: GroupedStudentWithActivities[],
  rawQuery: string,
): GroupedStudentWithActivities[] {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return students
  return students.filter((student) => studentMatchesQuery(student, query))
}
