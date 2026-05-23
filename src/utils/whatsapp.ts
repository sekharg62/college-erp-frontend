import { getMaarActivityInfo } from './maarActivityLookup'

export type ActivityWhatsAppMessageInput = {
  studentName: string
  activityId: string
  subActivityId: string
  status?: string
  points?: number
}

/** Digits only; adds India country code 91 for 10-digit numbers */
export function normalizePhoneForWhatsApp(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null

  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  if (digits.length >= 11) return digits

  return null
}

export function buildWhatsAppUrl(phone: string | null | undefined, message: string): string | null {
  const normalized = normalizePhoneForWhatsApp(phone)
  if (!normalized) return null
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
}

export function buildActivitySubmissionWhatsAppMessage({
  studentName,
  activityId,
  subActivityId,
  status,
  points,
}: ActivityWhatsAppMessageInput): string {
  const info = getMaarActivityInfo(activityId, subActivityId)
  const categoryTitle = info?.categoryTitle ?? `Activity ${activityId}`
  const subName = info?.subActivityName ?? subActivityId

  const lines = [
    `Hi ${studentName},`,
    '',
    'You have submitted the following MAAR activity:',
    `Activity no: ${activityId}`,
    `Sub-activity no: ${subActivityId}`,
    `Name: ${categoryTitle} — ${subName}`,
  ]

  if (points != null) lines.push(`Points: ${points}`)
  if (status?.trim()) lines.push(`Status: ${status}`)

  lines.push('', 'Thank you.')

  return lines.join('\n')
}

/** Template when teacher needs to report issues — editable before send */
export function buildActivityIssueWhatsAppMessage({
  studentName,
  activityId,
  subActivityId,
  status,
  points,
}: ActivityWhatsAppMessageInput): string {
  const info = getMaarActivityInfo(activityId, subActivityId)
  const categoryTitle = info?.categoryTitle ?? `Activity ${activityId}`
  const subName = info?.subActivityName ?? subActivityId

  const lines = [
    `Hi ${studentName},`,
    '',
    'Regarding your MAAR activity submission:',
    `Activity no: ${activityId}`,
    `Sub-activity no: ${subActivityId}`,
    `Name: ${categoryTitle} — ${subName}`,
  ]

  if (points != null) lines.push(`Points: ${points}`)
  if (status?.trim()) lines.push(`Status: ${status}`)

  lines.push(
    '',
    'There are some issues with your submission. Please review and resubmit:',
    ';',
    '',
    '(Add your notes above)',
    '',
    'Thank you.',
  )

  return lines.join('\n')
}

export function openWhatsAppChat(
  phone: string | null | undefined,
  message: string,
): boolean {
  const url = buildWhatsAppUrl(phone, message)
  if (!url) return false
  window.open(url, '_blank', 'noopener,noreferrer')
  return true
}
