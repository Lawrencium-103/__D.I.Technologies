import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import FloatingCTA from './FloatingCTA'
import DITLoader from './DITLoader'

export default function Layout() {
  const { pathname } = useLocation()
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    setPageLoading(true)
    const timer = setTimeout(() => {
      setPageLoading(false)
    }, 450)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col relative">
      {pageLoading && <DITLoader isFullPage={true} />}
      <Navbar />
      <main className="flex-1"><Outlet /></main>
      <Footer />
      <FloatingCTA />
    </div>
  )
}
