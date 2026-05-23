import type { AcademicYear } from '../../constants'
import { BookOpen } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import TeacherStudentActivityList from './TeacherStudentActivityList'
import TeacherStudentSubmissionsToolbar from './TeacherStudentSubmissionsToolbar'
import TeacherYearPageSkeleton from './TeacherYearPageSkeleton'
import { getTeacherStudentsActivitySubmits } from '../../services/studentActivitySubmit'
import { useTheme } from '../../context/ThemeContext'
import { filterGroupedStudentsBySearch } from '../../utils/filterGroupedStudentsBySearch'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { groupActivitySubmissionsByStudent } from '../../utils/groupActivitySubmissionsByStudent'

type TeacherYearPageProps = {
  yearTitle: string
  academicYear: AcademicYear
}

export default function TeacherYearPage({
  yearTitle,
  academicYear,
}: TeacherYearPageProps) {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [rows, setRows] = useState<Awaited<
    ReturnType<typeof getTeacherStudentsActivitySubmits>
  > | null>(null)

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  useEffect(() => {
    setSearchQuery('')
  }, [academicYear])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await getTeacherStudentsActivitySubmits(academicYear)
        if (!cancelled) setRows(data)
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

  const students = useMemo(
    () => groupActivitySubmissionsByStudent(rows ?? []),
    [rows],
  )

  const filteredStudents = useMemo(
    () => filterGroupedStudentsBySearch(students, searchQuery),
    [students, searchQuery],
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

      {loading ? (
        <TeacherYearPageSkeleton />
      ) : (
        <>
          <TeacherStudentSubmissionsToolbar
            totalStudents={students.length}
            filteredStudents={filteredStudents.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <TeacherStudentActivityList
            layout="table"
            students={filteredStudents}
            emptyMessage={
              searchQuery.trim()
                ? 'No students match your search.'
                : `No submissions for ${yearTitle} yet.`
            }
          />
        </>
      )}
    </div>
  )
}
