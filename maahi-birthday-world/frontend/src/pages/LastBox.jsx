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
      className="py-24 px-4 text-center"
      style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #faf0dc 50%, #fffef9 100%)' }}
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
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
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
                <rect x="0" y="10" width="180" height="45" rx="6" fill="#8b5e3c" />
                <rect x="5" y="15" width="170" height="35" rx="4" fill="#c4956a" />
                {/* Ribbon horizontal */}
                <rect x="0" y="22" width="180" height="14" fill="#e8b4b8" />
                {/* Bow */}
                <ellipse cx="90" cy="8" rx="25" ry="10" fill="#e8b4b8" />
                <ellipse cx="62" cy="8" rx="15" ry="8" fill="#e8b4b8" />
                <ellipse cx="118" cy="8" rx="15" ry="8" fill="#e8b4b8" />
                <circle cx="90" cy="8" r="6" fill="#d4788a" />
              </svg>
            </motion.div>

            {/* Box body */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg width="180" height="150" viewBox="0 0 180 150">
                <rect x="0" y="0" width="180" height="150" rx="6" fill="#8b5e3c" />
                <rect x="5" y="5" width="170" height="140" rx="4" fill="#c4956a" />
                {/* Ribbon vertical */}
                <rect x="82" y="0" width="16" height="150" fill="#e8b4b8" />
                {/* Shine */}
                <rect x="10" y="10" width="30" height="130" rx="4" fill="rgba(255,255,255,0.08)" />
                {/* Stars decoration */}
                {state === 'open' && [30, 80, 130, 150].map((x, i) => (
                  <text key={i} x={x} y={60 + i * 20} fontSize="14" opacity="0.3">✦</text>
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
            <Button onClick={openBox} size="lg" variant="primary">
              Open it 🎁
            </Button>
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
                className="text-4xl md:text-5xl font-bold text-[#4a2c0a] mb-6 leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Happy Birthday, Maahi. 🌷🧸
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="rounded-2xl p-8 mb-6"
                style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}
              >
                <p
                  className="text-lg text-[#6b4226] leading-8 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                >
                  "I hope somewhere between the teddy, terrible jokes,<br />
                  flowers and nonsense — you found at least one reason to smile."
                </p>
                <p
                  className="text-base text-[#8b5e3c]"
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
                >
                  That's all this little website ever wanted.
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
                className="text-3xl mb-8"
                style={{ fontFamily: "'Dancing Script', cursive", color: '#c4956a' }}
              >
                Have a beautiful birthday. 🌷
              </motion.p>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
                onClick={fireConfetti}
                className="px-5 py-2.5 rounded-full text-sm border border-[#ecd4a0] bg-[#faf0dc] text-[#4a2c0a] hover:bg-[#f5e4c0] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
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
