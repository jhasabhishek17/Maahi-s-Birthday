import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import TeddySVG from '../components/teddy/TeddySVG'

export default function LastBox() {
  const [state, setState] = useState('closed') // closed | opening | open
  const [confettiLoaded, setConfettiLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import confetti
    import('canvas-confetti').then(() => setConfettiLoaded(true)).catch(() => {})
  }, [])

  const fireConfetti = async () => {
    try {
      const confetti = (await import('canvas-confetti')).default
      confetti({
        particleCount: 150,
        spread: 90,
        colors: ['#e8b4b8', '#ecd4a0', '#c4956a', '#fdf8f0', '#d4e8c8', '#f0cdd0'],
        origin: { y: 0.55 },
        disableForReducedMotion: true,
      })
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 120,
          colors: ['#e8b4b8', '#c4956a', '#fdf8f0'],
          origin: { x: 0.2, y: 0.6 },
          disableForReducedMotion: true,
        })
        confetti({
          particleCount: 80,
          spread: 120,
          colors: ['#ecd4a0', '#d4e8c8', '#e8b4b8'],
          origin: { x: 0.8, y: 0.6 },
          disableForReducedMotion: true,
        })
      }, 400)
    } catch {}
  }

  const openBox = async () => {
    setState('opening')
    await fireConfetti()
    setTimeout(() => setState('open'), 700)
  }

  return (
    <section
      id="last-box"
      className="py-24 px-4 text-center border-b border-rose-900/30"
      style={{ background: '#1a0508' }}
    >
      <div className="max-w-xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2
            className="text-4xl md:text-5xl text-[#f4a0b0] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Okay... One Last Thing. 🎁
          </h2>
        </motion.div>

        {/* Gift box */}
        <div className="flex justify-center mb-8">
          <div className="relative" style={{ width: 180, height: 200 }}>

            {/* Lid */}
            <motion.div
              animate={{ y: state === 'opening' || state === 'open' ? -90 : 0, opacity: state === 'open' ? 0 : 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute top-0 left-0 right-0 z-10"
            >
              <svg width="180" height="55" viewBox="0 0 180 55">
                <rect x="0" y="10" width="180" height="45" rx="6" fill="#8a1a28" />
                <rect x="5" y="15" width="170" height="35" rx="4" fill="#c0384a" />
                {/* Ribbon horizontal */}
                <rect x="0" y="22" width="180" height="14" fill="#ffd700" />
                {/* Bow */}
                <ellipse cx="90" cy="8" rx="25" ry="10" fill="#ffd700" />
                <ellipse cx="62" cy="8" rx="15" ry="8" fill="#ffd700" />
                <ellipse cx="118" cy="8" rx="15" ry="8" fill="#ffd700" />
                <circle cx="90" cy="8" r="6" fill="#c0384a" />
              </svg>
            </motion.div>

            {/* Box body */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg width="180" height="150" viewBox="0 0 180 150">
                <rect x="0" y="0" width="180" height="150" rx="6" fill="#8a1a28" />
                <rect x="5" y="5" width="170" height="140" rx="4" fill="#c0384a" />
                {/* Ribbon vertical */}
                <rect x="82" y="0" width="16" height="150" fill="#ffd700" />
                {/* Shine */}
                <rect x="10" y="10" width="30" height="130" rx="4" fill="rgba(255,255,255,0.1)" />
                {/* Stars decoration */}
                {state === 'open' && [30, 80, 130, 150].map((x, i) => (
                  <text key={i} x={x} y={60 + i * 20} fontSize="14" fill="#ffd700" opacity="0.5">✦</text>
                ))}
              </svg>
            </div>

            {/* Surprise pop-out */}
            <AnimatePresence>
              {state === 'open' && (
                <motion.div
                  initial={{ scale: 0, y: 40 }}
                  animate={{ scale: 1, y: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                >
                  <TeddySVG size={80} animated={true} expression="surprised" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Open button */}
        {state === 'closed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button onClick={openBox} className="btn-rose" style={{ fontSize: '1.1rem' }}>
              Open it 🎁
            </button>
          </motion.div>
        )}

        {/* Final message */}
        <AnimatePresence>
          {state === 'open' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-10"
            >
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="text-4xl md:text-5xl font-bold text-[#c0384a] mb-6 leading-tight glow-title"
                style={{ fontFamily: "'Pacifico', cursive" }}
              >
                Happy Birthday, Maahi. 🌹🧸
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="rounded-2xl p-8 mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244,160,176,0.2)' }}
              >
                <p
                  className="text-lg text-[#fdf6ec] leading-8 mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  "I hope somewhere between the teddy, jokes,<br />
                  music and party — you found at least one reason to smile."
                </p>
                <p
                  className="text-base text-[#f4a0b0]"
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}
                >
                  That's all this little website ever wanted. 🧸🌹
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="text-3xl mb-8"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#ffd700' }}
              >
                Have a beautiful birthday, Akshuu. 🌹
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                onClick={fireConfetti}
                className="btn-gold"
              >
                More confetti? 🎉
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
