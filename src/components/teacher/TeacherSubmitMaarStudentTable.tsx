import { ChevronDown } from 'lucide-react'
import { Fragment, useState, type MouseEvent } from 'react'
import CopyBox from '../uis/CopyBox'
import StatusBadge from '../uis/StatusBadge'
import { ExpandablePanel } from '../uis/ExpandableSection'
import ProofUrlField from '../uis/ProofUrlField'
import { useTheme } from '../../context/ThemeContext'
import { getStudentOverallSubmissionStatus } from '../../utils/getStudentOverallSubmissionStatus'
import type { GroupedStudentWithActivities } from '../../utils/groupActivitySubmissionsByStudent'

type TeacherSubmitMaarStudentTableProps = {
  students: GroupedStudentWithActivities[]
  eligibleStudentIds: ReadonlySet<string>
  onToggleEligible: (studentId: string, checked: boolean) => void
  emptyMessage?: string
}

export default function TeacherSubmitMaarStudentTable({
  students,
  eligibleStudentIds,
  onToggleEligible,
  emptyMessage = 'No students found.',
}: TeacherSubmitMaarStudentTableProps) {
  const { theme } = useTheme()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const stopPropagation = (event: MouseEvent) => {
    event.stopPropagation()
  }

  if (students.length === 0) {
    return (
      <div
        className={`rounded-md border py-12 text-center text-sm shadow-sm ${cardClass} ${mutedClass}`}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-md border shadow-sm ${cardClass}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-4xl text-left text-sm">
          <thead>
            <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
              <th className="w-12 px-2 py-3 text-center font-semibold">Eligible</th>
              <th className="w-8 px-2 py-3" />
              <th className="px-3 py-3 font-semibold">Name</th>
              <th className="px-3 py-3 font-semibold">Roll no</th>
              <th className="px-3 py-3 font-semibold">Phone</th>
              <th className="px-3 py-3 text-center font-semibold">Activities</th>
              <th className="px-3 py-3 text-center font-semibold">Points</th>
              <th className="px-3 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const isOpen = expandedId === student.id
              const isEligible = eligibleStudentIds.has(student.id)
              const totalPoints = student.activities.reduce(
                (sum, item) => sum + item.points,
                0,
              )
              const overallStatus = getStudentOverallSubmissionStatus(
                student.activities,
              )

              return (
                <Fragment key={student.id}>
                  <tr
                    className={`border-b transition-colors duration-200 ${tableRowClass} ${
                      isEligible
                        ? theme === 'dark'
                          ? 'bg-emerald-500/10'
                          : 'bg-emerald-50/80'
                        : isOpen
                          ? theme === 'dark'
                            ? 'bg-amber-500/10'
                            : 'bg-amber-500/5'
                          : ''
                    }`}
                  >
                    <td className="px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isEligible}
                        onChange={(e) =>
                          onToggleEligible(student.id, e.target.checked)
                        }
                        aria-label={`${student.name} eligible to submit`}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isOpen ? null : student.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-amber-500 hover:bg-amber-500/10"
                        aria-expanded={isOpen}
                        aria-label={`${isOpen ? 'Collapse' : 'Expand'} activities for ${student.name}`}
                      >
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </td>
                    <td className="px-3 py-3 font-medium">{student.name}</td>
                    <td className="px-3 py-3" onClick={stopPropagation}>
                      <CopyBox value={student.rollNo} maxLength={12} />
                    </td>
                    <td className="px-3 py-3" onClick={stopPropagation}>
                      <CopyBox value={student.phoneNo ?? ''} maxLength={14} />
                    </td>
                    <td className="px-3 py-3 text-center font-medium">
                      {student.activities.length}
                    </td>
                    <td className="px-3 py-3 text-center font-medium text-amber-600 dark:text-amber-400">
                      {totalPoints}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={overallStatus} />
                    </td>
                  </tr>
                  <tr className={tableRowClass}>
                    <td colSpan={8} className="p-0">
                      <ExpandablePanel open={isOpen} className="bg-slate-500/5">
                        <div className="border-b px-3 py-3">
                          <p
                            className={`mb-2 text-xs font-medium uppercase tracking-wide ${mutedClass}`}
                          >
                            Activity breakdown
                          </p>
                          {student.activities.length === 0 ? (
                            <p className={`text-sm ${mutedClass}`}>No activities yet.</p>
                          ) : (
                            <table className="w-full min-w-2xl text-left text-sm">
                              <thead>
                                <tr
                                  className={`border-b ${tableRowClass} ${tableHeadClass}`}
                                >
                                  <th className="px-2 py-2 font-medium">Activity</th>
                                  <th className="px-2 py-2 font-medium">Sub</th>
                                  <th className="px-2 py-2 text-center font-medium">
                                    Pts
                                  </th>
                                  <th className="px-2 py-2 font-medium">Status</th>
                                  <th className="px-2 py-2 font-medium">Proof</th>
                                </tr>
                              </thead>
                              <tbody>
                                {student.activities.map((item) => (
                                  <tr
                                    key={item.id}
                                    className={`border-b last:border-b-0 ${tableRowClass}`}
                                  >
                                    <td className="px-2 py-2 font-medium">
                                      {item.activityId}
                                    </td>
                                    <td className={`px-2 py-2 ${mutedClass}`}>
                                      {item.subActivityId}
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                      {item.points}
                                    </td>
                                    <td className="px-2 py-2">
                                      <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-2 py-2">
                                      <ProofUrlField
                                        proofUrl={item.proofUrl}
                                        previewTitle={`Proof · ${student.name}`}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </ExpandablePanel>
                    </td>
                  </tr>
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
