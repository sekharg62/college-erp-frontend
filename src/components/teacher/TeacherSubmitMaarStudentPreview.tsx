import { ClipboardList } from 'lucide-react'
import CopyBox from '../uis/CopyBox'
import ProofUrlField from '../uis/ProofUrlField'
import StatusBadge from '../uis/StatusBadge'
import { useTheme } from '../../context/ThemeContext'
import { getStudentOverallSubmissionStatus } from '../../utils/getStudentOverallSubmissionStatus'
import type { GroupedStudentWithActivities } from '../../utils/groupActivitySubmissionsByStudent'

type TeacherSubmitMaarStudentPreviewProps = {
  eligibleStudents: GroupedStudentWithActivities[]
  yearLabel: string
}

export default function TeacherSubmitMaarStudentPreview({
  eligibleStudents,
  yearLabel,
}: TeacherSubmitMaarStudentPreviewProps) {
  const { theme } = useTheme()

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const activityRows = eligibleStudents.flatMap((student) =>
    student.activities.length > 0
      ? student.activities.map((activity) => ({ student, activity }))
      : [],
  )

  const studentsWithoutActivities = eligibleStudents.filter(
    (s) => s.activities.length === 0,
  )

  if (eligibleStudents.length === 0) {
    return (
      <div
        className={`rounded-2xl border border-dashed px-6 py-10 text-center shadow-sm ${cardClass}`}
      >
        <p className={`text-sm ${mutedClass}`}>
          Check <span className="font-medium">Eligible</span> on a student to add them
          here with their activities.
        </p>
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}>
      <div className="border-b px-4 py-3 sm:px-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
            <ClipboardList size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold sm:text-lg">Preview</h2>
            <p className={`text-sm ${mutedClass}`}>
              {eligibleStudents.length} student
              {eligibleStudents.length === 1 ? '' : 's'} marked eligible · {yearLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl text-left text-sm">
          <thead>
            <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
              <th className="px-4 py-3 font-semibold">Student</th>
              <th className="px-4 py-3 font-semibold">Roll no</th>
              <th className="px-4 py-3 font-semibold">Overall</th>
              <th className="px-4 py-3 font-semibold">Activity</th>
              <th className="px-4 py-3 font-semibold">Sub-activity</th>
              <th className="px-4 py-3 text-center font-semibold">Points</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Proof</th>
            </tr>
          </thead>
          <tbody>
            {studentsWithoutActivities.map((student) => {
              const overallStatus = getStudentOverallSubmissionStatus(
                student.activities,
              )
              return (
                <tr
                  key={`${student.id}-empty`}
                  className={`border-b ${tableRowClass}`}
                >
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3">
                    <CopyBox value={student.rollNo} maxLength={14} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={overallStatus} />
                  </td>
                  <td colSpan={5} className={`px-4 py-3 italic ${mutedClass}`}>
                    No activities submitted
                  </td>
                </tr>
              )
            })}
            {activityRows.map(({ student, activity }) => {
              const overallStatus = getStudentOverallSubmissionStatus(
                student.activities,
              )
              return (
                <tr
                  key={activity.id}
                  className={`border-b last:border-b-0 ${tableRowClass}`}
                >
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3">
                    <CopyBox value={student.rollNo} maxLength={14} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={overallStatus} />
                  </td>
                  <td className="px-4 py-3 font-medium">{activity.activityId}</td>
                  <td className={`px-4 py-3 ${mutedClass}`}>
                    {activity.subActivityId}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {activity.points}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={activity.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ProofUrlField
                      proofUrl={activity.proofUrl}
                      previewTitle={`Proof · ${student.name}`}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
