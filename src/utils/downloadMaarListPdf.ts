import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MAAR_ACTIVITIES } from '../constants/maarList'
import { SITE_CONFIG } from '../constants/siteConfig'

const A4_FORMAT = 'a4' as const
const PAGE_MARGIN = 14
const FOOTER_BOTTOM_OFFSET = 8

const CATEGORY_FILL: [number, number, number] = [254, 243, 199]
const HEAD_FILL: [number, number, number] = [241, 245, 249]

function buildTableBody() {
  const rows: (string | number | { content: string; colSpan?: number; styles?: object })[][] = []

  for (const category of MAAR_ACTIVITIES) {
    rows.push([
      {
        content: String(category.no),
        styles: { fontStyle: 'bold', fillColor: CATEGORY_FILL },
      },
      {
        content: category.title,
        colSpan: 2,
        styles: { fontStyle: 'bold', fillColor: CATEGORY_FILL },
      },
      {
        content: String(category.categoryMaxPoints ?? '—'),
        styles: { fontStyle: 'bold', fillColor: CATEGORY_FILL, halign: 'center' },
      },
    ])

    for (const item of category.items) {
      const activityText = item.label
        ? `${item.label}) ${item.activity}`
        : item.activity

      rows.push([
        '',
        activityText,
        String(item.pointsPerActivity),
        String(item.permissibleMax),
      ])
    }
  }

  return rows
}

function formatGeneratedAt(date: Date) {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function drawLastPageFooter(doc: jsPDF, generatedAt: string) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const y = pageHeight - FOOTER_BOTTOM_OFFSET

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6)
  doc.setTextColor(100, 116, 139)

  const brandLine = `${SITE_CONFIG.brandName}  ·  ${generatedAt}`
  doc.text(brandLine, PAGE_MARGIN, y)

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(5.5)
  doc.text('System generated PDF', pageWidth - PAGE_MARGIN, y, { align: 'right' })

  doc.setTextColor(0, 0, 0)
}

export function downloadMaarListPdf(filename = 'maar-list.pdf') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: A4_FORMAT,
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const generatedAt = formatGeneratedAt(new Date())

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('MAAR List', PAGE_MARGIN, 16)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(
    'Mandatory Additional Requirements — activities and point values',
    PAGE_MARGIN,
    22,
    { maxWidth: pageWidth - PAGE_MARGIN * 2 },
  )

  autoTable(doc, {
    startY: 28,
    margin: {
      left: PAGE_MARGIN,
      right: PAGE_MARGIN,
      bottom: FOOTER_BOTTOM_OFFSET + 4,
    },
    tableWidth: pageWidth - PAGE_MARGIN * 2,
    head: [['#', 'Activity', 'Points per Activity', 'Permissible Points (max)']],
    body: buildTableBody(),
    styles: {
      fontSize: 6,
      cellPadding: 1.2,
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: HEAD_FILL,
      textColor: [30, 41, 59],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 22, halign: 'center' },
      3: { cellWidth: 24, halign: 'center' },
    },
    didParseCell: (data) => {
      if (data.section === 'head') {
        data.cell.styles.halign = data.column.index <= 1 ? 'left' : 'center'
      }
      if (data.section === 'body' && data.column.index >= 2) {
        data.cell.styles.halign = 'center'
      }
    },
    showHead: 'everyPage',
  })

  doc.setPage(doc.getNumberOfPages())
  drawLastPageFooter(doc, generatedAt)

  doc.save(filename)
}
