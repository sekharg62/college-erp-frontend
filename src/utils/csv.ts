const BULK_STUDENT_HEADERS = [
  'name',
  'rollNo',
  'admissionYear',
  'phoneNo',
  'password',
] as const

export const BULK_STUDENT_CSV_TEMPLATE = [
  BULK_STUDENT_HEADERS.join(','),
  'Rahul Sharma,CS2025001,2025,9876543210,',
  'Jane Doe,CS2025002,26,9876543211,student123',
].join('\n')

export function downloadCsvFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
      continue
    }
    current += char
  }

  values.push(current.trim())
  return values
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, '')
}

const HEADER_ALIASES: Record<string, keyof BulkStudentCsvFields> = {
  name: 'name',
  rollno: 'rollNo',
  admissionyear: 'admissionYear',
  phoneno: 'phoneNo',
  password: 'password',
}

export type BulkStudentCsvFields = {
  name: string
  rollNo: string
  admissionYear: string
  phoneNo: string
  password: string
}

export function parseBulkStudentCsv(text: string): BulkStudentCsvFields[] {
  const cleaned = text.replace(/^\uFEFF/, '').trim()
  if (!cleaned) return []

  const lines = cleaned.split(/\r?\n/).filter((line) => line.trim())
  if (lines.length === 0) return []

  const headerCells = parseCsvLine(lines[0]).map(normalizeHeader)
  const columnMap = headerCells.map((header) => HEADER_ALIASES[header] ?? null)

  const hasKnownHeader = columnMap.some((col) => col !== null)
  const dataLines = hasKnownHeader ? lines.slice(1) : lines

  if (!hasKnownHeader && dataLines.length > 0) {
    return dataLines.map((line) => {
      const [name = '', rollNo = '', admissionYear = '', phoneNo = '', password = ''] =
        parseCsvLine(line)
      const phone = phoneNo.trim()
      const pwd = password.trim()
      return {
        name: name.trim(),
        rollNo: rollNo.trim(),
        admissionYear: admissionYear.trim(),
        phoneNo: phone,
        password: pwd || phone,
      }
    })
  }

  return dataLines
    .map((line) => {
      const cells = parseCsvLine(line)
      const row: BulkStudentCsvFields = {
        name: '',
        rollNo: '',
        admissionYear: '',
        phoneNo: '',
        password: '',
      }

      columnMap.forEach((field, index) => {
        if (!field) return
        row[field] = cells[index] ?? ''
      })

      const phone = row.phoneNo.trim()
      const pwd = row.password.trim()
      row.name = row.name.trim()
      row.rollNo = row.rollNo.trim()
      row.admissionYear = row.admissionYear.trim()
      row.phoneNo = phone
      row.password = pwd || phone

      return row
    })
    .filter((row) =>
      [row.name, row.rollNo, row.admissionYear, row.phoneNo].some(Boolean),
    )
}
