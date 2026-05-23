import type { AcademicYear } from '../../constants'
import { AlertTriangle, BookOpen, Eye, Loader2, Send, X } from 'lucide-react'
import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from 'react'
import { toast } from 'sonner'
import Button from '../uis/Button'
import Modal from '../uis/Modal'
import { MAAR_ACTIVITIES } from '../../constants/maarList'
import {
  createStudentActivitySubmit,
  getStudentActivitySubmits,
  type StudentActivitySubmit,
} from '../../services/studentActivitySubmit'
import { useStudentYearActivityPageTheme } from '../../theme/useStudentYearActivityPageTheme'
import { generateProofUrl } from '../../utils/generateProofUrl'
import { getErrorMessage } from '../../utils/getErrorMessage'
import {
  formatCategoryViolationMessage,
  getCategoryMaxViolations,
  getCategoryPointSummaries,
  wouldExceedCategoryMax,
  type CategoryMaxViolation,
} from '../../utils/validateMaarSubmissions'

export type YearActivitySubmission = {
  activityId: string
  subActivityId: string
  academicYear: AcademicYear
  points: number
  proofUrl: string
  serverId?: string
}

type StudentYearActivityPageProps = {
  yearTitle: string
  academicYear: AcademicYear
}

type RowKey = string

type RowUploadState = {
  loading: boolean
  proofUrl?: string
}

function getRowKey(categoryNo: number, label?: string) {
  return `${categoryNo}-${label ?? 'main'}`
}

function rowKeysForSubmission(submission: YearActivitySubmission): RowKey[] {
  const keys: RowKey[] = [`${submission.activityId}-${submission.subActivityId}`]
  if (submission.subActivityId === 'a') {
    keys.push(`${submission.activityId}-main`)
  }
  return keys
}

function clearSubmissionFromLocalState(
  submission: YearActivitySubmission,
  fileInputRefs: MutableRefObject<Record<RowKey, HTMLInputElement | null>>,
  setSubmissions: Dispatch<SetStateAction<YearActivitySubmission[]>>,
  setUploadState: Dispatch<SetStateAction<Record<RowKey, RowUploadState>>>,
) {
  setSubmissions((prev) =>
    prev.filter(
      (item) =>
        !(
          item.activityId === submission.activityId &&
          item.subActivityId === submission.subActivityId
        ),
    ),
  )
  setUploadState((prev) => {
    const next = { ...prev }
    for (const key of rowKeysForSubmission(submission)) {
      delete next[key]
      const input = fileInputRefs.current[key]
      if (input) input.value = ''
    }
    return next
  })
}

function mapApiSubmitToLocal(
  item: StudentActivitySubmit,
  academicYear: AcademicYear,
): YearActivitySubmission {
  return {
    activityId: item.activityId,
    subActivityId: item.subActivityId,
    academicYear,
    points: item.points,
    proofUrl: item.proofUrl,
    serverId: item.id,
  }
}

function buildUploadStateFromSubmissions(
  items: YearActivitySubmission[],
): Record<RowKey, RowUploadState> {
  const next: Record<RowKey, RowUploadState> = {}
  for (const item of items) {
    for (const key of rowKeysForSubmission(item)) {
      next[key] = { loading: false, proofUrl: item.proofUrl }
    }
  }
  return next
}

function clearAllSubmissionState(
  fileInputRefs: MutableRefObject<Record<RowKey, HTMLInputElement | null>>,
  setSubmissions: Dispatch<SetStateAction<YearActivitySubmission[]>>,
  setUploadState: Dispatch<SetStateAction<Record<RowKey, RowUploadState>>>,
) {
  Object.values(fileInputRefs.current).forEach((input) => {
    if (input) input.value = ''
  })
  setSubmissions([])
  setUploadState({})
}

function formatActivityLabel(item: { label?: string; activity: string }) {
  if (item.label) {
    return `${item.label}) ${item.activity}`
  }
  return item.activity
}

type PreviewState = {
  activity: string
  proofUrl: string
}

