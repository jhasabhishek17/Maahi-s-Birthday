import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const envelopes = [
  {
    id: 'bored',
    label: "Open when you're bored",
    emoji: '😴',
    color: '#f0cdd0',
    border: '#e8b4b8',
    message: "Congratulations on being bored. This means you have survived the busy parts.\n\nReward yourself with snacks.\n\nThe teddy has been known to cure boredom by simply existing. 🧸\n\nAlso, you already found this button, so clearly you're not that bored.",
  },
  {
    id: 'hungry',
    label: "Open when you're hungry",
    emoji: '🍕',
    color: '#faf0dc',
    border: '#ecd4a0',
    message: "Important scientific fact: Birthday calories do not count.\n\nNeither do the calories from snacks you eat while reading this.\n\nThe teddy endorses this claim. 🧸\n\nPlease eat something nice. You deserve it.",
  },
  {
    id: 'tired',
    label: "Open when you're tired",
    emoji: '☁️',
    color: '#d4e8c8',
    border: '#b8d4a8',
    message: "You are allowed to rest.\n\nThe world will not fall apart if you take a break.\n\nActually, you have earned rest. Multiple times over.\n\nTake it. 🌷\n\nThe teddy is already napping in solidarity.",
  },
  {
    id: 'laugh',
    label: "Open when you need a laugh",
    emoji: '😂',
    color: '#fdf8f0',
    border: '#f5e4c0',
    message: "Why does the teddy never win at anything?\n\nBecause he keeps getting called a bear market. 📉\n\n...\n\nYes. That was terrible. You're welcome.\n\nThe teddy is also laughing. (He doesn't get the joke either.)",
  },
  {
    id: 'birthday',
    label: "Open on your birthday 🎂",
    emoji: '🌷',
    color: '#c4956a',
    border: '#8b5e3c',
    special: true,
    message: "Happy Birthday, Maahi. 🌷🧸\n\nThis envelope has been waiting for exactly today.\n\nToday is yours.\n\nBe excellent.\nEat cake.\nLaugh a lot.\n\nYou deserve every good thing.\n\nEvery. Single. One.",
  },
]

function EnvelopeCard({ env }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={!open ? { scale: 1.02, y: -4 } : {}}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        border: `2px solid ${env.border}`,
        boxShadow: env.special
          ? '0 8px 32px rgba(196,149,106,0.3)'
          : '0 4px 16px rgba(139,94,60,0.08)',
      }}
      onClick={() => !open && setOpen(true)}
    >
      {/* Envelope front */}
      <div
        className="p-5 text-center"
        style={{ background: env.color }}
      >
        <div className="text-3xl mb-2">{env.emoji}</div>
        <p
          className="text-sm font-medium"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: env.special ? '#fffef9' : '#4a2c0a',
          }}
        >
          {env.label}
        </p>
        {!open && (
          <p
            className="text-xs mt-2 opacity-70"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: env.special ? '#faf0dc' : '#6b4226',
            }}
          >
            Click to open 📬
          </p>
        )}
      </div>

      {/* Message (open state) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="p-5"
            style={{ background: '#fffef9' }}
          >
            <p
              className="text-sm text-[#4a2c0a] leading-7 whitespace-pre-line"
              style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.05rem',
              }}
            >
              {env.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function OpenWhen() {
  return (
    <section
      id="open-when"
      className="py-20 px-4"
      style={{ background: '#fffef9' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Open When You Need a Smile 💌
          </h2>
          <p className="text-[#8b5e3c] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Click any envelope to open it.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {envelopes.map((env, i) => (
            <motion.div
              key={env.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <EnvelopeCard env={env} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
