import { MAAR_ACTIVITIES, type MaarCategory } from '../constants/maarList'

export type MaarSubmissionPoints = {
  activityId: string
  subActivityId: string
  points: number
}

export type CategoryPointSummary = {
  categoryNo: number
  title: string
  total: number
  max: number
  items: { subActivityId: string; points: number }[]
}

export type CategoryMaxViolation = CategoryPointSummary & {
  overBy: number
}

const categoryByNo = new Map<number, MaarCategory>(
  MAAR_ACTIVITIES.map((category) => [category.no, category]),
)

export function getCategoryPointSummaries(
  submissions: MaarSubmissionPoints[],
): CategoryPointSummary[] {
  const byCategory = new Map<number, CategoryPointSummary>()

  for (const submission of submissions) {
    const categoryNo = Number(submission.activityId)
    const category = categoryByNo.get(categoryNo)
    if (!category?.categoryMaxPoints) continue

    const existing = byCategory.get(categoryNo)
    const item = {
      subActivityId: submission.subActivityId,
      points: submission.points,
    }

    if (existing) {
      existing.total += submission.points
      existing.items.push(item)
    } else {
      byCategory.set(categoryNo, {
        categoryNo,
        title: category.title,
        total: submission.points,
        max: category.categoryMaxPoints,
        items: [item],
      })
    }
  }

  return [...byCategory.values()].sort((a, b) => a.categoryNo - b.categoryNo)
}

export function getCategoryMaxViolations(
  submissions: MaarSubmissionPoints[],
): CategoryMaxViolation[] {
  return getCategoryPointSummaries(submissions)
    .filter((summary) => summary.total > summary.max)
    .map((summary) => ({
      ...summary,
      overBy: summary.total - summary.max,
    }))
}

export function wouldExceedCategoryMax(
  submissions: MaarSubmissionPoints[],
  next: MaarSubmissionPoints,
): CategoryMaxViolation | null {
  const categoryNo = Number(next.activityId)
  const category = categoryByNo.get(categoryNo)
  if (!category?.categoryMaxPoints) return null

  const withoutRow = submissions.filter(
    (item) =>
      !(
        item.activityId === next.activityId &&
        item.subActivityId === next.subActivityId
      ),
  )
  const tentative = [...withoutRow, next]
  const violations = getCategoryMaxViolations(tentative)
  return violations.find((v) => v.categoryNo === categoryNo) ?? null
}

export function formatCategoryViolationMessage(violation: CategoryMaxViolation) {
  const subLabels = violation.items
    .map((item) => `${violation.categoryNo}${item.subActivityId}`)
    .join(' + ')
  const pointParts = violation.items.map((item) => item.points).join(' + ')

  return (
    `Category ${violation.categoryNo} exceeds the maximum of ${violation.max} points. ` +
    `Your selection (${subLabels}: ${pointParts} = ${violation.total}) is ${violation.overBy} point(s) over the limit.`
  )
}
