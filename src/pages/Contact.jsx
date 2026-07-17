import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const needs = [
  'AI Hub training (individual)',
  'AI Hub training (corporate)',
  'SomaBox for my school',
  'S-SME sustainability audit',
  'Partnership / Collaboration',
  'General enquiry',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', org: '', email: '', need: needs[0], message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Dara Initiative: ${form.need}`)
    const body = encodeURIComponent(`Name: ${form.name}\nOrganisation: ${form.org}\nEmail: ${form.email}\nInterest: ${form.need}\n\nMessage:\n${form.message}`)
    window.location.href = `mailto:oladeji.lawrence@gmail.com?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  const fieldBase = 'w-full px-4 py-3 bg-[var(--color-paper)] border-2 border-[var(--color-ink)] text-[var(--color-ink)] placeholder-[var(--color-ink-faint)] focus:outline-none focus:border-[var(--color-burnt)] rounded-none transition-colors'
  const labelBase = 'block font-[var(--font-mono)] text-[0.7rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] mb-2'

  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-12">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <Link to="/" className="hover:text-[var(--color-burnt)] no-underline">Home</Link> / Contact
            </p>
            <h1 className="max-w-[18ch]">Let us build <span className="text-[var(--color-burnt)]">something that works.</span></h1>
            <p className="text-[1.1rem] max-w-[56ch] mt-5">
              Whether you are a school, a business or a partner, tell us what you need. We respond within 48 hours.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="bg-cream-2 pb-24">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8">
          {/* FORM */}
          <ScrollReveal>
            <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-8 shadow-[8px_8px_0_rgba(26,23,18,0.1)]">
              {status === 'sent' ? (
                <div className="text-center py-12">
                  <CheckCircle2 size={56} className="text-[var(--color-burnt)] mx-auto mb-4" />
                  <h3 className="text-[1.5rem] mb-2 text-[var(--color-ink)]">Your email is ready to send.</h3>
                  <p className="text-[0.95rem] max-w-[40ch] mx-auto mb-6 text-[var(--color-ink-soft)]">
                     Your mail app should have opened with a pre-filled message. Just hit send.
                  </p>
                  <button onClick={() => setStatus('idle')} className="btn btn-ghost">Write another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className={labelBase}>Name</label>
                      <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className={fieldBase} placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="org" className={labelBase}>Organisation (optional)</label>
                      <input id="org" name="org" type="text" value={form.org} onChange={handleChange} className={fieldBase} placeholder="School / business / none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className={labelBase}>Email</label>
                    <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} className={fieldBase} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label htmlFor="need" className={labelBase}>What do you need?</label>
                    <select id="need" name="need" value={form.need} onChange={handleChange} className={`${fieldBase} cursor-pointer`}>
                      {needs.map((n) => (<option key={n} value={n}>{n}</option>))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className={labelBase}>Message</label>
                    <textarea id="message" name="message" rows={5} required value={form.message} onChange={handleChange} className={`${fieldBase} resize-none`} placeholder="Tell us what you are working on..." />
                  </div>
                  <button type="submit" className="btn btn-primary w-full md:w-auto"><Send size={18} /> Send message</button>
                </form>
              )}
            </div>
          </ScrollReveal>

          {/* INFO */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-5">
              {[
                { icon: Mail, label: 'Email', value: 'Email Address', href: 'mailto:oladeji.lawrence@gmail.com' },
                { icon: Phone, label: 'Phone / WhatsApp', value: '+234 903 881 9790', href: 'tel:+2349038819790' },
                { icon: MapPin, label: 'Based in', value: 'Oyo State, Nigeria', href: null },
              ].map((c, i) => (
                <div key={i} className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 flex items-center justify-center bg-[var(--color-burnt)]">
                      <c.icon size={20} className="text-[var(--color-paper)]" />
                    </div>
                    <div>
                      <span className="font-[var(--font-mono)] text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-ink-faint)] block">{c.label}</span>
                      {c.href
                        ? <a href={c.href} className="text-[var(--color-ink)] text-[0.98rem] hover:text-[var(--color-burnt)] no-underline">{c.value}</a>
                        : <span className="text-[var(--color-ink)] text-[0.98rem]">{c.value}</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div className="bg-[var(--color-ink)] border-2 border-[var(--color-ink)] p-6">
                <p className="text-[var(--color-paper)]/80 text-[0.9rem] leading-relaxed">
                  We work across Nigeria, with a focus on Oyo, Ogun and Lagos States. For in-person sessions,
                  schools and businesses in these regions get priority scheduling.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
