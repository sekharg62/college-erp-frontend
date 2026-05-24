import jsPDF from 'jspdf'
import type { GroupedStudentWithActivities } from '../groupActivitySubmissionsByStudent'
import {
  createReportPdf,
  drawSignatureBlock,
  finalizeReportPdf,
  FOOTER_HEIGHT,
  formatGeneratedAt,
  isLikelyImageUrl,
  loadImageFromUrl,
  loadStudentReportAssets,
  PAGE_MARGIN,
  renderStudentReportSection,
  sanitizeFilename,
  type StudentReportYearOptions,
} from './shared'

const STUDENT_SECTION_GAP = 10

export type DownloadAllStudentsReportOptions = StudentReportYearOptions & {
  teacherSignature?: string | null
}

function drawBulkReportTitle(
  doc: jsPDF,
  yearLabel: string | undefined,
  studentCount: number,
  startY: number,
) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - PAGE_MARGIN * 2

  doc.setFillColor(30, 41, 59)
  doc.roundedRect(PAGE_MARGIN, startY, contentWidth, 22, 2, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(255, 255, 255)
  doc.text('All Students Activity Report', PAGE_MARGIN + 5, startY + 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(254, 243, 199)
  const subtitle = yearLabel
    ? `${yearLabel} · ${studentCount} student${studentCount === 1 ? '' : 's'}`
    : `${studentCount} student${studentCount === 1 ? '' : 's'}`
  doc.text(subtitle, PAGE_MARGIN + 5, startY + 16)

  doc.setTextColor(0, 0, 0)
  return startY + 28
}

export async function downloadAllStudentsActivityReportPdf(
  students: GroupedStudentWithActivities[],
  options: DownloadAllStudentsReportOptions = {},
) {
  if (students.length === 0) {
    throw new Error('No students to export')
  }

  const generatedAt = formatGeneratedAt(new Date())
  const doc = createReportPdf()

  let y = drawBulkReportTitle(doc, options.yearLabel, students.length, PAGE_MARGIN)

  const teacherSignatureImage =
    options.teacherSignature && isLikelyImageUrl(options.teacherSignature)
      ? await loadImageFromUrl(options.teacherSignature)
      : null

  for (let index = 0; index < students.length; index++) {
    const student = students[index]
    const assets = await loadStudentReportAssets(student)

    const pageHeight = doc.internal.pageSize.getHeight()
    if (y > PAGE_MARGIN + 20 && y + 48 > pageHeight - FOOTER_HEIGHT) {
      doc.addPage()
      y = PAGE_MARGIN
    }

    if (index > 0) {
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.3)
      doc.line(PAGE_MARGIN, y, doc.internal.pageSize.getWidth() - PAGE_MARGIN, y)
      y += STUDENT_SECTION_GAP
    }

    y = await renderStudentReportSection(doc, student, assets, {
      yearLabel: options.yearLabel,
      startY: y,
    })

    y = drawSignatureBlock(
      doc,
      'Student signature',
      student.signature,
      assets.signatureImage,
      y + 2,
    )

    y += STUDENT_SECTION_GAP
  }

  drawSignatureBlock(
    doc,
    'Teacher signature',
    options.teacherSignature,
    teacherSignatureImage,
    y + 2,
  )

  const yearSlug = options.yearLabel
    ? sanitizeFilename(options.yearLabel.toLowerCase())
    : 'all-students'
  const filename = `activity-reports-${yearSlug}.pdf`
  finalizeReportPdf(doc, generatedAt, filename)
}
