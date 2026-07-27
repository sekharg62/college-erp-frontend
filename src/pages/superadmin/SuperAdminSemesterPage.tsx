import axios from 'axios'
import { Calendar, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { toast } from 'sonner'
import Button from '../../components/uis/Button'
import CustomDropdown from '../../components/uis/CustomDropdown'
import Input from '../../components/uis/Input'
import TableListToolbar from '../../components/uis/TableListToolbar'
import { useTheme } from '../../context/ThemeContext'
import { getDepartments, type Department } from '../../services/Department.service'
import {
  createSemester,
  deleteSemester,
  getSemestersByDepartment,
  updateSemester,
  type CreateSemesterInput,
  type Semester,
} from '../../services/Semester.service'

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

type SemesterFormState = {
  departmentId: string
  number: string
  label: string
  sortOrder: string
}

const emptyForm = (departmentId: string): SemesterFormState => ({
  departmentId,
  number: '',
  label: '',
  sortOrder: '',
})

export default function SuperAdminSemesterPage() {
  const { theme } = useTheme()
  const [departments, setDepartments] = useState<Department[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('')
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [loadingSemesters, setLoadingSemesters] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<SemesterFormState>(emptyForm(''))
  const [searchQuery, setSearchQuery] = useState('')

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const tableHeadClass =
    theme === 'dark' ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-600'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const departmentOptions = useMemo(
    () =>
      departments.map((department) => ({
        value: department.id,
        label: `${department.name} (${department.departmentCode})`,
      })),
    [departments],
  )

  const departmentNameById = useCallback(
    (id: string) => departments.find((d) => d.id === id)?.name ?? '—',
    [departments],
  )

  const fetchDepartments = useCallback(async () => {
    setLoadingDepartments(true)
    try {
      const data = await getDepartments()
      setDepartments(data)
      setSelectedDepartmentId((prev) => prev || data[0]?.id || '')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load departments'))
    } finally {
      setLoadingDepartments(false)
    }
  }, [])

  const fetchSemesters = useCallback(async (departmentId: string) => {
    if (!departmentId) {
      setSemesters([])
      return
    }

    setLoadingSemesters(true)
    try {
      const data = await getSemestersByDepartment(departmentId)
      setSemesters(data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load semesters'))
      setSemesters([])
    } finally {
      setLoadingSemesters(false)
    }
  }, [])

  useEffect(() => {
    void fetchDepartments()
  }, [fetchDepartments])

  useEffect(() => {
    if (selectedDepartmentId) {
      void fetchSemesters(selectedDepartmentId)
    }
  }, [selectedDepartmentId, fetchSemesters])

  const filteredSemesters = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return semesters
    return semesters.filter(
      (semester) =>
        semester.label.toLowerCase().includes(query) ||
        String(semester.number).includes(query) ||
        String(semester.sortOrder).includes(query),
    )
  }, [semesters, searchQuery])

  const sortedSemesters = useMemo(
    () => [...filteredSemesters].sort((a, b) => a.sortOrder - b.sortOrder),
    [filteredSemesters],
  )

  const resetForm = () => {
    setForm(emptyForm(selectedDepartmentId))
    setEditingId(null)
    setShowForm(false)
  }

  const openCreate = () => {
    if (!selectedDepartmentId) {
      toast.error('Select a department first')
      return
    }
    setEditingId(null)
    setForm(emptyForm(selectedDepartmentId))
    setShowForm(true)
  }

  const openEdit = (semester: Semester) => {
    setEditingId(semester.id)
    setForm({
      departmentId: semester.departmentId,
      number: String(semester.number),
      label: semester.label,
      sortOrder: String(semester.sortOrder),
    })
    setShowForm(true)
  }

  const parseFormPayload = (): CreateSemesterInput | null => {
    const number = Number(form.number)
    const sortOrder = Number(form.sortOrder)

    if (!form.departmentId) {
      toast.error('Department is required')
      return null
    }
    if (!Number.isInteger(number) || number < 1) {
      toast.error('Semester number must be a positive integer')
      return null
    }
    if (!form.label.trim()) {
      toast.error('Label is required')
      return null
    }
    if (!Number.isInteger(sortOrder) || sortOrder < 0) {
      toast.error('Sort order must be a non-negative integer')
      return null
    }

    return {
      departmentId: form.departmentId,
      number,
      label: form.label.trim(),
      sortOrder,
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = parseFormPayload()
    if (!payload) return

    setSubmitting(true)
    try {
      if (editingId) {
        await updateSemester(editingId, payload)
        toast.success('Semester updated')
      } else {
        await createSemester(payload)
        toast.success('Semester created')
      }
      resetForm()
      setSelectedDepartmentId(payload.departmentId)
      await fetchSemesters(payload.departmentId)
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          editingId ? 'Failed to update semester' : 'Failed to create semester',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (semester: Semester) => {
    const confirmed = window.confirm(
      `Delete "${semester.label}"? This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await deleteSemester(semester.id)
      toast.success('Semester deleted')
      if (editingId === semester.id) resetForm()
      await fetchSemesters(semester.departmentId)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete semester'))
    }
  }

  const updateField =
    (field: keyof SemesterFormState) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setForm((prev) => {
        const next = { ...prev, [field]: value }
        if (field === 'number' && value && !prev.label.trim()) {
          next.label = `Semester ${value}`
        }
        if (field === 'number' && value && !prev.sortOrder.trim()) {
          next.sortOrder = value
        }
        return next
      })
    }

  const loading = loadingDepartments || loadingSemesters
  const totalCount = semesters.length

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-500">
            <Calendar size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Semesters
            </h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Manage semesters per department.
            </p>
          </div>
        </div>

        {!showForm && departments.length > 0 && (
          <Button type="button" variant="primary" icon={Plus} onClick={openCreate}>
            Add Semester
          </Button>
        )}
      </div>

      <div className={`mb-6 rounded-md border p-4 shadow-sm ${cardClass}`}>
        <CustomDropdown
          id="filterDepartmentId"
          label="Department"
          value={selectedDepartmentId}
          onChange={(departmentId) => {
            setSelectedDepartmentId(departmentId)
            if (!showForm) setForm(emptyForm(departmentId))
          }}
          options={departmentOptions}
          placeholder="Select department"
          searchPlaceholder="Search departments…"
          emptyMessage="No departments yet. Create one under Departments first."
          disabled={loadingDepartments || departments.length === 0}
          required
        />
      </div>

      {showForm && (
        <div className={`mb-6 rounded-md border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Semester' : 'New Semester'}
            </h2>
            <Button
              type="button"
              variant="cancel"
              icon={X}
              onClick={resetForm}
              aria-label="Close form"
              className="!px-2.5"
            />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <CustomDropdown
                id="formDepartmentId"
                label="Department"
                value={form.departmentId}
                onChange={(departmentId) =>
                  setForm((prev) => ({ ...prev, departmentId }))
                }
                options={departmentOptions}
                placeholder="Select department"
                searchPlaceholder="Search departments…"
                emptyMessage="No departments available"
                disabled={submitting}
                required
              />
              <Input
                label="Semester number"
                name="number"
                type="number"
                min={1}
                step={1}
                value={form.number}
                onChange={updateField('number')}
                placeholder="e.g. 5"
                disabled={submitting}
                required
              />
              <Input
                label="Label"
                name="label"
                value={form.label}
                onChange={updateField('label')}
                placeholder="e.g. Semester 5"
                disabled={submitting}
                required
              />
              <Input
                label="Sort order"
                name="sortOrder"
                type="number"
                min={0}
                step={1}
                value={form.sortOrder}
                onChange={updateField('sortOrder')}
                placeholder="e.g. 5"
                disabled={submitting}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="cancel"
                icon={X}
                onClick={resetForm}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={editingId ? Save : Plus}
                loading={submitting}
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className={`overflow-hidden rounded-md border shadow-sm ${cardClass}`}>
        {loadingDepartments ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin text-rose-500" />
            Loading…
          </div>
        ) : departments.length === 0 ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            No departments found. Create a department first.
          </div>
        ) : !selectedDepartmentId ? (
          <div className={`py-16 text-center text-sm ${mutedClass}`}>
            Select a department to view semesters.
          </div>
        ) : loading ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin text-rose-500" />
            Loading semesters…
          </div>
        ) : (
          <>
            <TableListToolbar
              totalCount={totalCount}
              filteredCount={sortedSemesters.length}
              itemLabel="semester"
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search by label, number, or sort order…"
            />

            {totalCount === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No semesters for {departmentNameById(selectedDepartmentId)}. Click
                &quot;Add Semester&quot; to create one.
              </div>
            ) : sortedSemesters.length === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No semesters match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[40rem] text-left text-sm">
                  <thead>
                    <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                      <th className="px-4 py-3 font-semibold">#</th>
                      <th className="px-4 py-3 font-semibold">Label</th>
                      <th className="px-4 py-3 font-semibold">Sort order</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSemesters.map((semester) => (
                      <tr
                        key={semester.id}
                        className={`border-b last:border-b-0 ${tableRowClass}`}
                      >
                        <td className="px-4 py-3 font-medium tabular-nums">
                          {semester.number}
                        </td>
                        <td className="px-4 py-3">{semester.label}</td>
                        <td className={`px-4 py-3 tabular-nums ${mutedClass}`}>
                          {semester.sortOrder}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              icon={Pencil}
                              onClick={() => openEdit(semester)}
                              title="Edit"
                              aria-label="Edit semester"
                              className="!h-9 !w-9 !px-0"
                            />
                            <Button
                              type="button"
                              variant="danger"
                              icon={Trash2}
                              onClick={() => void handleDelete(semester)}
                              title="Delete"
                              aria-label="Delete semester"
                              className="!h-9 !w-9 !px-0"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
