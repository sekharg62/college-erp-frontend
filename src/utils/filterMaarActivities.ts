import {
  MAAR_ACTIVITIES,
  type MaarCategory,
} from '../constants/maarList'

export function countMaarActivityRows(categories: readonly MaarCategory[]) {
  return categories.reduce((sum, category) => sum + category.items.length, 0)
}

export function filterMaarActivities(
  query: string,
  categories: readonly MaarCategory[] = MAAR_ACTIVITIES,
): MaarCategory[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return [...categories]

  return categories
    .map((category) => {
      const categoryText = [
        String(category.no),
        category.title,
        category.categoryMaxPoints != null ? String(category.categoryMaxPoints) : '',
      ]
        .join(' ')
        .toLowerCase()

      const categoryMatches = categoryText.includes(normalized)

      const matchedItems = category.items.filter((item) => {
        const itemText = [
          item.label ?? '',
          item.activity,
          String(item.pointsPerActivity),
          String(item.permissibleMax),
        ]
          .join(' ')
          .toLowerCase()
        return itemText.includes(normalized)
      })

      if (categoryMatches) {
        return { ...category, items: [...category.items] }
      }

      if (matchedItems.length === 0) return null

      return { ...category, items: matchedItems }
    })
    .filter((category): category is MaarCategory => category !== null)
}
