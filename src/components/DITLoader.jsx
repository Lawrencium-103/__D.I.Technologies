import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STATUS_MESSAGES = [
  'INITIALIZING DIT PLATFORM CORE...',
  'LOADING SOMABOX CURRICULUM DATA...',
  'LOADING SECTOR RESEARCH & REPORTS...',
  'ESTABLISHING SYSTEM LINK...',
]

export default function DITLoader({ isFullPage = true, onComplete }) {
  const [msgIdx, setMsgIdx] = useState(0)
  const [progress, setProgress] = useState(12)

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % STATUS_MESSAGES.length)
    }, 400)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.floor(Math.random() * 18) + 12
      })
    }, 120)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className={`flex flex-col items-center justify-center bg-[#14120E] text-[#FBF7EF] select-none ${
      isFullPage ? 'fixed inset-0 z-[99999]' : 'min-h-[70vh] w-full relative'
    }`}>
      {/* Background Tech Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#CC8800 1px, transparent 1px), linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px, 64px 64px, 64px 64px'
        }}
      />

      {/* Ambient Burnt Orange Glow */}
      <div className="absolute w-[360px] h-[360px] bg-[#C55221] opacity-25 blur-[120px] rounded-full pointer-events-none animate-pulse" />

      {/* Technical Corner Brackets */}
      {isFullPage && (
        <>
          <div className="absolute top-6 left-6 font-[var(--font-mono)] text-[0.68rem] tracking-[0.2em] text-[#FBF7EF]/50 uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-[#C55221] rounded-full animate-ping" />
            SYS // DIT.OS 4.0
          </div>
          <div className="absolute top-6 right-6 font-[var(--font-mono)] text-[0.68rem] tracking-[0.2em] text-[#CC8800] uppercase">
            [ STATUS // ONLINE ]
          </div>
          <div className="absolute bottom-6 left-6 font-[var(--font-mono)] text-[0.68rem] tracking-[0.18em] text-[#FBF7EF]/40 uppercase">
            DARA INITIATIVE TECH
          </div>
          <div className="absolute bottom-6 right-6 font-[var(--font-mono)] text-[0.68rem] tracking-[0.18em] text-[#FBF7EF]/40 uppercase">
            LATENCY: 4ms
          </div>
        </>
      )}

      {/* ANIMATED DIT MONOGRAM EMBLEM */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer Rotating Square Brackets */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="w-28 h-28 border border-[#CC8800]/30 absolute rounded-sm"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="w-36 h-36 border border-[#C55221]/25 absolute rounded-sm border-dashed"
        />

        {/* Core D Emblem Box */}
        <div className="w-20 h-20 bg-[#C55221] border-2 border-[#FBF7EF] flex items-center justify-center shadow-[6px_6px_0px_#CC8800] relative overflow-hidden group">
          {/* Laser Scan Sweep */}
          <motion.div
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-x-0 h-2 bg-gradient-to-r from-transparent via-[#FBF7EF] to-transparent opacity-80"
          />

          <span className="font-[var(--font-display)] font-bold text-4xl text-[#FBF7EF] leading-none tracking-tighter">
            D
          </span>
        </div>
      </div>

      {/* BRAND NAME */}
      <div className="text-center mb-6">
        <h2 className="font-[var(--font-display)] font-bold text-2xl tracking-wider text-[#FBF7EF] uppercase flex items-center justify-center gap-2">
          DARA INITIATIVE <span className="text-[#CC8800]">TECH</span>
        </h2>
        <p className="font-[var(--font-mono)] text-[0.72rem] tracking-[0.25em] text-[#FBF7EF]/60 uppercase mt-1">
          Open Model Research · Offline AI · S-SME
        </p>
      </div>

      {/* PROGRESS BAR BAND */}
      <div className="w-64 sm:w-80 space-y-2">
        <div className="h-1.5 w-full bg-[#1A1712] border border-[#FBF7EF]/20 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C55221] via-[#CC8800] to-[#FBF7EF]"
            style={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 0.15 }}
          />
        </div>

        {/* DYNAMIC STATUS TEXT & PERCENTAGE */}
        <div className="flex items-center justify-between font-[var(--font-mono)] text-[0.7rem] text-[#FBF7EF]/75">
          <AnimatePresence mode="wait">
            <motion.span
              key={msgIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="truncate max-w-[80%]"
            >
              {STATUS_MESSAGES[msgIdx]}
            </motion.span>
          </AnimatePresence>
          <span className="font-bold text-[#CC8800] tabular-nums">{Math.min(100, progress)}%</span>
        </div>
      </div>
    </div>
  )
}
