import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingCTA from './FloatingCTA'

export default function Layout() {
  const { pathname } = useLocation()

  // Restore scroll position instantly on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}
