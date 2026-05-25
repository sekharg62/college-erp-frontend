import type { LucideIcon } from 'lucide-react'
import {
  Award,
  BarChart3,
  CheckCircle2,
  FileText,
  GraduationCap,
  Layers,
  Shield,
  Sparkles,
  Upload,
  Users,
} from 'lucide-react'

export type HomePortal = {
  id: 'student' | 'teacher' | 'admin'
  title: string
  tagline: string
  description: string
  loginPath: string
  setupPath?: string
  icon: LucideIcon
  accent: string
  accentBg: string
  buttonClass: string
  glowClass: string
}

export const HOME_PORTALS: HomePortal[] = [
  {
    id: 'student',
    title: 'Student',
    tagline: 'Submit & track MAAR',
    description:
      'Sign in with your roll number, upload activity proofs by program year, and monitor approval status in one place.',
    loginPath: '/student',
    icon: GraduationCap,
    accent: 'text-amber-400',
    accentBg: 'bg-gradient-to-br from-amber-400/25 to-amber-600/10',
    buttonClass:
      'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500',
    glowClass: 'shadow-amber-500/20',
  },
  {
    id: 'teacher',
    title: 'Teacher',
    tagline: 'Review & approve',
    description:
      'Browse submissions by year, approve activities, manage students, export reports, and reach students quickly.',
    loginPath: '/teacher',
    icon: Users,
    accent: 'text-sky-400',
    accentBg: 'bg-gradient-to-br from-sky-400/25 to-cyan-600/10',
    buttonClass:
      'bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-cyan-500',
    glowClass: 'shadow-sky-500/20',
  },
  {
    id: 'admin',
    title: 'Admin',
    tagline: 'Institute setup',
    description:
      'Configure your institute, create departments, onboard teachers, and keep your organization ready for MAAR.',
    loginPath: '/admin/login',
    setupPath: '/admin',
    icon: Shield,
    accent: 'text-violet-400',
    accentBg: 'bg-gradient-to-br from-violet-400/25 to-purple-600/10',
    buttonClass:
      'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-400 hover:to-purple-500',
    glowClass: 'shadow-violet-500/20',
  },
]

export const HOME_STATS = [
  { value: '17+', label: 'MAAR activity categories', icon: Layers },
  { value: '4', label: 'Program years', icon: BarChart3 },
  { value: '3', label: 'Dedicated portals', icon: Sparkles },
] as const

export const HOME_FEATURES = [
  {
    title: 'Year-wise submissions',
    description: 'Organize proofs and points across 1st through 4th year dashboards.',
    icon: Upload,
  },
  {
    title: 'Structured MAAR list',
    description: 'Activities, sub-activities, and point caps aligned to official requirements.',
    icon: FileText,
  },
  {
    title: 'Teacher review workflow',
    description: 'Approve submissions, search students, and download activity reports as PDF.',
    icon: CheckCircle2,
  },
  {
    title: 'Institute administration',
    description: 'Departments, teachers, and institute profile managed from the admin portal.',
    icon: Award,
  },
] as const

export const HOME_STEPS = [
  {
    step: '01',
    title: 'Institute setup',
    body: 'Admin creates the institute, departments, and teacher accounts.',
    icon: Shield,
  },
  {
    step: '02',
    title: 'Student submissions',
    body: 'Students upload MAAR proofs by academic year with activity details.',
    icon: GraduationCap,
  },
  {
    step: '03',
    title: 'Review & records',
    body: 'Teachers verify, approve, and export reports with signatures on file.',
    icon: Users,
  },
] as const
