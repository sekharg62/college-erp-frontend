import jsPDF from 'jspdf'
import { SITE_CONFIG } from '../../constants/siteConfig'
import type { GroupedStudentWithActivities } from '../groupActivitySubmissionsByStudent'
import { getMaarActivityInfo } from '../maarActivityLookup'
import type { StudentActivitySubmit } from '../../services/studentActivitySubmit'

export const PAGE_MARGIN = 14
export const FOOTER_HEIGHT = 14
export const SIGNATURE_MAX_WIDTH = 50
export const SIGNATURE_MAX_HEIGHT = 22
export const PROOF_MAX_HEIGHT = 105

export type ImagePayload = {
  dataUrl: string
  format: 'PNG' | 'JPEG'
  width: number
  height: number
}

export type StudentReportAssets = {
  proofImages: (ImagePayload | null)[]
  signatureImage: ImagePayload | null
}

export type StudentReportYearOptions = {
  yearLabel?: string
}

function isDataUrl(url: string) {
  return url.startsWith('data:image/')
}

export function isLikelyImageUrl(url: string) {
  if (isDataUrl(url)) return true
  return /\.(png|jpe?g|gif|webp)(\?|$)/i.test(url)
}

export async function loadImageFromUrl(url: string): Promise<ImagePayload | null> {
  if (!url?.trim()) return null

  try {
    if (isDataUrl(url)) {
      return await dataUrlToImagePayload(url)
    }

    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) return null
    const blob = await response.blob()
    if (!blob.type.startsWith('image/')) return null

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })

    return await dataUrlToImagePayload(dataUrl)
  } catch {
    return null
  }
}

function dataUrlToImagePayload(dataUrl: string): Promise<ImagePayload | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const format: 'PNG' | 'JPEG' = dataUrl.includes('image/png') ? 'PNG' : 'JPEG'
      resolve({
        dataUrl,
        format,
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
    img.onerror = () => resolve(null)
    img.src = dataUrl
  })
}

function scaleToFit(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
  allowUpscale = false,
) {
  const ratio = allowUpscale
    ? Math.min(maxWidth / width, maxHeight / height)
    : Math.min(maxWidth / width, maxHeight / height, 1)
  return { width: width * ratio, height: height * ratio }
}

function sortActivities(activities: StudentActivitySubmit[]) {
  return [...activities].sort((a, b) => {
    const act = Number(a.activityId) - Number(b.activityId)
    if (act !== 0) return act
    return a.subActivityId.localeCompare(b.subActivityId)
  })
}

export async function loadStudentReportAssets(
  student: GroupedStudentWithActivities,
): Promise<StudentReportAssets> {
  const activities = sortActivities(student.activities)
  const proofImages = await Promise.all(
    activities.map((item) =>
      isLikelyImageUrl(item.proofUrl) ? loadImageFromUrl(item.proofUrl) : Promise.resolve(null),
    ),
  )
  const signatureImage =
    student.signature && isLikelyImageUrl(student.signature)
      ? await loadImageFromUrl(student.signature)
      : null

  return { proofImages, signatureImage }
}

export function formatGeneratedAt(date: Date) {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function sanitizeFilename(name: string) {
  return name.replace(/[^\w\-]+/g, '-').replace(/-+/g, '-').slice(0, 60)
}

export function createReportPdf() {
  return new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
}

export function drawReportFooter(doc: jsPDF, generatedAt: string) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const y = pageHeight - 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text(
    `${SITE_CONFIG.brandName} · System generated report · ${generatedAt}`,
    PAGE_MARGIN,
    y,
  )
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(6.5)
  doc.text('This is a system-generated document.', pageWidth - PAGE_MARGIN, y, {
    align: 'right',
  })
  doc.setTextColor(0, 0, 0)
}

export function finalizeReportPdf(doc: jsPDF, generatedAt: string, filename: string) {
  const pageCount = doc.getNumberOfPages()
  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page)
    drawReportFooter(doc, generatedAt)
  }
  doc.save(filename)
}

function drawLabelValue(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  labelWidth: number,
  maxValueWidth: number,
) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text(`${label}:`, x, y)
  doc.setFont('helvetica', 'normal')
  const valueLines = doc.splitTextToSize(String(value), maxValueWidth)
  doc.text(valueLines, x + labelWidth, y)
  return valueLines.length
}

