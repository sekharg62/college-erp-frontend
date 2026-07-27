import type { AcademicYear } from '../../constants'
import { BookOpen } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import TeacherStudentActivityList from './TeacherStudentActivityList'
import TeacherStudentSubmissionsToolbar from './TeacherStudentSubmissionsToolbar'
import TeacherYearPageSkeleton from './TeacherYearPageSkeleton'
import { getTeacherStudentsActivitySubmits } from '../../services/studentActivitySubmit'
import { useTeacherAuth } from '../../context/TeacherAuthContext'
import { useTheme } from '../../context/ThemeContext'
import { downloadAllStudentsActivityReportPdf } from '../../utils/studentActivityReportPdf/downloadAllStudentsActivityReportPdf'
import { filterGroupedStudentsBySearch } from '../../utils/filterGroupedStudentsBySearch'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { groupActivitySubmissionsByStudent } from '../../utils/groupActivitySubmissionsByStudent'

type TeacherYearPageProps = {
  yearTitle: string
  academicYear: AcademicYear
  /** Hides page header when nested (e.g. Submit MAAR year tabs) */
  embedded?: boolean
}

export default function TeacherYearPage({
  yearTitle,
  academicYear,
  embedded = false,
}: TeacherYearPageProps) {
  const { theme } = useTheme()
  const { user } = useTeacherAuth()
  const [loading, setLoading] = useState(true)
  const [exportingAllPdf, setExportingAllPdf] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [rows, setRows] = useState<Awaited<
    ReturnType<typeof getTeacherStudentsActivitySubmits>
  > | null>(null)

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  useEffect(() => {
    setSearchQuery('')
  }, [academicYear])

  const fetchSubmissions = useCallback(async (options?: { silent?: boolean }) => {
    if (!options?.silent) setLoading(true)
    try {
      const data = await getTeacherStudentsActivitySubmits(academicYear)
      setRows(data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load student submissions'))
    } finally {
      if (!options?.silent) setLoading(false)
    }
  }, [academicYear])

  useEffect(() => {
    void fetchSubmissions()
  }, [fetchSubmissions])

  const students = useMemo(
    () => groupActivitySubmissionsByStudent(rows ?? []),
    [rows],
  )

  const filteredStudents = useMemo(
    () => filterGroupedStudentsBySearch(students, searchQuery),
    [students, searchQuery],
  )

  const handleExportAllPdf = useCallback(async () => {
    if (filteredStudents.length === 0) {
      toast.error('No students to export')
      return
    }

    setExportingAllPdf(true)
    try {
      await downloadAllStudentsActivityReportPdf(filteredStudents, {
        yearLabel: yearTitle,
        teacherSignature: user?.signature ?? null,
      })
      toast.success('All students report downloaded')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to export reports'))
    } finally {
      setExportingAllPdf(false)
    }
  }, [filteredStudents, yearTitle, user?.signature])

  return (
    <div className={embedded ? 'w-full' : 'mx-auto max-w-6xl'}>
      {!embedded && (
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
      )}

      {loading ? (
        <TeacherYearPageSkeleton />
      ) : (
        <>
          <TeacherStudentSubmissionsToolbar
            totalStudents={students.length}
            filteredStudents={filteredStudents.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onExportAllPdf={() => void handleExportAllPdf()}
            exportingAllPdf={exportingAllPdf}
          />
          <TeacherStudentActivityList
            layout="table"
            students={filteredStudents}
            reportYearLabel={yearTitle}
            onApproved={() => fetchSubmissions({ silent: true })}
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
