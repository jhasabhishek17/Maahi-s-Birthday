import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { wishes, categories } from '../data/wishes'
import Button from '../components/ui/Button'

export default function WishGenerator() {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [wish, setWish] = useState(null)

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setWish(null)
    const spins = 5 + Math.random() * 5
    const angle = spins * 360 + Math.random() * 360
    setRotation(r => r + angle)

    setTimeout(() => {
      const selected = wishes[Math.floor(Math.random() * wishes.length)]
      setWish(selected)
      setSpinning(false)
    }, 2200)
  }

  return (
    <section
      id="wish-generator"
      className="py-20 px-4"
      style={{ background: '#fffef9' }}
    >
      <div className="max-w-xl mx-auto text-center">

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
            Your Birthday Wish ✨
          </h2>
          <p className="text-[#8b5e3c] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Spin the wheel to reveal your birthday wish for this year.
          </p>
        </motion.div>

        {/* Wheel */}
        <div className="relative flex justify-center mb-8">
          {/* Pointer */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 z-10"
            style={{ fontSize: 24 }}
          >
            ▼
          </div>

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 2, ease: [0.33, 1, 0.68, 1] }}
            className="relative"
            style={{ width: 240, height: 240 }}
          >
            <svg viewBox="0 0 240 240" width={240} height={240}>
              {categories.map((cat, i) => {
                const angle = (360 / categories.length) * i
                const rad = ((angle - 90) * Math.PI) / 180
                const x = 120 + 80 * Math.cos(rad)
                const y = 120 + 80 * Math.sin(rad)
                const segAngle = (360 / categories.length)
                const startAngle = ((angle - segAngle / 2 - 90) * Math.PI) / 180
                const endAngle = ((angle + segAngle / 2 - 90) * Math.PI) / 180
                const x1 = 120 + 115 * Math.cos(startAngle)
                const y1 = 120 + 115 * Math.sin(startAngle)
                const x2 = 120 + 115 * Math.cos(endAngle)
                const y2 = 120 + 115 * Math.sin(endAngle)
                const colors = [
                  '#f5e4c0', '#faf0dc', '#f0cdd0', '#d4e8c8',
                  '#ecd4a0', '#fdf8f0', '#e8b4b8', '#f5e4c0',
                ]
                return (
                  <g key={i}>
                    <path
                      d={`M 120 120 L ${x1} ${y1} A 115 115 0 0 1 ${x2} ${y2} Z`}
                      fill={colors[i % colors.length]}
                      stroke="#c4956a"
                      strokeWidth="1"
                    />
                    <text
                      x={x} y={y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="18"
                    >
                      {cat.emoji}
                    </text>
                  </g>
                )
              })}
              {/* Center circle */}
              <circle cx="120" cy="120" r="22" fill="#8b5e3c" />
              <circle cx="120" cy="120" r="18" fill="#c4956a" />
              <text x="120" y="125" textAnchor="middle" fontSize="16" fill="#fffef9">✨</text>
            </svg>
          </motion.div>
        </div>

        {/* Spin button */}
        <div className="mb-8">
          <Button onClick={spin} variant="primary" size="lg" disabled={spinning}>
            {spinning ? 'Spinning... ✨' : 'Spin my wish ✨'}
          </Button>
        </div>

        {/* Wish result */}
        <AnimatePresence>
          {wish && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="rounded-2xl p-8"
              style={{
                background: 'linear-gradient(135deg, #faf0dc 0%, #fdf8f0 100%)',
                border: '2px solid #ecd4a0',
                boxShadow: '0 8px 32px rgba(139,94,60,0.12)',
              }}
            >
              <div className="text-3xl mb-3">{wish.emoji}</div>
              <p
                className="text-xs uppercase tracking-widest text-[#c4956a] mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {wish.category}
              </p>
              <p
                className="text-lg text-[#4a2c0a] italic leading-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {wish.wish}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