export default function StudentYearActivityPage({
  yearTitle,
  academicYear,
}: StudentYearActivityPageProps) {
  const {
    cardClass,
    mutedClass,
    stickyHeadClass,
    tableRowClass,
    categoryRowClass,
    inputClass,
    urlBoxClass,
    iconBtnClass,
    removeBtnClass,
  } = useStudentYearActivityPageTheme()

  const [submissions, setSubmissions] = useState<YearActivitySubmission[]>([])
  const [uploadState, setUploadState] = useState<Record<RowKey, RowUploadState>>({})
  const [preview, setPreview] = useState<PreviewState | null>(null)
  const [submitPreviewOpen, setSubmitPreviewOpen] = useState(false)
  const [validationAlertOpen, setValidationAlertOpen] = useState(false)
  const [validationViolations, setValidationViolations] = useState<
    CategoryMaxViolation[]
  >([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true)
  const [submitProgress, setSubmitProgress] = useState({ done: 0, total: 0 })
  const fileInputRefs = useRef<Record<RowKey, HTMLInputElement | null>>({})

  useEffect(() => {
    let cancelled = false

    async function loadSubmissions() {
      setIsLoadingSubmissions(true)
      try {
        const data = await getStudentActivitySubmits(academicYear)
        if (cancelled) return

        const mapped = data.map((item) => mapApiSubmitToLocal(item, academicYear))
        setSubmissions(mapped)
        setUploadState(buildUploadStateFromSubmissions(mapped))
      } catch (error) {
        if (!cancelled) {
          toast.error(
            getErrorMessage(error, 'Failed to load saved activity submissions'),
          )
        }
      } finally {
        if (!cancelled) setIsLoadingSubmissions(false)
      }
    }

    void loadSubmissions()

    return () => {
      cancelled = true
    }
  }, [academicYear])

  const activityCount = submissions.length
  const activityLabel = activityCount === 1 ? 'activity' : 'activities'
  const categorySummaries = useMemo(
    () => getCategoryPointSummaries(submissions),
    [submissions],
  )
  const categoryViolations = useMemo(
    () => getCategoryMaxViolations(submissions),
    [submissions],
  )
  const hasCategoryViolations = categoryViolations.length > 0

  const summaryByCategoryNo = useMemo(
    () => new Map(categorySummaries.map((s) => [s.categoryNo, s])),
    [categorySummaries],
  )

  const totalPoints = useMemo(
    () => submissions.reduce((sum, item) => sum + item.points, 0),
    [submissions],
  )

  const openValidationAlert = useCallback((violations: CategoryMaxViolation[]) => {
    setValidationViolations(violations)
    setValidationAlertOpen(true)
  }, [])

  const handleSubmitClick = useCallback(() => {
    if (hasCategoryViolations) {
      openValidationAlert(categoryViolations)
      return
    }
    setSubmitPreviewOpen(true)
  }, [categoryViolations, hasCategoryViolations, openValidationAlert])

  const handleFileSelect = useCallback(
    async (
      rowKey: RowKey,
      categoryNo: number,
      label: string | undefined,
      points: number,
      file: File,
    ) => {
      setUploadState((prev) => ({
        ...prev,
        [rowKey]: { loading: true },
      }))

      try {
        const proofUrl = await generateProofUrl(file)

        const submission: YearActivitySubmission = {
          activityId: String(categoryNo),
          subActivityId: label ?? 'a',
          academicYear,
          points,
          proofUrl,
        }

        const violation = wouldExceedCategoryMax(submissions, submission)
        if (violation) {
          setUploadState((prev) => {
            const next = { ...prev }
            delete next[rowKey]
            return next
          })
          const input = fileInputRefs.current[rowKey]
          if (input) input.value = ''
          openValidationAlert([violation])
          return
        }

        setUploadState((prev) => ({
          ...prev,
          [rowKey]: { loading: false, proofUrl },
        }))

        setSubmissions((prev) => {
          const withoutRow = prev.filter(
            (item) =>
              !(
                item.activityId === submission.activityId &&
                item.subActivityId === submission.subActivityId
              ),
          )
          return [...withoutRow, submission]
        })
      } catch {
        setUploadState((prev) => ({
          ...prev,
          [rowKey]: { loading: false },
        }))
      }
    },
    [academicYear, openValidationAlert, submissions],
  )

  const handleConfirmSubmit = useCallback(async () => {
    if (hasCategoryViolations) {
      setSubmitPreviewOpen(false)
      openValidationAlert(categoryViolations)
      return
    }

    if (submissions.length === 0) return

    setIsSubmitting(true)
    setSubmitProgress({ done: 0, total: submissions.length })

    let successCount = 0
    const items = [...submissions]

    for (let i = 0; i < items.length; i += 1) {
      const item = items[i]!
      try {
        await createStudentActivitySubmit({
          activityId: item.activityId,
          subActivityId: item.subActivityId,
          academicYear: item.academicYear,
          points: item.points,
          proofUrl: item.proofUrl,
        })
        successCount += 1
        clearSubmissionFromLocalState(
          item,
          fileInputRefs,
          setSubmissions,
          setUploadState,
        )
      } catch (error) {
        toast.error(
          `Activity ${item.activityId}, sub-activity ${item.subActivityId} not saved: ${getErrorMessage(error, 'Request failed')}`,
        )
      }
      setSubmitProgress({ done: i + 1, total: items.length })
    }

    setIsSubmitting(false)

    if (successCount === items.length) {
      toast.success('All data saved')
      clearAllSubmissionState(fileInputRefs, setSubmissions, setUploadState)
      setSubmitPreviewOpen(false)
    } else if (successCount > 0) {
      toast.warning(`Saved ${successCount} of ${items.length} activities`)
    } else {
      toast.error('No activities were saved. Please try again.')
    }
  }, [
    categoryViolations,
    fileInputRefs,
    hasCategoryViolations,
    openValidationAlert,
    submissions,
  ])

  const handleRemoveFile = useCallback(
    (rowKey: RowKey, categoryNo: number, label: string | undefined, proofUrl: string) => {
      const subActivityId = label ?? 'a'

      setSubmissions((prev) =>
        prev.filter(
          (item) =>
            !(item.activityId === String(categoryNo) && item.subActivityId === subActivityId),
        ),
      )

      setUploadState((prev) => {
        const next = { ...prev }
        delete next[rowKey]
        return next
      })

      const input = fileInputRefs.current[rowKey]
      if (input) input.value = ''

      setPreview((current) => (current?.proofUrl === proofUrl ? null : current))
    },
    [],
  )

  return (
    <div className="mx-auto flex h-[calc(100dvh-var(--header-height)-1.25rem)] max-h-[calc(100dvh-var(--header-height)-1.25rem)] w-full max-w-6xl min-h-0 flex-col overflow-hidden sm:h-[calc(100dvh-var(--header-height)-1.5rem)] sm:max-h-[calc(100dvh-var(--header-height)-1.5rem)]">
      <div className="mb-2 flex shrink-0 items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
          <BookOpen size={16} aria-hidden />
        </div>
        <h1 className="text-base font-semibold tracking-tight sm:text-lg">{yearTitle}</h1>
        <span className={`hidden min-w-0 truncate text-xs sm:inline ${mutedClass}`}>
          Upload proof per activity
        </span>
      </div>

      <div className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}>
        {isLoadingSubmissions && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 dark:bg-slate-950/70">
            <Loader2 size={28} className="animate-spin text-amber-500" />
          </div>
        )}
        <div className="scrollbar-thin min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-3xl border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className={`border-b ${tableRowClass}`}>
                <th
                  className={`w-10 px-3 py-3 text-left font-semibold ${stickyHeadClass}`}
                >
                  #
                </th>
                <th className={`px-3 py-3 text-left font-semibold ${stickyHeadClass}`}>
                  Activity
                </th>
                <th
                  className={`w-24 px-3 py-3 text-center font-semibold ${stickyHeadClass}`}
                >
                  Points
                </th>
                <th
                  className={`w-24 px-3 py-3 text-center font-semibold ${stickyHeadClass}`}
                >
                  Max
                </th>
                <th className={`w-44 px-3 py-3 text-left font-semibold ${stickyHeadClass}`}>
                  Proof
                </th>
              </tr>
            </thead>
            <tbody>
              {MAAR_ACTIVITIES.map((category) => {
                const categorySummary = summaryByCategoryNo.get(category.no)
                const isOverLimit =
                  categorySummary !== undefined &&
                  categorySummary.total > categorySummary.max

                return (
                  <Fragment key={category.no}>
                    <tr
                      className={`border-b ${tableRowClass} ${categoryRowClass} ${isOverLimit ? 'bg-red-500/10' : ''}`}
                    >
                      <td className="px-3 py-3 font-semibold">{category.no}</td>
                      <td className="px-3 py-3 font-semibold">
                        <span>{category.title}</span>
                        {categorySummary && (
                          <span
                            className={`mt-0.5 block text-xs font-medium ${isOverLimit ? 'text-red-500' : 'text-amber-600 dark:text-amber-400'}`}
                          >
                            Selected: {categorySummary.total} / {categorySummary.max} pts
                            {isOverLimit &&
                              ` (${categorySummary.total - categorySummary.max} over)`}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3" />
                      <td className="px-3 py-3 text-center font-semibold">
                        {category.categoryMaxPoints ?? '—'}
                      </td>
                      <td className="px-3 py-3" />
                    </tr>
                    {category.items.map((item, index) => {
                      const rowKey = getRowKey(category.no, item.label)
                      const state = uploadState[rowKey]

                      return (
                        <tr
                          key={`${category.no}-${index}`}
                          className={`border-b ${tableRowClass}`}
                        >
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2">
                            {item.label && (
                              <span className="mr-1 font-medium">{item.label})</span>
                            )}
                            {item.activity}
                          </td>
                          <td className="px-3 py-2 text-center font-medium">
                            {item.pointsPerActivity}
                          </td>
                          <td className="px-3 py-2 text-center font-medium">
                            {item.permissibleMax}
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex min-w-0 items-center gap-1.5">
                              {state?.loading ? (
                                <Loader2
                                  size={16}
                                  className="shrink-0 animate-spin text-amber-500"
                                />
                              ) : state?.proofUrl ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setPreview({
                                        activity: formatActivityLabel(item),
                                        proofUrl: state.proofUrl!,
                                      })
                                    }
                                    title="Preview proof"
                                    aria-label="Preview proof"
                                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors ${iconBtnClass}`}
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveFile(
                                        rowKey,
                                        category.no,
                                        item.label,
                                        state.proofUrl!,
                                      )
                                    }
                                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors ${removeBtnClass}`}
                                    aria-label="Remove proof"
                                  >
                                    <X size={14} />
                                  </button>
                                </>
                              ) : (
                                <input
                                  ref={(el) => {
                                    fileInputRefs.current[rowKey] = el
                                  }}
                                type="file"
                                accept="image/*,.pdf"
                                disabled={state?.loading || isLoadingSubmissions}
                                  className={`w-full max-w-[10rem] rounded border px-1 py-0.5 text-xs file:cursor-pointer disabled:opacity-50 ${inputClass}`}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (!file) return
                                    void handleFileSelect(
                                      rowKey,
                                      category.no,
                                      item.label,
                                      item.pointsPerActivity,
                                      file,
                                    )
                                  }}
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <div
          className={`flex shrink-0 flex-wrap items-center gap-2 border-t px-3 py-2 ${tableRowClass}`}
        >
          <div className="mr-auto flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] leading-tight">
            {activityCount > 0 && (
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {activityCount} ready · {totalPoints} pts
              </span>
            )}
            {hasCategoryViolations && (
              <span className="flex items-center gap-1 font-medium text-red-500">
                <AlertTriangle size={12} className="shrink-0" />
                {categoryViolations.length} over limit
              </span>
            )}
          </div>
          <Button
            variant={hasCategoryViolations ? 'danger' : 'primary'}
            icon={hasCategoryViolations ? AlertTriangle : Send}
            disabled={activityCount === 0 || isLoadingSubmissions}
            onClick={handleSubmitClick}
          >
            Submit {activityCount} {activityLabel}
          </Button>
        </div>
      </div>

      <Modal
        open={validationAlertOpen}
        onClose={() => setValidationAlertOpen(false)}
        title="Point limit exceeded"
        size="md"
      >
        <div className="flex flex-col gap-4">
          <p className={`text-sm ${mutedClass}`}>
            Some categories have more points than allowed. Remove proofs or pick lower-point
            activities until each category is within its max.
          </p>
          <ul className="flex flex-col gap-3">
            {validationViolations.map((violation) => (
              <li
                key={violation.categoryNo}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-600 dark:text-red-400"
              >
                <p className="font-semibold">Category {violation.categoryNo}</p>
                <p className="mt-1 text-xs opacity-90">
                  {formatCategoryViolationMessage(violation)}
                </p>
                <p className="mt-2 text-xs">
                  {violation.items
                    .map(
                      (item) =>
                        `${violation.categoryNo}${item.subActivityId}: ${item.points} pts`,
                    )
                    .join(' · ')}
                </p>
              </li>
            ))}
          </ul>
          <Button
            variant="primary"
            className="self-end"
            onClick={() => setValidationAlertOpen(false)}
          >
            Got it
          </Button>
        </div>
      </Modal>

      <Modal
        open={submitPreviewOpen}
        onClose={() => {
          if (!isSubmitting) setSubmitPreviewOpen(false)
        }}
        title="Submit preview"
        size="lg"
      >
        {activityCount === 0 ? (
          <p className={`text-sm ${mutedClass}`}>No activities to submit yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <p className={`text-sm ${mutedClass}`}>
              Review {activityCount} {activityLabel} before submitting.
            </p>

            {/* <div className="flex flex-wrap items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                Total points
              </p>
              <p className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                {totalPoints}
              </p>
              {categorySummaries.length > 0 && (
                <div className={`ml-auto flex flex-wrap gap-2 text-xs ${mutedClass}`}>
                  {categorySummaries.map((summary) => {
                    const isOver = summary.total > summary.max
                    return (
                      <span
                        key={summary.categoryNo}
                        className={
                          isOver
                            ? 'font-medium text-red-500'
                            : 'text-amber-700 dark:text-amber-300'
                        }
                      >
                        Cat. {summary.categoryNo}: {summary.total}/{summary.max}
                      </span>
                    )
                  })}
                </div>
              )}
            </div> */}

            <div className={`overflow-x-auto rounded-lg border ${tableRowClass}`}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className={`border-b ${tableRowClass} ${stickyHeadClass}`}>
                    <th className="px-3 py-2 font-semibold">Activity ID</th>
                    <th className="px-3 py-2 font-semibold">Sub-activity</th>
                    <th className="px-3 py-2 font-semibold">Year</th>
                    <th className="px-3 py-2 text-center font-semibold">Points</th>
                    <th className="px-3 py-2 font-semibold">Proof URL</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((item) => (
                    <tr
                      key={`${item.activityId}-${item.subActivityId}`}
                      className={`border-b last:border-b-0 ${tableRowClass}`}
                    >
                      <td className="px-3 py-2">{item.activityId}</td>
                      <td className="px-3 py-2">{item.subActivityId}</td>
                      <td className="px-3 py-2">{item.academicYear}</td>
                      <td className="px-3 py-2 text-center">{item.points}</td>
                      <td className="max-w-[12rem] truncate px-3 py-2" title={item.proofUrl}>
                        {item.proofUrl}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className={`border-t ${tableRowClass} ${stickyHeadClass}`}>
                    <td colSpan={3} className="px-3 py-2.5 text-right font-semibold">
                      Total
                    </td>
                    <td className="px-3 py-2.5 text-center text-lg font-bold tabular-nums text-amber-600 dark:text-amber-400">
                      {totalPoints}
                    </td>
                    <td className="px-3 py-2.5" />
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="cancel"
                disabled={isSubmitting}
                onClick={() => setSubmitPreviewOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={Send}
                loading={isSubmitting}
                disabled={hasCategoryViolations || isSubmitting}
                onClick={() => void handleConfirmSubmit()}
              >
                {isSubmitting
                  ? `Saving ${submitProgress.done}/${submitProgress.total}…`
                  : 'Confirm submit'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={preview !== null}
        onClose={() => setPreview(null)}
        title={preview ? `Preview - ${preview.activity}` : undefined}
        size="md"
      >
        {preview && (
          <div className="flex flex-col gap-4">
            <div>
              <p className={`mb-1.5 text-xs font-medium uppercase tracking-wide ${mutedClass}`}>
                Proof URL
              </p>
              <p
                className={`break-all rounded-lg border px-3 py-2.5 text-sm ${urlBoxClass}`}
              >
                <a
                  href={preview.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-600 underline hover:text-amber-500 dark:text-amber-400"
                >
                  {preview.proofUrl}
                </a>
              </p>
            </div>

            <Button variant="cancel" className="self-end" onClick={() => setPreview(null)}>
              Close
            </Button>
          </div>
        )}
      </Modal>
    </div>
  )
}
