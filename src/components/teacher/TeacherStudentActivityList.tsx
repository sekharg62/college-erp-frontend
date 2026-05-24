import { CheckCircle2, ChevronDown, Trash2 } from 'lucide-react'
import { Fragment, useCallback, useState, type MouseEvent } from 'react'
import { toast } from 'sonner'
import { ExpandablePanel } from '../uis/ExpandableSection'
import CopyBox from '../uis/CopyBox'
import ActivityWhatsAppButton from '../uis/ActivityWhatsAppButton'
import Button from '../uis/Button'
import ProofUrlField from '../uis/ProofUrlField'
import StatusBadge from '../uis/StatusBadge'
import { useTheme } from '../../context/ThemeContext'
import { approveStudentActivitySubmits } from '../../services/studentActivitySubmit'
import { getErrorMessage } from '../../utils/getErrorMessage'
import { getStudentOverallSubmissionStatus } from '../../utils/getStudentOverallSubmissionStatus'
import type { GroupedStudentWithActivities } from '../../utils/groupActivitySubmissionsByStudent'

type TeacherStudentActivityListProps = {
  students: GroupedStudentWithActivities[]
  emptyMessage?: string
  /** Table with header row (year pages); default accordion-style rows */
  layout?: 'table' | 'accordion'
  className?: string
  /** Called after activities are approved successfully (e.g. refetch list) */
  onApproved?: () => void | Promise<void>
}

type ActivityDetailsPanelProps = {
  student: GroupedStudentWithActivities
  compact?: boolean
  selectedActivityIds: string[]
  onToggleActivity: (activityId: string, checked: boolean) => void
  onApproveSelected: () => void
  approving: boolean
  tableHeadClass: string
  tableRowClass: string
  mutedClass: string
}

