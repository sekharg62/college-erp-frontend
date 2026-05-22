import { Download, List } from 'lucide-react'
import { Fragment, useState } from 'react'
import { toast } from 'sonner'
import { MAAR_ACTIVITIES } from '../../constants/maarList'
import { useTheme } from '../../context/ThemeContext'
import { downloadMaarListPdf } from '../../utils/downloadMaarListPdf'

export default function MaarListPage() {
  const { theme } = useTheme()
  const [downloading, setDownloading] = useState(false)

  const cardClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/80'
      : 'border-slate-200 bg-white'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-600'

  const stickyHeadClass =
    theme === 'dark'
      ? 'bg-slate-900 text-slate-400 shadow-[0_1px_0_0_rgb(30_41_59)]'
      : 'bg-slate-50 text-slate-600 shadow-[0_1px_0_0_rgb(226_232_240)]'

  const tableRowClass =
    theme === 'dark' ? 'border-slate-800' : 'border-slate-200'

  const categoryRowClass =
    theme === 'dark' ? 'bg-amber-500/15 text-amber-200' : 'bg-amber-100 text-amber-950'

  const downloadBtnClass =
    theme === 'dark'
      ? 'border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800'
      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'

  const handleDownloadPdf = () => {
    setDownloading(true)
    try {
      downloadMaarListPdf()
      toast.success('MAAR list downloaded as PDF')
    } catch {
      toast.error('Failed to download PDF')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-var(--header-height)-2rem)] max-h-[calc(100dvh-var(--header-height)-2rem)] w-full max-w-6xl min-h-0 flex-col overflow-hidden sm:h-[calc(100dvh-var(--header-height)-3rem)] sm:max-h-[calc(100dvh-var(--header-height)-3rem)] lg:h-[calc(100dvh-var(--header-height)-4rem)] lg:max-h-[calc(100dvh-var(--header-height)-4rem)]">
      <div className="mb-4 flex shrink-0 items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
          <List size={22} />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            MAAR List
          </h1>
          <p className={`mt-1 text-sm ${mutedClass}`}>
            Mandatory Additional Requirements — activities and point values.
          </p>
        </div>
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border shadow-sm ${cardClass}`}
      >
        <div
          className={`flex shrink-0 items-center justify-end border-b px-3 py-2 ${tableRowClass}`}
        >
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            title="Download as PDF (A4)"
            aria-label="Download MAAR list as PDF"
            className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium shadow-sm transition-colors disabled:opacity-60 ${downloadBtnClass}`}
          >
            <Download size={18} className={downloading ? 'animate-pulse' : ''} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>

        <div className="scrollbar-thin min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-3xl border-collapse text-left text-sm">
            <thead className="sticky top-0 z-10">
              <tr className={`border-b ${tableRowClass}`}>
                <th
                  className={`w-12 px-3 py-3 text-left font-semibold ${stickyHeadClass}`}
                >
                  #
                </th>
                <th className={`px-3 py-3 text-left font-semibold ${stickyHeadClass}`}>
                  Activity
                </th>
                <th
                  className={`w-36 px-3 py-3 text-center font-semibold ${stickyHeadClass}`}
                >
                  Points per Activity
                </th>
                <th
                  className={`w-40 px-3 py-3 text-center font-semibold ${stickyHeadClass}`}
                >
                  Permissible Points (max)
                </th>
              </tr>
            </thead>
            <tbody>
              {MAAR_ACTIVITIES.map((category) => (
                <Fragment key={category.no}>
                  <tr className={`border-b ${tableRowClass} ${categoryRowClass}`}>
                    <td className="px-3 py-3 align-top font-semibold">{category.no}</td>
                    <td className="px-3 py-3 font-semibold" colSpan={2}>
                      {category.title}
                    </td>
                    <td className="px-3 py-3 text-center font-semibold">
                      {category.categoryMaxPoints ?? '—'}
                    </td>
                  </tr>
                  {category.items.map((item, index) => (
                    <tr
                      key={`${category.no}-${index}`}
                      className={`border-b ${tableRowClass}`}
                    >
                      <td className="px-3 py-2 align-top" />
                      <td className="px-3 py-2">
                        {item.label && (
                          <span className="mr-1 font-medium">{item.label})</span>
                        )}
                        {item.activity}
                      </td>
                      <td className="px-3 py-2 text-center font-medium">
                        {item.pointsPerActivity}
                      </td>
                      <td className="px-3 py-2 text-center font-medium">
                        {item.permissibleMax}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
