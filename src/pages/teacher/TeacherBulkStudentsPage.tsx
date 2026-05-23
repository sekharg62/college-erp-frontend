import axios from 'axios'
import { ArrowLeft, Download, Trash2, Upload, Users } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import Button from '../../components/uis/Button'
import { useTeacherAuth } from '../../context/TeacherAuthContext'
import { useTheme } from '../../context/ThemeContext'
import { createStudent } from '../../services/student'
import {
  BULK_STUDENT_CSV_TEMPLATE,
  downloadCsvFile,
  parseBulkStudentCsv,
} from '../../utils/csv'

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

type RowStatus = 'idle' | 'creating' | 'success' | 'error'

type BulkStudentRow = {
  id: string
  name: string
  rollNo: string
  admissionYear: string
  phoneNo: string
  password: string
  status: RowStatus
  errorMessage?: string
}

function createRowId() {
  return crypto.randomUUID()
}

function mapCsvToRows(
  rows: ReturnType<typeof parseBulkStudentCsv>,
): BulkStudentRow[] {
  return rows.map((row) => ({
    id: createRowId(),
    ...row,
    status: 'idle' as const,
  }))
}

export default function TeacherBulkStudentsPage() {
  const { theme } = useTheme()
  const { user } = useTeacherAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<BulkStudentRow[]>([])
  const [creating, setCreating] = useState(false)
  const [createProgress, setCreateProgress] = useState({ done: 0, total: 0 })

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const inputClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-950/60 text-slate-100 placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/25'
      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-violet-500/20'

  const handleDownloadTemplate = () => {
    downloadCsvFile('students-bulk-template.csv', BULK_STUDENT_CSV_TEMPLATE)
    toast.success('Template downloaded')
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = parseBulkStudentCsv(text)
      if (parsed.length === 0) {
        toast.error('No student rows found in the CSV file')
        return
      }
      setRows(mapCsvToRows(parsed))
      toast.success(`Loaded ${parsed.length} row(s) from CSV`)
    } catch {
      toast.error('Failed to read CSV file')
    } finally {
      e.target.value = ''
    }
  }

  const updateRow = (id: string, field: keyof BulkStudentRow, value: string) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row
        const next = { ...row, [field]: value, status: 'idle' as const, errorMessage: undefined }
        if (field === 'phoneNo' && !row.password.trim()) {
          next.password = value.trim()
        }
        if (field === 'password' && !value.trim()) {
          next.password = next.phoneNo.trim()
        }
        return next
      }),
    )
  }

  const removeRow = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id))
  }

  const validateRow = (row: BulkStudentRow): string | null => {
    if (!row.name.trim()) return 'Name is required'
    if (!row.rollNo.trim()) return 'Roll number is required'
    if (!row.admissionYear.trim()) return 'Admission year is required'
    if (!row.phoneNo.trim()) return 'Phone number is required'
    if (!row.password.trim()) return 'Password is required'
    if (row.password.trim().length < 6) return 'Password must be at least 6 characters'
    return null
  }

  const handleCreateAll = async () => {
    if (rows.length === 0) {
      toast.error('Add at least one student row')
      return
    }

    if (!user?.instituteId || !user?.adminId) {
      toast.error('Teacher session is invalid. Please log in again.')
      return
    }

    const validationErrors = rows
      .map((row, index) => {
        const error = validateRow(row)
        return error ? `Row ${index + 1}: ${error}` : null
      })
      .filter(Boolean)

    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]!)
      return
    }

    setCreating(true)
    setCreateProgress({ done: 0, total: rows.length })

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < rows.length; i += 1) {
      const row = rows[i]!
      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, status: 'creating', errorMessage: undefined } : r,
        ),
      )

      try {
        await createStudent({
          instituteId: user.instituteId,
          adminId: user.adminId,
          name: row.name.trim(),
          rollNo: row.rollNo.trim(),
          admissionYear: row.admissionYear.trim(),
          phoneNo: row.phoneNo.trim(),
          password: row.password.trim(),
        })
        successCount += 1
        setRows((prev) =>
          prev.map((r) =>
            r.id === row.id ? { ...r, status: 'success', errorMessage: undefined } : r,
          ),
        )
      } catch (error) {
        failCount += 1
        const message = getErrorMessage(error, 'Failed to create student')
        setRows((prev) =>
          prev.map((r) =>
            r.id === row.id ? { ...r, status: 'error', errorMessage: message } : r,
          ),
        )
      }

      setCreateProgress({ done: i + 1, total: rows.length })
    }

    setCreating(false)

    if (failCount === 0) {
      toast.success(`Created ${successCount} student(s)`)
    } else {
      toast.error(`Created ${successCount}, failed ${failCount}`)
    }
  }

  const statusClass = (status: RowStatus) => {
    if (status === 'success') {
      return theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
    }
    if (status === 'error') {
      return theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
    }
    if (status === 'creating') {
      return theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-50'
    }
    return ''
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <Link
          to="/teacher/dashboard/students"
          className={`mb-4 inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-amber-500 ${mutedClass}`}
        >
          <ArrowLeft size={16} />
          Back to students
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-amber-500/15 text-amber-500">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Bulk add students
              </h1>
              <p className={`mt-1 text-sm ${mutedClass}`}>
                Download the CSV template, fill it locally, upload, review rows, then
                create students one by one.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={`mb-6 flex flex-wrap gap-3 rounded-xl border p-4 shadow-sm ${cardClass}`}>
        <Button
          type="button"
          variant="secondary"
          icon={Download}
          onClick={handleDownloadTemplate}
        >
          Download example CSV
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileUpload}
        />
        <Button
          type="button"
          variant="primary"
          icon={Upload}
          onClick={() => fileInputRef.current?.click()}
        >
          Upload CSV
        </Button>

        <p className={`w-full text-xs ${mutedClass}`}>
          Columns: name, rollNo, admissionYear, phoneNo, password. If password is empty,
          phone number is used as the password.
        </p>
      </div>

      {rows.length > 0 && (
        <>
          <div className={`mb-6 overflow-hidden rounded-xl border shadow-sm ${cardClass}`}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead>
                  <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                    <th className="px-3 py-3 font-medium">Name</th>
                    <th className="px-3 py-3 font-medium">Roll No</th>
                    <th className="px-3 py-3 font-medium">Admission Year</th>
                    <th className="px-3 py-3 font-medium">Phone</th>
                    <th className="px-3 py-3 font-medium">Password</th>
                    <th className="px-3 py-3 text-right font-medium">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className={`border-b last:border-b-0 ${tableRowClass} ${statusClass(row.status)}`}
                    >
                      <td className="px-3 py-2 align-top">
                        <input
                          value={row.name}
                          onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                          disabled={creating}
                          className={`w-full min-w-[8rem] rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 disabled:opacity-60 ${inputClass}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          value={row.rollNo}
                          onChange={(e) => updateRow(row.id, 'rollNo', e.target.value)}
                          disabled={creating}
                          className={`w-full min-w-[7rem] rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 disabled:opacity-60 ${inputClass}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          value={row.admissionYear}
                          onChange={(e) =>
                            updateRow(row.id, 'admissionYear', e.target.value)
                          }
                          disabled={creating}
                          className={`w-full min-w-[6rem] rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 disabled:opacity-60 ${inputClass}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          value={row.phoneNo}
                          onChange={(e) => updateRow(row.id, 'phoneNo', e.target.value)}
                          disabled={creating}
                          className={`w-full min-w-[7rem] rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 disabled:opacity-60 ${inputClass}`}
                        />
                      </td>
                      <td className="px-3 py-2 align-top">
                        <input
                          value={row.password}
                          onChange={(e) => updateRow(row.id, 'password', e.target.value)}
                          disabled={creating}
                          className={`w-full min-w-[7rem] rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 disabled:opacity-60 ${inputClass}`}
                        />
                        {row.status === 'error' && row.errorMessage && (
                          <p className="mt-1 text-xs text-red-500">{row.errorMessage}</p>
                        )}
                        {row.status === 'success' && (
                          <p className="mt-1 text-xs text-emerald-500">Created</p>
                        )}
                      </td>
                      <td className="px-3 py-2 align-top text-right">
                        <Button
                          type="button"
                          variant="danger"
                          icon={Trash2}
                          disabled={creating}
                          title="Remove row"
                          aria-label="Remove row"
                          className="!px-2.5 !py-2.5"
                          onClick={() => removeRow(row.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`rounded-xl border p-4 shadow-sm ${cardClass}`}>
            <Button
              type="button"
              variant="primary"
              loading={creating}
              disabled={rows.length === 0}
              onClick={() => void handleCreateAll()}
            >
              {creating
                ? `Creating ${createProgress.done} of ${createProgress.total}…`
                : `Create ${rows.length} student(s)`}
            </Button>
            <p className={`mt-2 text-xs ${mutedClass}`}>
              Each row is sent to the API one at a time. Fix or remove failed rows and
              run again for remaining students.
            </p>
          </div>
        </>
      )}

      {rows.length === 0 && (
        <div className={`rounded-xl border py-16 text-center text-sm shadow-sm ${cardClass} ${mutedClass}`}>
          Download the template or upload a CSV to preview and edit students here.
        </div>
      )}
    </div>
  )
}
