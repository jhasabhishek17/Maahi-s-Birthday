import { motion } from 'framer-motion'
import TeddySVG from '../components/teddy/TeddySVG'

const ratings = [
  { label: 'Intelligence',          stars: 5,  note: '' },
  { label: 'Kindness',              stars: 5,  note: '' },
  { label: 'Supportiveness',        stars: 5,  note: '' },
  { label: 'Singing Ability',       stars: 5,  note: '' },
  { label: 'Tolerance for Nonsense',stars: 3,  note: '(the teddy reduces this)' },
  { label: 'Teddy Approval',        stars: 'MAX', note: '100% — Maximum achievable' },
]

function Stars({ count }) {
  if (count === 'MAX') return (
    <span className="text-yellow-500 font-bold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
      ⭐⭐⭐⭐⭐ MAX
    </span>
  )
  return (
    <span>
      {'⭐'.repeat(count)}{'☆'.repeat(5 - count)}
    </span>
  )
}

export default function TeddyReport() {
  return (
    <section
      id="teddy-report"
      className="py-20 px-4 border-b border-rose-900/30"
      style={{ background: '#220810' }}
    >
      <div className="max-w-lg mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2
            className="text-4xl text-[#f4a0b0] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Teddy's Official Report 📋
          </h2>
        </motion.div>

        {/* Certificate */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="certificate-border rounded-2xl p-8 relative"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(244,160,176,0.3)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Vintage corner ornaments */}
          {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-[#ffd700] opacity-40 text-lg`}>✦</div>
          ))}

          {/* Stamp */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: -12 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.6 }}
            className="absolute -top-4 -right-4 z-10"
          >
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="#ffd700" strokeWidth="2.5" strokeDasharray="4,3" />
              <circle cx="40" cy="40" r="28" fill="#c0384a" opacity="0.3" />
              <text x="40" y="35" textAnchor="middle" fontSize="11" fill="#ffd700" fontFamily="sans-serif" fontWeight="bold">TEDDY</text>
              <text x="40" y="47" textAnchor="middle" fontSize="9" fill="#f4a0b0" fontFamily="sans-serif">APPROVED</text>
              <text x="40" y="57" textAnchor="middle" fontSize="14">🧸</text>
            </svg>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-6 border-b border-[#c0384a]/40 pb-5">
            <div className="flex justify-center mb-3">
              <TeddySVG size={80} animated={false} expression="proud" />
            </div>
            <h3
              className="text-2xl font-bold text-[#ffd700] tracking-widest uppercase mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.15em' }}
            >
              Official Teddy Report
            </h3>
            <p className="text-xs text-[#f4a0b0] uppercase tracking-widest"
              style={{ fontFamily: "'Poppins', sans-serif" }}>
              Issued by the International Teddy Committee
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-[#ffd700] opacity-50">
              <span>🧸</span><div className="w-16 h-px bg-[#c0384a]" /><span>🌹</span><div className="w-16 h-px bg-[#c0384a]" /><span>🧸</span>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6 rounded-xl p-4" style={{ background: '#1a0508', border: '1px solid rgba(244,160,176,0.2)' }}>
            {[
              ['Name', 'Akshra'],
              ['Known Aliases', 'Maahi / Akshuu'],
              ['Status', 'Very Important Person 👑'],
              ['Date', 'Your Birthday 🎂'],
              ['Birthday Status', 'VERY IMPORTANT'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-center py-1 border-b border-rose-900/20 last:border-none">
                <span className="text-xs font-medium text-[#9a6070]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {k}:
                </span>
                <span className="text-sm text-[#fdf6ec] font-medium"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Ratings */}
          <div className="mb-6 space-y-2">
            {ratings.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex justify-between items-center text-sm py-1 border-b border-rose-900/10"
              >
                <span className="text-xs text-[#f4a0b0]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {r.label}
                  {r.note && <span className="opacity-60 ml-1">{r.note}</span>}
                </span>
                <Stars count={r.stars} />
              </motion.div>
            ))}
          </div>

          {/* Signature */}
          <div className="border-t border-[#c0384a]/40 pt-5 text-center">
            <p className="text-xs text-[#9a6070] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Approved by:
            </p>
            <svg width="140" height="30" viewBox="0 0 140 30" className="mx-auto mb-1">
              <path
                d="M 5 20 C 15 5, 25 25, 35 15 C 45 5, 55 22, 65 12 C 75 2, 85 20, 95 14 C 105 8, 115 22, 135 18"
                stroke="#ffd700" strokeWidth="1.5" fill="none" strokeLinecap="round"
              />
            </svg>
            <p className="text-xs font-medium text-[#ffd700]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Chief Teddy Officer
            </p>
            <p className="text-[10px] text-[#9a6070]" style={{ fontFamily: "'Poppins', sans-serif" }}>
              International Teddy Committee
            </p>
          </div>

          {/* Bottom note */}
          <div className="mt-5 text-center">
            <p
              className="text-xs text-[#f4a0b0] italic"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.95rem' }}
            >
              "This certificate is awarded in recognition of being a genuinely good human.
              The teddy does not award this lightly."
            </p>
          </div>
        </motion.div>

        {/* Print button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => window.print()}
            className="btn-gold"
          >
            🖨️ Print / Save Certificate
          </button>
        </div>
      </div>
    </section>
  )
}
