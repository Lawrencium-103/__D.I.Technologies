import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-[var(--color-paper)]">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr] gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 flex items-center justify-center bg-[var(--color-burnt)] text-[var(--color-paper)] font-[var(--font-display)] font-bold text-lg leading-none">D</span>
              <span className="font-[var(--font-display)] font-bold text-[var(--color-paper)] text-lg tracking-tight leading-none">
                DIT
                <small className="block text-[0.5rem] font-medium tracking-[0.22em] uppercase text-[var(--color-amber)] -mt-0.5">Dara Initiative Tech</small>
              </span>
            </div>
            <p className="text-[var(--color-paper)]/70 text-[0.95rem] max-w-[42ch]">
              &ldquo;Dara&rdquo; is a Yoruba word meaning <span className="text-[var(--color-amber)] font-semibold">it is good</span>.
              Every product, school visit and promise is held to that standard.
            </p>
            <p className="text-[var(--color-paper)]/45 text-[0.82rem] mt-4">
              Oyo State, Nigeria · Dara Initiative Tech
            </p>
          </div>

          <div>
            <h4 className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-4">Explore</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">Home</Link>
              <Link to="/about" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">About Us</Link>
              <Link to="/edutech" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">EduTech · SomaBox</Link>
              <Link to="/ai-hub" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">AI Hub</Link>
              <Link to="/s-sme" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">S-SME</Link>
              <Link to="/blog" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">Blog</Link>
              <Link to="/framework" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">OpenModel Framework</Link>
              <Link to="/research" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">Research Behind OMSF</Link>
              <Link to="/report" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">Report Builder</Link>
              <Link to="/reports" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors text-sm no-underline">Report Library</Link>
            </div>
          </div>

          <div>
            <h4 className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.2em] text-[var(--color-amber)] mb-4">Contact</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <Link to="/contact" className="text-[var(--color-paper)]/75 hover:text-[var(--color-amber)] transition-colors no-underline">Contact</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--color-paper)]/15 mt-12 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-[var(--color-paper)]/45 text-[0.8rem]">
            &copy; {new Date().getFullYear()} Dara Initiative Technology. Offline-first, open-source-minded.
          </p>
          <p className="text-[var(--color-paper)]/45 text-[0.8rem] font-[var(--font-mono)]">
            Built for underserved Nigerian schools.
          </p>
        </div>
      </div>
    </footer>
  )
}
