import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, WifiOff, Cpu, BookOpen, Zap, Users, Play, ArrowRight } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'

const commands = [
  '/explain - AI tutor that simplifies any topic',
  '/quiz - Test understanding with NERDC-aligned questions',
  '/essay - Write and score essays locally',
  '/vocab - Learn vocabulary with pronunciation',
  '/lab - Science experiments with virtual labs',
  '/math - Step-by-step problem solving',
  '/history - Nigerian & world history lessons',
  '/code - Learn programming fundamentals',
  '/career - Career guidance & mentorship',
  '/summarize - Summarize any topic quickly',
  '/flash - Create study flashcards',
  '/mindmap - Visual concept mapping',
  '/speak - Practice English pronunciation',
  '/yoruba - Yoruba language lessons',
  '/physics - Physics concepts & problems',
  '/biology - Biology lessons & quizzes',
  '/chemistry - Chemistry formulas & reactions',
  '/literature - Literature analysis & writing',
  '/geography - Geography of Nigeria & Africa',
  '/civic - Civic education & government',
  '/reviseclass - Quick revision for any subject',
  '/help - Show all available commands',
  '/status - Check system status',
]

const terminalLines = [
  { type: 'system', text: '╔══════════════════════════════════════════════╗' },
  { type: 'system', text: '║           SOMABOX AI TUTOR v3.2             ║' },
  { type: 'system', text: '║     Offline AI Education Terminal           ║' },
  { type: 'system', text: '╚══════════════════════════════════════════════╝' },
  { type: 'system', text: '' },
  { type: 'system', text: 'Status: ONLINE | Internet: NOT REQUIRED' },
  { type: 'system', text: 'Textbooks: 60+ | Commands: 26 | Students: Unlimited' },
  { type: 'system', text: '' },
  { type: 'prompt', text: 'soma@box ~$ ' },
]

const sampleQuiz = [
  { type: 'system', text: '> /quiz mathematics jss2' },
  { type: 'system', text: '' },
  { type: 'info', text: 'QUESTION 1 of 5 (NERDC Aligned - JSS2 Mathematics)' },
  { type: 'question', text: 'What is the value of 3x + 7 when x = 4?' },
  { type: 'question', text: '  A) 19    B) 21    C) 23    D) 25' },
  { type: 'system', text: '' },
  { type: 'prompt', text: 'soma@box quiz$ ' },
]

const sampleExplain = [
  { type: 'system', text: '> /explain photosynthesis science ss2' },
  { type: 'system', text: '' },
  { type: 'info', text: 'AI TUTOR: Photosynthesis' },
  { type: 'response', text: 'Photosynthesis is how plants make food using sunlight.' },
  { type: 'response', text: '' },
  { type: 'response', text: 'THE SIMPLE VERSION:' },
  { type: 'response', text: '  Plants take in water (H2O) through their roots.' },
  { type: 'response', text: '  They take in carbon dioxide (CO2) through their leaves.' },
  { type: 'response', text: '  Sunlight provides the energy.' },
  { type: 'response', text: '  The plant produces glucose (sugar) + oxygen (O2).' },
  { type: 'response', text: '' },
  { type: 'response', text: 'THE EQUATION:' },
  { type: 'response', text: '  6CO2 + 6H2O + light -> C6H12O6 + 6O2' },
  { type: 'system', text: '' },
  { type: 'prompt', text: 'soma@box tutor$ ' },
]

const features = [
  { icon: WifiOff, title: 'Zero Internet', desc: 'Works completely offline. No WiFi, no data, no problem.' },
  { icon: Cpu, title: 'AI-Powered', desc: '26 slash commands powered by AI, all running locally on the box.' },
  { icon: BookOpen, title: '60+ Textbooks', desc: 'Full NERDC curriculum coverage: Mathematics, English, Sciences, and more.' },
  { icon: Users, title: 'Multi-Student', desc: 'One box serves an entire classroom. Students work independently.' },
  { icon: Zap, title: 'Instant Start', desc: 'Boots in seconds. Teachers trained in 15 minutes. Students productive in 10.' },
  { icon: Terminal, title: 'Curriculum Aligned', desc: 'Every question, explanation and quiz mapped to Nigerian NERDC standards.' },
]