function drawStudentHeader(
  doc: jsPDF,
  student: GroupedStudentWithActivities,
  yearLabel: string | undefined,
  startY: number,
) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - PAGE_MARGIN * 2

  const headerPad = 4
  const colGap = 6
  const colWidth = (contentWidth - headerPad * 2 - colGap) / 2
  const leftX = PAGE_MARGIN + headerPad
  const rightX = leftX + colWidth + colGap
  const leftLabelWidth = 16
  const rightLabelWidth = 28
  const leftValueWidth = colWidth - leftLabelWidth
  const rightValueWidth = colWidth - rightLabelWidth
  const rowHeight = 6

  doc.setFillColor(254, 243, 199)
  doc.roundedRect(PAGE_MARGIN, startY, contentWidth, 36, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(30, 41, 59)
  doc.text('Student Activity Report', leftX, startY + 8)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  const subtitle = yearLabel
    ? `${SITE_CONFIG.brandFullName} · ${yearLabel}`
    : SITE_CONFIG.brandFullName
  doc.text(subtitle, leftX, startY + 14, { maxWidth: contentWidth - headerPad * 2 })

  const detailsY = startY + 20
  doc.setTextColor(30, 41, 59)

  const row1LeftLines = drawLabelValue(
    doc,
    'Name',
    student.name,
    leftX,
    detailsY,
    leftLabelWidth,
    leftValueWidth,
  )
  drawLabelValue(
    doc,
    'Phone',
    student.phoneNo ?? '—',
    rightX,
    detailsY,
    rightLabelWidth,
    rightValueWidth,
  )

  const row2Y = detailsY + Math.max(row1LeftLines, 1) * rowHeight
  drawLabelValue(
    doc,
    'Roll no',
    student.rollNo,
    leftX,
    row2Y,
    leftLabelWidth,
    leftValueWidth,
  )
  drawLabelValue(
    doc,
    'Admission year',
    student.admissionYear,
    rightX,
    row2Y,
    rightLabelWidth,
    rightValueWidth,
  )

  doc.setTextColor(0, 0, 0)
  return startY + 40
}

async function drawActivityBlock(
  doc: jsPDF,
  item: StudentActivitySubmit,
  index: number,
  startY: number,
  proofImage: ImagePayload | null,
): Promise<number> {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PAGE_MARGIN * 2
  const info = getMaarActivityInfo(item.activityId, item.subActivityId)

  const activityNo = String(info?.categoryNo ?? item.activityId)
  const subActivityLabel = info?.subActivityLabel ?? item.subActivityId
  const subActivityName = info?.subActivityName ?? item.subActivityId
  const activityName = info?.categoryTitle ?? `Activity ${item.activityId}`
  const status = item.status
  const points = String(item.points)

  const innerPad = 3
  const textWidth = contentWidth - innerPad * 2
  const lineHeight = 3.6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  const activityNameLines = doc.splitTextToSize(activityName, textWidth)
  const subActivityLines = doc.splitTextToSize(subActivityName, textWidth)

  let blockHeight =
    6 +
    lineHeight +
    activityNameLines.length * lineHeight +
    1 +
    lineHeight +
    subActivityLines.length * lineHeight +
    5

  const proofMaxWidth = textWidth
  let proofDimensions: { width: number; height: number } | null = null

  if (proofImage) {
    proofDimensions = scaleToFit(
      proofImage.width,
      proofImage.height,
      proofMaxWidth,
      PROOF_MAX_HEIGHT,
      true,
    )
    blockHeight += lineHeight + proofDimensions.height + 6
  }

  const linkLines = doc.splitTextToSize(item.proofUrl, textWidth)
  blockHeight += linkLines.length * 2.8 + 4

  let y = startY

  if (y + blockHeight > pageHeight - FOOTER_HEIGHT - SIGNATURE_MAX_HEIGHT - 6) {
    doc.addPage()
    y = PAGE_MARGIN
  }

  const blockTop = y
  doc.setDrawColor(226, 232, 240)
  doc.setFillColor(248, 250, 252)
  doc.roundedRect(PAGE_MARGIN, blockTop, contentWidth, blockHeight, 1.5, 1.5, 'FD')

  y = blockTop + 4.5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(30, 41, 59)
  doc.text(`#${index + 1}`, PAGE_MARGIN + innerPad, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text(
    `Activity ${activityNo} · Sub: ${subActivityLabel}`,
    PAGE_MARGIN + 12,
    y,
    { maxWidth: textWidth - 50 },
  )

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.text(status, pageWidth - PAGE_MARGIN - innerPad, y, { align: 'right' })

  y += 5.5

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(71, 85, 105)
  doc.text('Activity name', PAGE_MARGIN + innerPad, y)
  y += lineHeight
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 65, 85)
  doc.text(activityNameLines, PAGE_MARGIN + innerPad, y)
  y += activityNameLines.length * lineHeight + 1

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(71, 85, 105)
  doc.text('Sub-activity', PAGE_MARGIN + innerPad, y)
  y += lineHeight
  doc.setFont('helvetica', 'normal')
  doc.text(subActivityLines, PAGE_MARGIN + innerPad, y)
  y += subActivityLines.length * lineHeight + 1

  doc.setFontSize(7)
  doc.setTextColor(100, 116, 139)
  doc.text(`Points: ${points}`, PAGE_MARGIN + innerPad, y)
  y += 4

  if (proofImage && proofDimensions) {
    const { width, height } = proofDimensions
    const imageX = PAGE_MARGIN + innerPad

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(71, 85, 105)
    doc.text('Proof', imageX, y)
    y += lineHeight

    doc.setDrawColor(203, 213, 225)
    doc.setLineWidth(0.2)
    doc.rect(imageX, y, width, height)

    doc.addImage(proofImage.dataUrl, proofImage.format, imageX, y, width, height)
    y += height + 3
  }

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6)
  doc.setTextColor(37, 99, 235)
  doc.text(linkLines, PAGE_MARGIN + innerPad, y)
  y = blockTop + blockHeight + 4

  doc.setTextColor(0, 0, 0)
  return y
}

