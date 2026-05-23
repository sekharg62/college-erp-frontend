import axios from 'axios'
import { GraduationCap, Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import Button from '../../components/uis/Button'
import Input from '../../components/uis/Input'
import TableListToolbar from '../../components/uis/TableListToolbar'
import { useTheme } from '../../context/ThemeContext'
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
  type Department,
} from '../../services/Department.service'

function getErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] }
    if (Array.isArray(data?.message)) return data.message.join(', ')
    if (typeof data?.message === 'string') return data.message
  }
  if (error instanceof Error) return error.message
  return fallback
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function AdminDepartmentPage() {
  const { theme } = useTheme()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
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

  const fetchDepartments = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDepartments()
      setDepartments(data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load departments'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchDepartments()
  }, [fetchDepartments])

  const filteredDepartments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return departments
    return departments.filter((department) =>
      department.name.toLowerCase().includes(query),
    )
  }, [departments, searchQuery])

  const totalCount = departments.length

  const resetForm = () => {
    setName('')
    setEditingId(null)
    setShowForm(false)
  }

  const openCreate = () => {
    setEditingId(null)
    setName('')
    setShowForm(true)
  }

  const openEdit = (department: Department) => {
    setEditingId(department.id)
    setName(department.name)
    setShowForm(true)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Department name is required')
      return
    }

    setSubmitting(true)
    try {
      if (editingId) {
        await updateDepartment(editingId, { name: trimmed })
        toast.success('Department updated')
      } else {
        await createDepartment({ name: trimmed })
        toast.success('Department created')
      }
      resetForm()
      await fetchDepartments()
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          editingId ? 'Failed to update department' : 'Failed to create department',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (department: Department) => {
    const confirmed = window.confirm(
      `Delete department "${department.name}"? This cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await deleteDepartment(department.id)
      toast.success('Department deleted')
      if (editingId === department.id) resetForm()
      await fetchDepartments()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete department'))
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
            <GraduationCap size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Departments
            </h1>
            <p className={`mt-1 text-sm ${mutedClass}`}>
              Create, edit, and manage departments.
            </p>
          </div>
        </div>

        {!showForm && (
          <Button type="button" variant="primary" icon={Plus} onClick={openCreate}>
            Add Department
          </Button>
        )}
      </div>

      {showForm && (
        <div className={`mb-6 rounded-md border p-6 shadow-sm ${cardClass}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {editingId ? 'Edit Department' : 'New Department'}
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Department name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Computer Science"
                disabled={submitting}
                required
              />
            </div>
            <div className="flex gap-2">
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
        {loading ? (
          <div className={`flex items-center justify-center gap-2 py-16 ${mutedClass}`}>
            <Loader2 size={22} className="animate-spin text-amber-500" />
            Loading departments…
          </div>
        ) : (
          <>
            <TableListToolbar
              totalCount={totalCount}
              filteredCount={filteredDepartments.length}
              itemLabel="department"
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search departments…"
            />

            {totalCount === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No departments yet. Click &quot;Add Department&quot; to create one.
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className={`py-16 text-center text-sm ${mutedClass}`}>
                No departments match your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[32rem] text-left text-sm">
                  <thead>
                    <tr className={`border-b ${tableRowClass} ${tableHeadClass}`}>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Created</th>
                      <th className="px-4 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDepartments.map((department) => (
                      <tr
                        key={department.id}
                        className={`border-b last:border-b-0 ${tableRowClass}`}
                      >
                        <td className="px-4 py-3 font-medium">{department.name}</td>
                        <td className={`px-4 py-3 ${mutedClass}`}>
                          {formatDate(department.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              icon={Pencil}
                              onClick={() => openEdit(department)}
                              title="Edit"
                              aria-label="Edit department"
                              className="!h-9 !w-9 !px-0"
                            />
                            <Button
                              type="button"
                              variant="danger"
                              icon={Trash2}
                              onClick={() => void handleDelete(department)}
                              title="Delete"
                              aria-label="Delete department"
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
