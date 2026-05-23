import type {
  StudentActivitySubmit,
  TeacherActivitySubmitRow,
} from '../services/studentActivitySubmit'

export type GroupedStudentWithActivities = {
  id: string
  name: string
  rollNo: string
  phoneNo: string | null
  admissionYear: string
  activities: StudentActivitySubmit[]
}

export function groupActivitySubmissionsByStudent(
  rows: TeacherActivitySubmitRow[],
): GroupedStudentWithActivities[] {
  const byStudentId = new Map<string, GroupedStudentWithActivities>()

  for (const row of rows) {
    const student = row.student
    const studentId = student.id

    const existing = byStudentId.get(studentId)
    const { student: _student, ...activity } = row

    if (existing) {
      existing.activities.push(activity)
    } else {
      byStudentId.set(studentId, {
        id: student.id,
        name: student.name,
        rollNo: student.rollNo,
        phoneNo: student.phoneNo,
        admissionYear: student.admissionYear,
        activities: [activity],
      })
    }
  }

  return [...byStudentId.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
  )
}
