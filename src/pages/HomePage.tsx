import HomeFeatures from '../components/home/HomeFeatures'
import HomeFooter from '../components/home/HomeFooter'
import HomeHero from '../components/home/HomeHero'
import HomeHowItWorks from '../components/home/HomeHowItWorks'
import HomePortals from '../components/home/HomePortals'
import HomeStatsBar from '../components/home/HomeStatsBar'
import { getHomeTheme } from '../theme/home'
import { useTheme } from '../context/ThemeContext'

export default function HomePage() {
  const { theme } = useTheme()
  const t = getHomeTheme(theme)

  return (
    <main className={`min-h-screen pt-16 transition-colors ${t.page}`}>
      <HomeHero />
      <HomeStatsBar />
      <HomeFeatures />
      <HomeHowItWorks />
      <HomePortals />
      <HomeFooter />
    </main>
  )
}
