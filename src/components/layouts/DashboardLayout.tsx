import type { LucideIcon } from 'lucide-react'
import {
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import { useState, type CSSProperties, type ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTheme, type Theme } from '../../context/ThemeContext'

export type DashboardNavItem = {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export type DashboardLayoutProps = {
  portalLabel: string
  user: { name: string } | null
  onLogout: () => void
  loginPath: string
  navItems: readonly DashboardNavItem[]
}

const SIDEBAR_COLLAPSED = '4rem'
const SIDEBAR_EXPANDED = '15rem'
const ICON_SLOT = '4rem'
const HEADER_HEIGHT = '4rem'

const getSidebarLinkClass = (isActive: boolean, theme: Theme) => {
  if (theme === 'dark') {
    return isActive
      ? 'bg-amber-500/15 text-amber-400'
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
  }
  return isActive
    ? 'bg-amber-500/15 text-amber-600'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
}

function SidebarLabel({
  children,
  forceShow,
}: {
  children: ReactNode
  forceShow: boolean
}) {
  return (
    <span
      className={`block min-w-0 overflow-hidden whitespace-nowrap pr-3 transition-[max-width,opacity] duration-300 ease-in-out ${
        forceShow
          ? 'max-w-[calc(var(--sidebar-expanded)-var(--icon-slot))] opacity-100'
          : 'max-w-0 opacity-0 lg:group-hover/sidebar:max-w-[calc(var(--sidebar-expanded)-var(--icon-slot))] lg:group-hover/sidebar:opacity-100'
      }`}
    >
      {children}
    </span>
  )
}

function SidebarIconSlot({ children }: { children: ReactNode }) {
  return (
    <span
      className="flex h-11 w-(--icon-slot) shrink-0 items-center justify-center"
      style={{ '--icon-slot': ICON_SLOT } as CSSProperties}
    >
      {children}
    </span>
  )
}

export default function DashboardLayout({
  portalLabel,
  user,
  onLogout,
  loginPath,
  navItems,
}: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const shellClass =
    theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'

  const sidebarClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900'
      : 'border-slate-200 bg-white'

  const headerClass =
    theme === 'dark'
      ? 'border-slate-800 bg-slate-900/95'
      : 'border-slate-200 bg-white/95'

  const mainClass =
    theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'

  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-slate-500'

  const layoutStyle = {
    '--sidebar-collapsed': SIDEBAR_COLLAPSED,
    '--sidebar-expanded': SIDEBAR_EXPANDED,
    '--icon-slot': ICON_SLOT,
    '--header-height': HEADER_HEIGHT,
  } as CSSProperties

  const handleLogout = () => {
    onLogout()
    toast.success('Logged out successfully')
    navigate(loginPath, { replace: true })
  }

  const showLabels = mobileOpen

  const sidebarContent = (
    <>
      <nav className="flex flex-1 flex-col gap-1 py-2">
        {navItems.map(({ to, label, icon: Icon, end = true }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex h-11 items-center overflow-hidden rounded text-sm font-medium transition-colors ${getSidebarLinkClass(isActive, theme)}`
            }
          >
            <SidebarIconSlot>
              <Icon size={20} className="shrink-0" />
            </SidebarIconSlot>
            <SidebarLabel forceShow={showLabels}>{label}</SidebarLabel>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-inherit py-3">
        <div className="mb-1 flex h-11 items-center overflow-hidden">
          <SidebarIconSlot>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/15 text-sm font-semibold text-amber-500">
              {user?.name?.charAt(0).toUpperCase() ?? 'T'}
            </div>
          </SidebarIconSlot>
          <SidebarLabel forceShow={showLabels}>
            <span className={`truncate text-sm font-medium ${mutedClass}`}>
              {user?.name}
            </span>
          </SidebarLabel>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          className={`flex h-11 w-full items-center overflow-hidden rounded-xl text-sm font-medium transition-colors ${
            theme === 'dark'
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <SidebarIconSlot>
            <LogOut size={20} className="shrink-0" />
          </SidebarIconSlot>
          <SidebarLabel forceShow={showLabels}>Logout</SidebarLabel>
        </button>
      </div>
    </>
  )

  return (
    <div
      className={`flex min-h-screen flex-col ${shellClass}`}
      style={layoutStyle}
    >
      <header
        className={`sticky top-0 z-40 flex h-(--header-height) w-full shrink-0 items-center gap-4 border-b px-4 backdrop-blur sm:px-6 ${headerClass}`}
      >
        <button
          type="button"
          aria-label="Open menu"
          className={`lg:hidden ${mutedClass}`}
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/*         <span className="text-lg font-bold tracking-tight text-amber-500">
          {SITE_CONFIG.brandName}
        </span> */}
        <span className={`hidden text-xs font-medium uppercase sm:inline ${mutedClass}`}>
          {portalLabel} Portal
        </span>

        <p className={`ml-auto hidden text-sm font-medium sm:block ${mutedClass}`}>
          Welcome, <span className="text-amber-500 font-bold">{user?.name}</span>
        </p>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
            theme === 'dark'
              ? 'text-slate-400 hover:bg-slate-800'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <div className="relative flex min-h-[calc(100vh-var(--header-height))] flex-1">
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 top-(--header-height) z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <aside
          className={`group/sidebar fixed top-(--header-height) bottom-0 left-0 z-30 flex flex-col overflow-hidden border-r transition-[width] duration-300 ease-in-out ${sidebarClass} ${
            mobileOpen
              ? 'w-64 translate-x-0'
              : 'w-64 -translate-x-full lg:w-(--sidebar-collapsed) lg:translate-x-0 lg:hover:w-(--sidebar-expanded)'
          }`}
        >
          <button
            type="button"
            aria-label="Close sidebar"
            className={`absolute top-3 right-3 z-10 lg:hidden ${mutedClass}`}
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
          {sidebarContent}
        </aside>

        <main
          className={`min-w-0 flex-1 overflow-auto p-4 sm:p-6 lg:ml-(--sidebar-collapsed) lg:p-8 ${mainClass}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
