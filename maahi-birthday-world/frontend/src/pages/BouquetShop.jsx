import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import { bouquets } from '../data/giftOptions'

// Toast component
function Toast({ message, show }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {message}
    </div>
  )
}

function BouquetCard({ bouquet, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="rounded-2xl p-6 text-center cursor-pointer transition-all"
      style={{
        background: selected ? '#faf0dc' : '#fffef9',
        border: `2px solid ${selected ? '#c4956a' : '#f5e4c0'}`,
        boxShadow: selected
          ? '0 8px 32px rgba(196,149,106,0.3)'
          : '0 4px 16px rgba(139,94,60,0.08)',
      }}
    >
      <div className="text-6xl mb-4">{bouquet.emoji}</div>
      <h3
        className="text-lg font-semibold text-[#4a2c0a] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {bouquet.name}
      </h3>
      <p
        className="text-sm text-[#8b5e3c] mb-4 leading-relaxed"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {bouquet.description}
      </p>
      <motion.div
        animate={{ scale: selected ? 1.05 : 1 }}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
          ${selected
            ? 'bg-[#8b5e3c] text-[#fffef9]'
            : 'bg-[#faf0dc] text-[#6b4226] border border-[#ecd4a0]'}
        `}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {selected ? '💛 Selected!' : 'I like this one 💛'}
      </motion.div>
    </motion.div>
  )
}

export default function BouquetShop() {
  const [selected, setSelected] = useState(null)
  const [toast, setToast] = useState({ show: false, msg: '' })

  const showToast = (msg) => {
    setToast({ show: true, msg })
    setTimeout(() => setToast({ show: false, msg: '' }), 3000)
  }

  const handleSelect = (id) => {
    if (selected === id) {
      setSelected(null)
      return
    }
    setSelected(id)
    showToast('Excellent choice. 🌷')
  }

  const selectedBouquet = bouquets.find(b => b.id === selected)

  return (
    <section
      id="bouquet-shop"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fdf8f0 100%)' }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Maahi's Bouquet Shop 🌷
          </h2>
          <p className="text-[#8b5e3c]" style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.2rem' }}>
            Because flowers are objectively difficult to dislike.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {bouquets.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <BouquetCard
                bouquet={b}
                selected={selected === b.id}
                onSelect={() => handleSelect(b.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Selection Confirmation (in-page, no external links) */}
        <AnimatePresence>
          {selectedBouquet && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="rounded-2xl p-6 text-center"
              style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}
            >
              <p
                className="text-xl font-semibold text-[#4a2c0a] mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Selected with Love 🌷
              </p>
              <p
                className="text-sm text-[#8b5e3c] mb-2"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                You chose: <strong>{selectedBouquet.name}</strong> {selectedBouquet.emoji}
              </p>
              <p
                className="text-xs text-[#c4956a]"
                style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.05rem' }}
              >
                This bouquet is reserved specially for Maahi in your birthday world! 🧸✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast message={toast.msg} show={toast.show} />
    </section>
  )
}
