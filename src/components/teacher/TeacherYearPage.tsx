import type { AcademicYear } from '../../constants'
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  getSubmissionsFromStudent,
  getTeacherStudentsActivitySubmits,
  type StudentActivitySubmit,
  type TeacherStudentWithSubmissions,
} from '../../services/studentActivitySubmit'
import { useTheme } from '../../context/ThemeContext'
import { getErrorMessage } from '../../utils/getErrorMessage'

type TeacherYearPageProps = {
  yearTitle: string
  academicYear: AcademicYear
}

function statusClass(status: StudentActivitySubmit['status'], theme: 'dark' | 'light') {
  if (status === 'APPROVED') {
    return theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
  }
  if (status === 'REJECTED') {
    return theme === 'dark' ? 'text-red-400' : 'text-red-600'
  }
  return theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
}

export default function TeacherYearPage({
  yearTitle,
  academicYear,
}: TeacherYearPageProps) {
  const { theme } = useTheme()
  const [students, setStudents] = useState<TeacherStudentWithSubmissions[]>([])
  const [loading, setLoading] = useState(true)

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const studentHeaderClass =
    theme === 'dark' ? 'bg-slate-800/30' : 'bg-slate-50/80'

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await getTeacherStudentsActivitySubmits(academicYear)
        if (!cancelled) setStudents(data)
      } catch (error) {
        if (!cancelled) {
          toast.error(
            getErrorMessage(error, 'Failed to load student submissions'),
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [academicYear])

  const { submissionCount, totalPoints } = useMemo(() => {
    let count = 0
    let points = 0
    for (const student of students) {
      const items = getSubmissionsFromStudent(student)
      count += items.length
      points += items.reduce((sum, item) => sum + item.points, 0)
    }
    return { submissionCount: count, totalPoints: points }
  }, [students])

  const studentsWithSubmissions = useMemo(
    () => students.filter((s) => getSubmissionsFromStudent(s).length > 0),
    [students],
  )

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex shrink-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
          <BookOpen size={16} aria-hidden />
        </div>
        <h1 className="text-base font-semibold tracking-tight sm:text-lg">
          {yearTitle}
        </h1>
        <span className={`hidden text-xs sm:inline ${mutedClass}`}>
          Student activity submissions
        </span>
      </div>

      <div className={`overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}>
        {loading ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin text-amber-500" />
            Loading students…
          </div>
        ) : students.length === 0 ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            No students found for {yearTitle}.
          </div>
        ) : (
          <>
            <div
              className={`border-b px-4 py-3 text-sm ${tableRowClass} ${mutedClass}`}
            >
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {students.length}
              </span>{' '}
              student{students.length === 1 ? '' : 's'} ·{' '}
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {submissionCount}
              </span>{' '}
              submission{submissionCount === 1 ? '' : 's'} ·{' '}
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {totalPoints}
              </span>{' '}
              total points
            </div>

            {studentsWithSubmissions.length === 0 ? (
              <div className={`px-4 py-12 text-center text-sm ${mutedClass}`}>
                Students are listed but none have submitted activities for {yearTitle}{' '}
                yet.
              </div>
            ) : (
              <div className="divide-y">
                {studentsWithSubmissions.map((student) => {
                  const items = getSubmissionsFromStudent(student)
                  const studentPoints = items.reduce(
                    (sum, item) => sum + item.points,
                    0,
                  )

                  return (
                    <Fragment key={student.id}>
                      <div
                        className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 ${studentHeaderClass} ${tableRowClass}`}
                      >
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className={`text-xs ${mutedClass}`}>
                            Roll: {student.rollNo}
                            {student.admissionYear
                              ? ` · Admission: ${student.admissionYear}`
                              : ''}
                          </p>
                        </div>
                        <p className={`text-xs font-medium ${mutedClass}`}>
                          {items.length} submission{items.length === 1 ? '' : 's'} ·{' '}
                          {studentPoints} pts
                        </p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-3xl text-left text-sm">
                          <thead>
                            <tr
                              className={`border-b ${tableRowClass} ${tableHeadClass}`}
                            >
                              <th className="px-3 py-2 font-medium">Activity</th>
                              <th className="px-3 py-2 font-medium">Sub-activity</th>
                              <th className="px-3 py-2 text-center font-medium">
                                Points
                              </th>
                              <th className="px-3 py-2 font-medium">Status</th>
                              <th className="px-3 py-2 font-medium">Proof</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map((item) => (
                              <tr
                                key={item.id}
                                className={`border-b last:border-b-0 ${tableRowClass}`}
                              >
                                <td className="px-3 py-2 font-medium">
                                  {item.activityId}
                                </td>
                                <td className={`px-3 py-2 ${mutedClass}`}>
                                  {item.subActivityId}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {item.points}
                                </td>
                                <td className="px-3 py-2">
                                  <span
                                    className={statusClass(item.status, theme)}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <a
                                    href={item.proofUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-amber-600 underline hover:text-amber-500 dark:text-amber-400"
                                  >
                                    View
                                    <ExternalLink size={14} />
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Fragment>
                  )
                })}
              </div>
            )}

            {students.length > studentsWithSubmissions.length && (
              <p className={`border-t px-4 py-3 text-xs ${mutedClass} ${tableRowClass}`}>
                {students.length - studentsWithSubmissions.length} student(s) with no
                submissions for this year.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
