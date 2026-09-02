import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHiddenFlowers } from '../hooks/useHiddenFlowers'

const REMINDERS = [
  "You deserve nice things too. 🌷",
  "Today is a good day to be kind to yourself. 🌸",
  "You found one! Just like you find the good in people. ✨",
  "A tiny flower, just for you. 🌼",
  "You're doing great, even when it doesn't feel like it. 🌻",
  "The teddy says you deserve all the flowers. 🧸",
  "Last one! You found them all. You're amazing. 🌷🎉",
]

export function HiddenFlowerTrigger({ flowerId, children, className = '' }) {
  const { findFlower, foundFlowers } = useHiddenFlowers()
  const [showToast, setShowToast] = useState(false)
  const alreadyFound = foundFlowers.has(flowerId)

  const handle = () => {
    if (alreadyFound) return
    findFlower(flowerId)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3500)
  }

  return (
    <span className="relative inline-block">
      <button
        onClick={handle}
        className={`hidden-flower-trigger ${alreadyFound ? 'found' : ''} ${className}`}
        aria-label={alreadyFound ? 'Flower already found' : 'Hidden flower! Click to find it'}
        title={alreadyFound ? '🌷 Found!' : '🤫 A hidden flower...'}
      >
        {children || '🌷'}
      </button>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.8 }}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-50 rounded-2xl px-4 py-2 text-xs shadow-lg pointer-events-none"
            style={{
              background: '#4a2c0a',
              color: '#fffef9',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            🌷 Flower found! {REMINDERS[Math.floor(Math.random() * REMINDERS.length)]}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}

export default function HiddenFlowers({ onAllFound }) {
  const { foundFlowers, totalFlowers, allFound, findFlower } = useHiddenFlowers()
  const count = foundFlowers.size

  return (
    <section
      id="hidden-flowers"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #fffef9 0%, #faf0dc 100%)' }}
    >
      <div className="max-w-2xl mx-auto text-center">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Hidden Flowers 🌷
          </h2>
          <p className="text-[#8b5e3c]" style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.2rem' }}>
            There are {totalFlowers} tiny flowers hidden across this page.
            <br />Can you find them all?
          </p>
        </motion.div>

        {/* Progress counter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: totalFlowers }).map((_, i) => (
              <motion.span
                key={i}
                animate={{ scale: i < count ? 1.2 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="text-2xl"
                style={{ filter: i < count ? 'none' : 'grayscale(1) opacity(0.3)' }}
              >
                🌷
              </motion.span>
            ))}
          </div>
          <p
            className="text-[#8b5e3c] font-medium"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {count} / {totalFlowers} found
          </p>
        </motion.div>

        {/* Hidden flowers in this section (2 flowers here) */}
        <div className="relative rounded-2xl p-8 mb-8"
          style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}>
          <p className="text-[#6b4226] mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
            They're hiding in unexpected places across the page...
            keep exploring{' '}
            <HiddenFlowerTrigger flowerId="flower-1">🌷</HiddenFlowerTrigger>
            {' '}👀
          </p>

          <p className="text-sm text-[#c4956a] italic mb-4" style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem' }}>
            "Some things are worth looking for."
            {' '}<HiddenFlowerTrigger flowerId="flower-2">✨</HiddenFlowerTrigger>
          </p>

          <p className="text-xs text-[#c4956a]" style={{ fontFamily: "'Inter', sans-serif" }}>
            💡 Hint: Look for faint 🌷 or ✨ symbols elsewhere on the page — they might be hiding in plain sight!
          </p>
        </div>

        {/* All found celebration */}
        <AnimatePresence>
          {allFound && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="rounded-2xl p-8"
              style={{
                background: 'linear-gradient(135deg, #faf0dc, #f5e4c0)',
                border: '2px solid #c4956a',
              }}
            >
              <div className="text-4xl mb-4">🎉🌷🎉</div>
              <h3
                className="text-2xl text-[#4a2c0a] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                You found them all!
              </h3>
              <p
                className="text-[#6b4226] mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                The Secret Teddy Note is now unlocked. 🧸
              </p>
              <a
                href="#secret-note"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8b5e3c] text-[#fffef9] font-medium text-sm hover:bg-[#6b4226] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Read the Secret Teddy Note 🧸
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
