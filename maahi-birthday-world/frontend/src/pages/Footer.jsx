import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer
      className="py-16 px-4 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #4a2c0a 0%, #321c04 100%)' }}
    >
      {/* Decorative top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #c4956a, #e8b4b8, #c4956a, transparent)' }}
      />

      {/* Corner flowers */}
      <div className="absolute top-6 left-6 text-2xl opacity-20">🌷</div>
      <div className="absolute top-6 right-6 text-2xl opacity-20">🌸</div>
      <div className="absolute bottom-6 left-6 text-xl opacity-15">🌻</div>
      <div className="absolute bottom-6 right-6 text-xl opacity-15">🌹</div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10"
      >
        {/* Teddy icon */}
        <div className="text-4xl mb-4">🧸</div>

        {/* Main text */}
        <p
          className="text-xl leading-8 mb-4"
          style={{ fontFamily: "'Dancing Script', cursive", color: '#faf0dc' }}
        >
          Made with friendship, flowers,<br />
          questionable jokes &amp; one extremely<br />
          serious teddy.
        </p>

        {/* Flower divider */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-16 h-px" style={{ background: '#6b4226' }} />
          <span className="text-lg opacity-60">🌷 🧸 🌷</span>
          <div className="w-16 h-px" style={{ background: '#6b4226' }} />
        </div>

        {/* Birthday line */}
        <p
          className="text-2xl mb-6"
          style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#e8b4b8' }}
        >
          Happy Birthday, Maahi. ✨
        </p>

        {/* Hindi warm wishes */}
        <p
          className="text-base mb-6 opacity-80"
          style={{ fontFamily: "'Dancing Script', cursive", color: '#c4956a', fontSize: '1.05rem' }}
        >
          जन्मदिन मुबारक हो, माही। 🌷<br />
          <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            आज का दिन बस तुम्हारा है।
          </span>
        </p>

        {/* Privacy note */}
        <p
          className="text-xs opacity-40"
          style={{ fontFamily: "'Inter', sans-serif", color: '#faf0dc' }}
        >
          🔒 No data collected. No tracking. Just birthday magic. &nbsp;·&nbsp; Made with 🌷
        </p>
      </motion.div>
    </footer>
  )
}