const specs = [
  { label: 'Storage', value: '256GB SSD', desc: 'All textbooks, AI models and student data stored locally.' },
  { label: 'Power', value: '5V USB-C', desc: 'Runs on solar, power bank or wall outlet. Under 10W consumption.' },
  { label: 'Display', value: 'Any HDMI', desc: 'Connects to TV, monitor or projector, any screen with HDMI input.' },
  { label: 'Input', value: 'USB Keyboard', desc: 'Standard keyboard. Students type commands, not click buttons.' },
  { label: 'Setup', value: '15 minutes', desc: 'From unboxing to first student using it. No IT team required.' },
  { label: 'Support', value: '48-hour SLA', desc: 'Any issue gets a response within 48 hours from the founders directly.' },
]

export default function EduTech() {
  const [demoLines, setDemoLines] = useState(terminalLines)
  const [currentInput, setCurrentInput] = useState('')
  const termRef = useRef(null)

  const runCommand = (cmd) => {
    const newLines = [...terminalLines]
    if (cmd.includes('/quiz')) {
      newLines.push({ type: 'system', text: cmd })
      newLines.push({ type: 'system', text: '' })
      sampleQuiz.slice(2).forEach(l => newLines.push({ ...l }))
      setDemoLines(newLines)
    } else if (cmd.includes('/explain')) {
      newLines.push({ type: 'system', text: cmd })
      newLines.push({ type: 'system', text: '' })
      sampleExplain.slice(2).forEach(l => newLines.push({ ...l }))
      setDemoLines(newLines)
    } else {
      newLines.push({ type: 'system', text: cmd })
      newLines.push({ type: 'info', text: '' })
      newLines.push({ type: 'info', text: 'Available commands:' })
      commands.forEach(c => newLines.push({ type: 'response', text: '  ' + c }))
      newLines.push({ type: 'system', text: '' })
      newLines.push({ type: 'prompt', text: 'soma@box ~$ ' })
      setDemoLines(newLines)
    }
    setCurrentInput('')
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-cream pt-28 sm:pt-32 pb-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <p className="font-[var(--font-mono)] text-[0.78rem] uppercase tracking-[0.18em] text-[var(--color-ink-faint)] mb-6">
              <Link to="/" className="hover:text-[var(--color-burnt)] no-underline">Home</Link> / EduTech (SomaBox)
            </p>
            <h1 className="max-w-[20ch]">SomaBox: <span className="text-[var(--color-burnt)]">Offline AI tutor</span> for every Nigerian school.</h1>
            <p className="text-[1.1rem] max-w-[58ch] mt-5">
              A 256GB box that boots a complete AI tutor in 15 seconds. No internet. No servers. Just a keyboard,
              a screen, and 60+ NERDC textbooks ready to teach.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div className="flex flex-wrap gap-4 mt-8">
              <button onClick={() => runCommand('/help')} className="btn btn-primary"><Play size={18} /> Try the demo terminal</button>
              <Link to="/contact" className="btn btn-ghost">Request a pilot school</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TERMINAL DEMO */}
      <section className="bg-ink py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-amber)]">Interactive demo</span>
            <h2 className="mt-3 mb-3 text-[var(--color-paper)]">See how SomaBox works.</h2>
            <p className="text-[var(--color-paper)]/70 text-[1.05rem] max-w-[56ch] mb-10">Type a command or click a preset. This is exactly what students and teachers see.</p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="max-w-[760px]">
              <div className="bg-[#120F0B] border-2 border-[var(--color-paper)]/15 rounded-none overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-paper)]/15">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-danger)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-amber)]" />
                    <div className="w-3 h-3 rounded-full bg-[var(--color-success)]" />
                  </div>
                  <span className="text-[0.75rem] text-[var(--color-paper)]/60 font-mono ml-2">soma@box · AI Tutor Terminal</span>
                  <div className="ml-auto flex items-center gap-2">
                    <WifiOff size={12} className="text-[var(--color-success)]" />
                    <span className="text-[0.7rem] text-[var(--color-success)] font-mono">OFFLINE</span>
                  </div>
                </div>

                <div ref={termRef} className="p-5 font-mono text-sm h-[380px] overflow-y-auto" style={{ fontFamily: 'var(--font-mono)' }}>
                  {demoLines.map((line, i) => (
                    <div key={i} className={`leading-relaxed ${line.type === 'system' ? 'text-[var(--color-paper)]/55' :
                      line.type === 'prompt' ? 'text-[var(--color-amber)]' :
                      line.type === 'question' ? 'text-[var(--color-paper)] font-bold' :
                      line.type === 'response' ? 'text-[var(--color-paper)]/80' :
                      line.type === 'info' ? 'text-[var(--color-success)]' : 'text-[var(--color-paper)]/70'}`}>
                      {line.text === '' ? ' ' : line.text}
                    </div>
                  ))}
                  <div className="flex items-center text-[var(--color-amber)]">
                    <span>{'soma@box ~$ '}</span>
                    <input
                      type="text"
                      value={currentInput}
                      onChange={e => setCurrentInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && currentInput.trim()) runCommand(currentInput.trim()) }}
                      className="flex-1 bg-transparent border-0 outline-none text-[var(--color-paper)] font-mono text-sm ml-1 caret-[var(--color-amber)]"
                      placeholder='Type "/help" to see commands...'
                      style={{ fontFamily: 'var(--font-mono)' }}
                    />
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-[var(--color-paper)]/15">
                  <div className="flex flex-wrap gap-2">
                    {['/help', '/explain photosynthesis science ss2', '/quiz mathematics jss2'].map((cmd, i) => (
                      <button key={i} onClick={() => runCommand(cmd)}
                        className="px-3 py-1.5 rounded-none bg-[var(--color-paper)]/5 border border-[var(--color-paper)]/15 text-[var(--color-paper)]/70 text-[0.78rem] hover:bg-[var(--color-amber)]/15 hover:text-[var(--color-amber)] transition-all cursor-pointer font-mono">
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-cream-2 py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Why SomaBox</span>
            <h2 className="mt-3 mb-12 max-w-[16ch]">Built for schools the internet forgot.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="card p-6 h-full">
                  <f.icon size={28} className="text-[var(--color-burnt)] mb-3" strokeWidth={1.5} />
                  <h3 className="text-[1.15rem] mb-2">{f.title}</h3>
                  <p className="text-[0.95rem]">{f.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="bg-burnt py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.22em] text-[var(--color-paper)]/80">Technical specs</span>
            <h2 className="mt-3 mb-12 text-[var(--color-paper)]">What is inside the box.</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {specs.map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="bg-[var(--color-paper)] border-2 border-[var(--color-ink)] p-6">
                  <span className="font-[var(--font-mono)] text-[0.72rem] uppercase tracking-[0.16em] text-[var(--color-burnt)] block mb-2">{s.label}</span>
                  <span className="text-[var(--color-ink)] text-xl font-bold font-[var(--font-display)] block mb-2">{s.value}</span>
                  <p className="text-[0.92rem] text-[var(--color-ink-soft)]">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PILOT */}
      <section className="bg-cream py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <span className="eyebrow">Pilot programme</span>
            <h2 className="mt-3 mb-4 max-w-[16ch]">Start with one school. Prove the impact.</h2>
            <p className="text-[1.1rem] max-w-[58ch] mb-8">
              We deploy SomaBox in 5 pilot schools across Oyo State. After 6 months of usage data and test-score
              comparisons, we present results to the state government for a state-wide rollout. You can be part of this.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn btn-primary">Join the pilot <ArrowRight size={18} /></Link>
              <Link to="/ai-hub" className="btn btn-ghost">Explore AI Training Hub</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
