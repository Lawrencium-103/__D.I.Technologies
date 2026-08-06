import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const solutions = [
  { to: '/edutech', label: 'SomaBox (EduTech)', desc: 'Offline AI tutor for schools' },
  { to: '/ai-hub', label: 'AI Training Hub', desc: 'Hands-on AI skills' },
  { to: '/s-sme', label: 'S-SME', desc: 'Sustainable SMEs' },
]

const topLinks = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/research', label: 'Research' },
  { to: '/open-models', label: 'Open Models' },
  { to: '/about', label: 'About' },
]

const isSolutionPath = (pathname) => solutions.some((s) => pathname === s.to || pathname.startsWith(s.to + '/'))

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [solOpen, setSolOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false); setSolOpen(false) }, [pathname])

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
            <Link
              to="/"
              className={`px-3.5 py-2 text-[0.95rem] font-medium transition-colors no-underline ${
                pathname === '/' ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)] hover:text-[var(--color-burnt)]'
              }`}
            >
              Home
            </Link>

            {/* Solutions dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolOpen(true)}
              onMouseLeave={() => setSolOpen(false)}
            >
              <button
                onClick={() => setSolOpen(!solOpen)}
                aria-expanded={solOpen}
                className={`flex items-center gap-1 px-3.5 py-2 text-[0.95rem] font-medium transition-colors cursor-pointer ${
                  isSolutionPath(pathname) || solOpen ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)] hover:text-[var(--color-burnt)]'
                }`}
              >
                Solutions <ChevronDown size={15} className={`transition-transform ${solOpen ? 'rotate-180' : ''}`} />
              </button>
              <div className={`absolute top-full left-0 mt-1 w-60 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[6px_6px_0_var(--color-ink)] p-2 flex flex-col gap-1 transition-all duration-200 ${
                solOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1 pointer-events-none'
              }`}>
                {solutions.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className={`px-3 py-2.5 no-underline group ${
                      pathname === s.to ? 'bg-[var(--color-paper-2)]' : ''
                    }`}
                  >
                    <span className={`block text-[0.95rem] font-medium ${pathname === s.to ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)] group-hover:text-[var(--color-burnt)]'}`}>{s.label}</span>
                    <span className="block text-[0.75rem] text-[var(--color-ink-faint)]">{s.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            {topLinks.slice(1).map(l => (
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
        <div className={`absolute top-0 right-0 w-[80%] max-w-[300px] h-dvh bg-[var(--color-paper)] border-l border-[var(--color-line)] flex flex-col pt-20 pb-8 px-6 gap-1 overflow-y-auto transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <Link
            to="/"
            className={`px-3 py-3 text-[1.1rem] font-medium no-underline ${pathname === '/' ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)]'}`}
          >
            Home
          </Link>

          {/* Mobile Solutions expander */}
          <button
            onClick={() => setSolOpen(!solOpen)}
            aria-expanded={solOpen}
            className={`flex items-center justify-between w-full px-3 py-3 text-[1.1rem] font-medium text-left cursor-pointer ${
              isSolutionPath(pathname) || solOpen ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)]'
            }`}
          >
            Solutions <ChevronDown size={18} className={`transition-transform ${solOpen ? 'rotate-180' : ''}`} />
          </button>
          {solOpen && (
            <div className="flex flex-col gap-1 pb-1">
              {solutions.map(s => (
                <Link
                  key={s.to}
                  to={s.to}
                  className={`px-6 py-2.5 text-[1rem] font-medium no-underline ${
                    pathname === s.to ? 'text-[var(--color-burnt)]' : 'text-[var(--color-ink)]'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </div>
          )}

          {topLinks.slice(1).map(l => (
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
          <Link to="/contact" className="btn btn-primary mt-4 justify-center">Book a Call</Link>
        </div>
      </div>
    </>
  )
}
