import { MAAR_ACTIVITIES } from '../constants/maarList'

export type MaarActivityInfo = {
  categoryNo: number
  categoryTitle: string
  subActivityId: string
  subActivityLabel: string
  subActivityName: string
  displayName: string
}

function resolveSubActivityLabel(
  categoryNo: number,
  subActivityId: string,
): string {
  const trimmed = subActivityId.trim()
  if (!trimmed || trimmed === 'main') return 'a'

  const categoryPrefix = String(categoryNo)
  if (trimmed.startsWith(categoryPrefix) && trimmed.length > categoryPrefix.length) {
    return trimmed.slice(categoryPrefix.length)
  }

  return trimmed
}

function formatSubActivityName(label: string | undefined, activity: string) {
  if (label) return `${label}) ${activity}`
  return activity
}

/** Resolve MAAR category + sub-activity labels from API ids */
export function getMaarActivityInfo(
  activityId: string,
  subActivityId: string,
): MaarActivityInfo | null {
  const categoryNo = Number(activityId)
  if (!Number.isFinite(categoryNo)) return null

  const category = MAAR_ACTIVITIES.find((item) => item.no === categoryNo)
  if (!category) return null

  const subLabel = resolveSubActivityLabel(categoryNo, subActivityId)
  const item =
    category.items.find((entry) => (entry.label ?? 'a') === subLabel) ??
    category.items.find(
      (entry) => `${categoryNo}${entry.label ?? ''}` === subActivityId.trim(),
    )

  if (!item) {
    return {
      categoryNo,
      categoryTitle: category.title,
      subActivityId,
      subActivityLabel: subLabel,
      subActivityName: subActivityId,
      displayName: `${category.title} (${subActivityId})`,
    }
  }

  const subActivityLabel = item.label ?? 'a'
  const subActivityName = formatSubActivityName(item.label, item.activity)

  return {
    categoryNo,
    categoryTitle: category.title,
    subActivityId,
    subActivityLabel,
    subActivityName,
    displayName: `${category.title} — ${subActivityName}`,
  }
}
