import { Send, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import TeacherSubmitMaarStudentPreview from '../../components/teacher/TeacherSubmitMaarStudentPreview'
import TeacherSubmitMaarStudentTable from '../../components/teacher/TeacherSubmitMaarStudentTable'
import TeacherStudentSubmissionsToolbar from '../../components/teacher/TeacherStudentSubmissionsToolbar'
import TeacherYearPageSkeleton from '../../components/teacher/TeacherYearPageSkeleton'
import Button from '../../components/uis/Button'
import { ACADEMIC_YEARS, type AcademicYear } from '../../constants'
import { useTheme } from '../../context/ThemeContext'
import { getTeacherStudentsActivitySubmits } from '../../services/studentActivitySubmit'
import { filterGroupedStudentsBySearch } from '../../utils/filterGroupedStudentsBySearch'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { groupActivitySubmissionsByStudent } from '../../utils/groupActivitySubmissionsByStudent'
import { dispatchMaarAutoSubmit } from '../../utils/maarAutoSubmitBridge'

const YEAR_LABELS: Record<AcademicYear, string> = {
  '1': '1st Year',
  '2': '2nd Year',
  '3': '3rd Year',
  '4': '4th Year',
}

export default function TeacherSubmitMaarPage() {
  const { theme } = useTheme()
  const [academicYear, setAcademicYear] = useState<AcademicYear>('1')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [rows, setRows] = useState<Awaited<
    ReturnType<typeof getTeacherStudentsActivitySubmits>
  > | null>(null)
  const [eligibleStudentIds, setEligibleStudentIds] = useState<Set<string>>(
    () => new Set(),
  )

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const tabClass = (active: boolean) => {
    if (active) {
      return theme === 'dark'
        ? 'border-amber-500/50 bg-amber-500/15 text-amber-300'
        : 'border-amber-500/40 bg-amber-500/10 text-amber-800'
    }
    return theme === 'dark'
      ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:bg-slate-800/50'
      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
  }

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTeacherStudentsActivitySubmits(academicYear)
      setRows(data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load students'))
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [academicYear])

  useEffect(() => {
    void fetchSubmissions()
  }, [fetchSubmissions])

  useEffect(() => {
    setSearchQuery('')
    setEligibleStudentIds(new Set())
  }, [academicYear])

  const students = useMemo(
    () => groupActivitySubmissionsByStudent(rows ?? []),
    [rows],
  )

  const filteredStudents = useMemo(
    () => filterGroupedStudentsBySearch(students, searchQuery),
    [students, searchQuery],
  )

  const eligibleStudents = useMemo(
    () => students.filter((s) => eligibleStudentIds.has(s.id)),
    [students, eligibleStudentIds],
  )

  const handleToggleEligible = (studentId: string, checked: boolean) => {
    setEligibleStudentIds((prev) => {
      const next = new Set(prev)
      if (checked) next.add(studentId)
      else next.delete(studentId)
      return next
    })
  }

  const canAutoSubmit = eligibleStudents.length > 0

  const handleAutoSubmit = async () => {
    if (!canAutoSubmit || submitting) return

    setSubmitting(true)
    try {
      dispatchMaarAutoSubmit(
        academicYear,
        YEAR_LABELS[academicYear],
        eligibleStudents,
      )

      toast.success(
        `Auto submit sent for ${eligibleStudents.length} student${eligibleStudents.length === 1 ? '' : 's'}. Check console (F12) for ✅ Receive data from MAAR app.`,
      )
    } catch (error) {
      toast.error(getErrorMessage(error, 'Auto submit failed'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 px-1 py-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <Send size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Submit MAAR
            </h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Check eligible students → Auto submit → extension opens MAKAUT MAR
              entries (match by roll no).
            </p>
          </div>
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Program year"
        >
          {ACADEMIC_YEARS.map((year) => (
            <button
              key={year}
              type="button"
              role="tab"
              aria-selected={academicYear === year}
              onClick={() => setAcademicYear(year)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${tabClass(academicYear === year)}`}
            >
              {YEAR_LABELS[year]}
            </button>
          ))}
        </div>
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

          <TeacherSubmitMaarStudentTable
            students={filteredStudents}
            eligibleStudentIds={eligibleStudentIds}
            onToggleEligible={handleToggleEligible}
            emptyMessage={
              searchQuery.trim()
                ? 'No students match your search.'
                : `No students for ${YEAR_LABELS[academicYear]} yet.`
            }
          />

          <TeacherSubmitMaarStudentPreview
            eligibleStudents={eligibleStudents}
            yearLabel={YEAR_LABELS[academicYear]}
          />

          <div className={`rounded-2xl border p-6 shadow-sm ${cardClass}`}>
            <h2 className="mb-1 text-lg font-semibold">Auto submit</h2>
            <p className={`mb-4 text-sm ${mutedClass}`}>
              {canAutoSubmit
                ? `Ready: ${eligibleStudents.length} student${eligibleStudents.length === 1 ? '' : 's'}. Opens DevTools (F12) to confirm ✅ Receive data from MAAR app.`
                : 'Select at least one eligible student to enable auto submit.'}
            </p>
            <Button
              type="button"
              variant="primary"
              icon={Zap}
              fullWidth
              loading={submitting}
              disabled={!canAutoSubmit}
              onClick={() => void handleAutoSubmit()}
            >
              Auto Submit
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
