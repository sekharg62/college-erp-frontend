import { Mail, MapPin, Phone } from 'lucide-react'
import { SITE_CONFIG } from '../../constants/siteConfig'
import { getHomeTheme } from '../../theme/home'
import { useTheme } from '../../context/ThemeContext'

export default function HomeFooter() {
  const { theme } = useTheme()
  const t = getHomeTheme(theme)

  return (
    <footer className={`border-t px-4 py-10 sm:px-6 ${t.footer} ${t.sectionBorder}`}>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={`text-lg font-bold ${t.heading}`}>{SITE_CONFIG.brandName}</p>
          <p className={`mt-1 max-w-xs text-sm ${t.muted}`}>{SITE_CONFIG.tagline}</p>
        </div>

        <div className={`flex flex-col gap-3 text-sm ${t.muted}`}>
          <a
            href={`mailto:${SITE_CONFIG.support.email}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-amber-500"
          >
            <Mail size={16} className="text-amber-500" aria-hidden />
            {SITE_CONFIG.support.email}
          </a>
          <span className="inline-flex items-center gap-2">
            <Phone size={16} className="text-amber-500" aria-hidden />
            {SITE_CONFIG.support.phone}
          </span>
          <span className="inline-flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-amber-500" aria-hidden />
            {SITE_CONFIG.contact.address}
          </span>
        </div>
      </div>

      <p className={`mx-auto mt-8 max-w-5xl border-t pt-6 text-center text-xs ${t.subtle} ${t.sectionBorder}`}>
        © {SITE_CONFIG.legal.copyrightYear} {SITE_CONFIG.legal.copyrightHolder}. Support
        hours: {SITE_CONFIG.support.hours}
      </p>
    </footer>
  )
}
