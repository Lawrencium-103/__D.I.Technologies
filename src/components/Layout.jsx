import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingCTA from './FloatingCTA'
import DITLoader from './DITLoader'

export default function Layout() {
  const { pathname } = useLocation()
  const [initialLoad, setInitialLoad] = useState(true)

  // Only show the loader on the very first visit
  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), 1400)
    return () => clearTimeout(timer)
  }, [])

  // Restore scroll position instantly on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col relative">
      {initialLoad && <DITLoader isFullPage={true} />}
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}
