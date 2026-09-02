import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { giftItems } from '../data/giftOptions'

export default function GiftMenu() {
  const [selected, setSelected] = useState(null)

  const handleSelect = (id) => {
    setSelected(prev => (prev === id ? null : id))
  }

  return (
    <section
      id="gift-menu"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #faf0dc 100%)' }}
    >
      <div className="max-w-4xl mx-auto">

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
            Choose Your Birthday Gift 🎁
          </h2>
          <p className="text-[#8b5e3c]" style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem' }}>
            Completely imaginary. Completely thoughtful.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {giftItems.map((item, i) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSelect(item.id)}
              className="rounded-2xl p-5 text-center cursor-pointer transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4956a]"
              style={{
                background: selected === item.id ? '#faf0dc' : '#fffef9',
                border: `2px solid ${selected === item.id ? '#c4956a' : '#f5e4c0'}`,
                boxShadow: selected === item.id
                  ? '0 8px 32px rgba(196,149,106,0.25)'
                  : '0 4px 16px rgba(139,94,60,0.07)',
              }}
              aria-pressed={selected === item.id}
            >
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3
                className="text-sm font-semibold text-[#4a2c0a] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.name}
              </h3>
              <p
                className="text-xs text-[#8b5e3c] leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {item.description}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Confirmation */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center rounded-2xl p-6"
              style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}
            >
              <p className="text-2xl mb-1">{giftItems.find(g => g.id === selected)?.emoji}</p>
              <p
                className="text-lg font-semibold text-[#4a2c0a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Noted. 🎁
              </p>
              <p
                className="text-sm text-[#8b5e3c] mt-1"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                The imaginary {giftItems.find(g => g.id === selected)?.name.toLowerCase()} is on its way.
                <br />
                (The teddy is personally overseeing the delivery.)
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