function ActivityDetailsPanel({
  student,
  compact = false,
  selectedActivityIds,
  onToggleActivity,
  onApproveSelected,
  approving,
  tableHeadClass,
  tableRowClass,
  mutedClass,
}: ActivityDetailsPanelProps) {
  const selectedCount = selectedActivityIds.length

  const stopRowToggle = (event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation()
  }

  return (
    <div>
      <table className="w-full min-w-3xl text-left text-sm">
        <thead>
          <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
            <th className="w-10 px-2 py-2" />
            <th className="px-3 py-2 font-medium">Activity</th>
            <th className="px-3 py-2 font-medium">
              {compact ? 'Sub' : 'Sub-activity'}
            </th>
            <th className="px-3 py-2 text-center font-medium">
              {compact ? 'Pts' : 'Points'}
            </th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Proof</th>
            <th className="px-3 py-2 font-medium">WhatsApp</th>
            {!compact && <th className="px-3 py-2 font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {student.activities.map((item) => (
            <tr
              key={item.id}
              className={`border-b last:border-b-0 ${tableRowClass}`}
            >
              <td className="px-2 py-2 text-center">
                <input
                  type="checkbox"
                  checked={selectedActivityIds.includes(item.id)}
                  onChange={(event) =>
                    onToggleActivity(item.id, event.target.checked)
                  }
                  onClick={stopRowToggle}
                  aria-label={`Select activity ${item.activityId} ${item.subActivityId}`}
                  className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 dark:border-slate-600"
                />
              </td>
              <td className="px-3 py-2 font-medium">{item.activityId}</td>
              <td className={`px-3 py-2 ${mutedClass}`}>{item.subActivityId}</td>
              <td className="px-3 py-2 text-center">{item.points}</td>
              <td className="px-3 py-2">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-3 py-2">
                <ProofUrlField
                  proofUrl={item.proofUrl}
                  previewTitle={`Proof · Activity ${item.activityId} (${item.subActivityId})`}
                />
              </td>
              <td className="px-3 py-2">
                <ActivityWhatsAppButton
                  studentName={student.name}
                  phoneNo={student.phoneNo}
                  activityId={item.activityId}
                  subActivityId={item.subActivityId}
                  status={item.status}
                  points={item.points}
                />
              </td>
              {!compact && (
                <td className="px-3 py-2">
                  <Button
                    type="button"
                    variant="danger"
                    icon={Trash2}
                    title="Delete"
                    aria-label="Delete activity"
                    iconSize={15}
                    className="h-7! w-7! px-0! py-0!"
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex justify-end px-2 pb-1">
        <Button
          type="button"
          variant="success"
          icon={CheckCircle2}
          loading={approving}
          disabled={selectedCount === 0 || approving}
          onClick={onApproveSelected}
        >
          {approving
            ? 'Approving…'
            : `Approve${selectedCount > 0 ? ` (${selectedCount})` : ''}`}
        </Button>
      </div>
    </div>
  )
}

export default function TeacherStudentActivityList({
  students,
  emptyMessage = 'No student submissions yet.',
  layout = 'accordion',
  className = '',
  onApproved,
}: TeacherStudentActivityListProps) {
  const { theme } = useTheme()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([])
  const [approving, setApproving] = useState(false)

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const toggleActivitySelection = useCallback((activityId: string, checked: boolean) => {
    setSelectedActivityIds((previous) => {
      if (checked) {
        return previous.includes(activityId) ? previous : [...previous, activityId]
      }
      return previous.filter((id) => id !== activityId)
    })
  }, [])

  const handleApproveSelected = useCallback(async () => {
    if (selectedActivityIds.length === 0) return

    setApproving(true)
    try {
      await approveStudentActivitySubmits({ ids: selectedActivityIds })
      toast.success(
        selectedActivityIds.length === 1
          ? 'Activity approved'
          : `${selectedActivityIds.length} activities approved`,
      )
      setSelectedActivityIds([])
      await onApproved?.()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to approve activities'))
    } finally {
      setApproving(false)
    }
  }, [onApproved, selectedActivityIds])

  const activityPanelProps = {
    selectedActivityIds,
    onToggleActivity: toggleActivitySelection,
    onApproveSelected: () => void handleApproveSelected(),
    approving,
    tableHeadClass,
    tableRowClass,
    mutedClass,
  }

  if (students.length === 0) {
    return (
      <div
        className={`rounded-md border py-12 text-center text-sm shadow-sm ${cardClass} ${mutedClass} ${className}`}
      >
        {emptyMessage}
      </div>
    )
  }

  if (layout === 'table') {
    return (
      <div
        className={`overflow-hidden rounded-md border shadow-sm ${cardClass} ${className}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-4xl text-left text-sm">
            <thead>
              <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                <th className="w-8 px-2 py-3" />
                <th className="px-3 py-3 font-semibold">Name</th>
                <th className="px-3 py-3 font-semibold">Phone no</th>
                <th className="px-3 py-3 font-semibold">Roll no</th>
                <th className="px-3 py-3 font-semibold">Admission year</th>
                <th className="px-3 py-3 text-center font-semibold">
                  Total activities
                </th>
                <th className="px-3 py-3 text-center font-semibold">Total points</th>
                <th className="px-3 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const isOpen = expandedId === student.id
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
                      className={`border-b cursor-pointer transition-colors duration-300 hover:bg-amber-500/5 ${tableRowClass} ${
                        isOpen
                          ? theme === 'dark'
                            ? 'bg-amber-500/10'
                            : 'bg-amber-500/5'
                          : ''
                      }`}
                      onClick={() =>
                        setExpandedId(isOpen ? null : student.id)
                      }
                    >
                      <td className="px-2 py-3">
                        <ChevronDown
                          size={16}
                          className={`text-amber-500 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </td>
                      <td className="px-3 py-3 font-medium">{student.name}</td>
                      <td className="px-3 py-3">
                        <CopyBox value={student.phoneNo ?? ''} maxLength={14} />
                      </td>
                      <td className="px-3 py-3">
                        <CopyBox value={student.rollNo} maxLength={12} />
                      </td>
                      <td className="px-3 py-3">{student.admissionYear}</td>
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
                        <ExpandablePanel
                          open={isOpen}
                          className="bg-slate-500/5"
                        >
                          <div className="border-b px-2 py-2">
                            <ActivityDetailsPanel
                              student={student}
                              {...activityPanelProps}
                            />
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

  return (
    <div
      className={`overflow-hidden rounded-md border shadow-sm ${cardClass} ${className}`}
    >
      <div className="divide-y">
        {students.map((student) => {
          const isOpen = expandedId === student.id
          const totalPoints = student.activities.reduce(
            (sum, item) => sum + item.points,
            0,
          )

          return (
            <div key={student.id} className={tableRowClass}>
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isOpen ? null : student.id)
                }
                className={`flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 text-left transition-colors duration-300 hover:bg-amber-500/5 ${
                  theme === 'dark' ? 'hover:bg-amber-500/10' : ''
                }`}
              >
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-amber-500 transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : ''}`}
                />
                <div className="min-w-0 flex-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className={`text-[10px] font-medium uppercase ${mutedClass}`}>
                      Name
                    </p>
                    <p className="font-semibold">{student.name}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] font-medium uppercase ${mutedClass}`}>
                      Roll no
                    </p>
                    <CopyBox value={student.rollNo} maxLength={12} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-medium uppercase ${mutedClass}`}>
                      Phone
                    </p>
                    <CopyBox value={student.phoneNo ?? ''} maxLength={14} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-medium uppercase ${mutedClass}`}>
                      Admission year
                    </p>
                    <p className="text-sm font-medium">{student.admissionYear}</p>
                  </div>
                </div>
                <p className={`shrink-0 text-xs font-medium ${mutedClass}`}>
                  {student.activities.length} activity
                  {student.activities.length === 1 ? '' : 'ies'} · {totalPoints} pts
                </p>
              </button>

              <ExpandablePanel open={isOpen} >
                <div className="overflow-x-auto border-t px-2 pb-3">
                  <ActivityDetailsPanel
                    student={student}
                    compact
                    {...activityPanelProps}
                  />
                </div>
              </ExpandablePanel>
            </div>
          )
        })}
      </div>
    </div>
  )
}