export function drawSignatureBlock(
  doc: jsPDF,
  label: string,
  signatureUrl: string | null | undefined,
  signatureImage: ImagePayload | null,
  startY: number,
): number {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const blockHeight = SIGNATURE_MAX_HEIGHT + 12

  let y = startY
  if (y + blockHeight > pageHeight - FOOTER_HEIGHT - 4) {
    doc.addPage()
    y = PAGE_MARGIN
  }

  const labelX = pageWidth - PAGE_MARGIN - SIGNATURE_MAX_WIDTH

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(71, 85, 105)
  doc.text(label, labelX + SIGNATURE_MAX_WIDTH / 2, y, { align: 'center' })
  y += 4

  if (signatureImage) {
    const { width, height } = scaleToFit(
      signatureImage.width,
      signatureImage.height,
      SIGNATURE_MAX_WIDTH,
      SIGNATURE_MAX_HEIGHT,
    )
    doc.addImage(
      signatureImage.dataUrl,
      signatureImage.format,
      labelX + (SIGNATURE_MAX_WIDTH - width) / 2,
      y,
      width,
      height,
    )
  } else if (signatureUrl?.trim()) {
    doc.setFontSize(6)
    doc.setTextColor(148, 163, 184)
    doc.text('(Signature on file)', labelX, y + 6)
  } else {
    doc.setFontSize(6)
    doc.setTextColor(148, 163, 184)
    doc.text('(No signature)', labelX, y + 6)
  }

  doc.setTextColor(0, 0, 0)
  return y + blockHeight + 4
}

/** Renders one student section (header + activities). Returns Y before signature. */
export async function renderStudentReportSection(
  doc: jsPDF,
  student: GroupedStudentWithActivities,
  assets: StudentReportAssets,
  options: { yearLabel?: string; startY: number },
): Promise<number> {
  const activities = sortActivities(student.activities)
  let y = drawStudentHeader(doc, student, options.yearLabel, options.startY)

  if (activities.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    doc.text('No activity submissions for this period.', PAGE_MARGIN, y + 6)
    y += 14
    doc.setTextColor(0, 0, 0)
    return y
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(30, 41, 59)
  doc.text('Submitted activities', PAGE_MARGIN, y)
  y += 6

  for (let i = 0; i < activities.length; i++) {
    y = await drawActivityBlock(doc, activities[i], i, y, assets.proofImages[i])
  }

  return y
}
