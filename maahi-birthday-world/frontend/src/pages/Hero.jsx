import { motion } from 'framer-motion'
import TeddySVG from '../components/teddy/TeddySVG'
import Button from '../components/ui/Button'

const floatingPetalPositions = [
  { top: '15%', left: '8%',  size: 16, delay: 0 },
  { top: '30%', left: '92%', size: 12, delay: 0.5 },
  { top: '60%', left: '5%',  size: 10, delay: 1 },
  { top: '75%', left: '88%', size: 14, delay: 0.3 },
  { top: '45%', left: '95%', size: 8,  delay: 0.8 },
  { top: '20%', left: '3%',  size: 11, delay: 1.2 },
]

function FloatingPetal({ top, left, size, delay }) {
  return (
    <motion.div
      style={{ position: 'absolute', top, left }}
      animate={{ y: [-8, 8, -8], rotate: [0, 10, -10, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, delay }}
    >
      <svg width={size} height={size} viewBox="0 0 20 20">
        <path d="M10 2 C12 4, 14 8, 12 12 C10 16, 8 16, 6 12 C4 8, 6 4, 10 2Z"
          fill="#e8b4b8" opacity="0.6" />
      </svg>
    </motion.div>
  )
}

export default function Hero({ onEnter }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: 'linear-gradient(160deg, #fdf8f0 0%, #faf0dc 40%, #fffef9 80%, #fdf8f0 100%)' }}
    >
      {/* Decorative floating petals */}
      {floatingPetalPositions.map((p, i) => (
        <FloatingPetal key={i} {...p} />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">

        {/* Teddy */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
          className="mb-6"
        >
          <TeddySVG size={180} animated={true} expression="happy" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold text-[#4a2c0a] mb-3 leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Hey Maahi <span className="inline-block animate-bounce">🌷</span>
        </motion.h1>

        {/* Sub heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-2xl md:text-3xl text-[#8b5e3c] mb-6"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Welcome to your tiny little birthday world.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="text-2xl">🌷</span>
          <div className="w-24 h-px bg-[#ecd4a0]" />
          <span className="text-2xl">🧸</span>
          <div className="w-24 h-px bg-[#ecd4a0]" />
          <span className="text-2xl">🌷</span>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-[#6b4226] text-base md:text-lg leading-relaxed italic mb-10 max-w-lg border-l-4 border-[#e8b4b8] pl-5 text-left"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          "This isn't a big dramatic thing.<br />
          Just a tiny corner of the internet made with one simple purpose —<br />
          <strong>to make you smile today.</strong>"
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Button onClick={onEnter} size="lg" variant="primary">
            Enter the birthday world →
          </Button>
        </motion.div>

        {/* Small text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-4 text-sm text-[#c4956a]"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          No expectations. No pressure. Just flowers and a teddy. 🌷
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#c4956a] flex flex-col items-center gap-1"
      >
        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>scroll</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3 L8 13 M4 9 L8 13 L12 9" stroke="#c4956a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 text-4xl opacity-20">🌷</div>
      <div className="absolute top-8 right-8 text-4xl opacity-20">🌸</div>
      <div className="absolute bottom-16 left-8 text-3xl opacity-15">🌻</div>
      <div className="absolute bottom-16 right-8 text-3xl opacity-15">🌹</div>
    </section>
  )
}
