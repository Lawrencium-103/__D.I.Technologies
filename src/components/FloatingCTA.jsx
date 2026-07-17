import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Phone } from 'lucide-react'

export default function FloatingCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.55)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!show) return null

  return (
    <Link
      to="/contact"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 btn btn-primary !py-3 !px-5 shadow-[4px_4px_0_var(--color-ink)]"
    >
      <Phone size={16} />
      Book a Call
    </Link>
  )
}
