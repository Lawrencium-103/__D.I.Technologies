import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/edutech', label: 'EduTech' },
  { to: '/ai-hub', label: 'AI Hub' },
  { to: '/s-sme', label: 'S-SME' },
  { to: '/blog', label: 'Blog' },
  { to: '/research', label: 'Research' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50">
        <nav className={`flex items-center justify-between px-5 sm:px-8 h-16 sm:h-[72px] transition-all duration-300 ${
          scrolled ? 'bg-[var(--color-paper)]/92 backdrop-blur-md border-b border-[var(--color-line)]' : 'bg-transparent'
        }`}>
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <span className="w-9 h-9 flex items-center justify-center bg-[var(--color-burnt)] text-[var(--color-paper)] font-[var(--font-display)] font-bold text-lg leading-none">D</span>
            <span className="font-[var(--font-display)] font-bold text-[var(--color-ink)] text-lg tracking-tight leading-none">
              DIT
              <small className="block text-[0.5rem] font-medium tracking-[0.22em] uppercase text-[var(--color-ink-faint)] -mt-0.5">Dara Initiative Tech</small>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3.5 py-2 text-[0.95rem] font-medium transition-colors no-underline ${
                  pathname === l.to ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)] hover:text-[var(--color-burnt)]'
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/contact" className="btn btn-primary ml-3 !py-2.5 !px-5 !text-sm">Book a Call</Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2 text-[var(--color-ink)]"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile panel */}
      <div className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div className={`absolute top-0 right-0 w-[80%] max-w-[300px] h-dvh bg-[var(--color-paper)] border-l border-[var(--color-line)] flex flex-col pt-20 pb-8 px-6 gap-1 transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-3 text-[1.1rem] font-medium no-underline ${
                pathname === l.to ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/research" className="px-3 py-3 text-[1.1rem] font-medium no-underline text-[var(--color-ink)]">Research</Link>
          <Link to="/contact" className="btn btn-primary mt-4 justify-center">Book a Call</Link>
        </div>
      </div>
    </>
  )
}
