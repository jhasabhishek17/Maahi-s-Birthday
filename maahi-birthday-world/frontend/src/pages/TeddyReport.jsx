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
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fdf8f0 100%)' }}
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
            className="text-4xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
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
          style={{ background: '#fffef9' }}
        >
          {/* Vintage corner ornaments */}
          {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-[#c4956a] opacity-40 text-lg`}>✦</div>
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
              <circle cx="40" cy="40" r="36" fill="none" stroke="#8b5e3c" strokeWidth="2.5" strokeDasharray="4,3" />
              <circle cx="40" cy="40" r="28" fill="#8b5e3c" opacity="0.15" />
              <text x="40" y="35" textAnchor="middle" fontSize="11" fill="#6b4226" fontFamily="serif" fontWeight="bold">TEDDY</text>
              <text x="40" y="47" textAnchor="middle" fontSize="9" fill="#6b4226" fontFamily="serif">APPROVED</text>
              <text x="40" y="57" textAnchor="middle" fontSize="14">🧸</text>
            </svg>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-6 border-b border-[#ecd4a0] pb-5">
            <div className="flex justify-center mb-3">
              <TeddySVG size={80} animated={false} expression="proud" />
            </div>
            <h3
              className="text-2xl font-bold text-[#4a2c0a] tracking-widest uppercase mb-1"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '0.15em' }}
            >
              Official Teddy Report
            </h3>
            <p className="text-xs text-[#8b5e3c] uppercase tracking-widest"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Issued by the International Teddy Committee
            </p>
            <div className="flex items-center justify-center gap-2 mt-2 text-[#c4956a] opacity-50">
              <span>🧸</span><div className="w-16 h-px bg-[#ecd4a0]" /><span>🌷</span><div className="w-16 h-px bg-[#ecd4a0]" /><span>🧸</span>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6 rounded-xl p-4" style={{ background: '#faf0dc', border: '1px solid #ecd4a0' }}>
            {[
              ['Name', 'Akshra'],
              ['Known Aliases', 'Maahi / Akshuu'],
              ['Status', 'Very Important Person 👑'],
              ['Date', 'Your Birthday 🎂'],
              ['Birthday Status', 'VERY IMPORTANT'],
            ].map(([k, v]) => (
              <div key={k} className="star-row">
                <span className="text-xs font-medium text-[#8b5e3c] w-36 shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  {k}:
                </span>
                <span className="text-sm text-[#4a2c0a] font-medium"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {v}
                </span>
              </div>
            ))}
          </div>

          {/* Ratings */}
          <div className="mb-6">
            {ratings.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="star-row"
              >
                <span className="text-xs text-[#8b5e3c] w-44 shrink-0"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  {r.label}
                  {r.note && <span className="opacity-60 ml-1">{r.note}</span>}
                </span>
                <Stars count={r.stars} />
              </motion.div>
            ))}
          </div>

          {/* Signature */}
          <div className="border-t border-[#ecd4a0] pt-5 text-center">
            <p className="text-xs text-[#8b5e3c] mb-2" style={{ fontFamily: "'Inter', sans-serif" }}>
              Approved by:
            </p>
            {/* Squiggly signature */}
            <svg width="140" height="30" viewBox="0 0 140 30" className="mx-auto mb-1">
              <path
                d="M 5 20 C 15 5, 25 25, 35 15 C 45 5, 55 22, 65 12 C 75 2, 85 20, 95 14 C 105 8, 115 22, 135 18"
                stroke="#6b4226" strokeWidth="1.5" fill="none" strokeLinecap="round"
              />
            </svg>
            <p className="text-xs font-medium text-[#6b4226]" style={{ fontFamily: "'Playfair Display', serif" }}>
              Chief Teddy Officer
            </p>
            <p className="text-[10px] text-[#c4956a]" style={{ fontFamily: "'Inter', sans-serif" }}>
              International Teddy Committee
            </p>
          </div>

          {/* Bottom note */}
          <div className="mt-5 text-center">
            <p
              className="text-xs text-[#8b5e3c] italic"
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: '0.9rem' }}
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
            className="px-6 py-3 rounded-full text-sm border border-[#ecd4a0] bg-[#faf0dc] text-[#4a2c0a] hover:bg-[#f5e4c0] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            🖨️ Print / Save Certificate
          </button>
        </div>
      </div>
    </section>
  )
}
