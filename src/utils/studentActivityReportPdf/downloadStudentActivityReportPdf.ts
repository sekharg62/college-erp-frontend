import type { GroupedStudentWithActivities } from '../groupActivitySubmissionsByStudent'
import {
  createReportPdf,
  drawSignatureBlock,
  finalizeReportPdf,
  formatGeneratedAt,
  loadStudentReportAssets,
  PAGE_MARGIN,
  renderStudentReportSection,
  sanitizeFilename,
  type StudentReportYearOptions,
} from './shared'

export type DownloadStudentReportOptions = StudentReportYearOptions

export async function downloadStudentActivityReportPdf(
  student: GroupedStudentWithActivities,
  options: DownloadStudentReportOptions = {},
) {
  const generatedAt = formatGeneratedAt(new Date())
  const assets = await loadStudentReportAssets(student)
  const doc = createReportPdf()

  const y = await renderStudentReportSection(doc, student, assets, {
    yearLabel: options.yearLabel,
    startY: PAGE_MARGIN,
  })

  drawSignatureBlock(
    doc,
    'Student signature',
    student.signature,
    assets.signatureImage,
    y + 2,
  )

  const filename = `activity-report-${sanitizeFilename(student.rollNo || student.name)}.pdf`
  finalizeReportPdf(doc, generatedAt, filename)
}
