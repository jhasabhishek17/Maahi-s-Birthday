import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const envelopes = [
  {
    id: 'bored',
    label: "Open when you're bored",
    emoji: '😴',
    color: '#3a0e16',
    border: 'rgba(244,160,176,0.3)',
    message: "Congratulations on being bored. This means you have survived the busy parts.\n\nReward yourself with snacks.\n\nThe teddy has been known to cure boredom by simply existing. 🧸\n\nAlso, you already found this button, so clearly you're not that bored.",
  },
  {
    id: 'hungry',
    label: "Open when you're hungry",
    emoji: '🍕',
    color: '#3a0e16',
    border: 'rgba(244,160,176,0.3)',
    message: "Important scientific fact: Birthday calories do not count.\n\nNeither do the calories from snacks you eat while reading this.\n\nThe teddy endorses this claim. 🧸\n\nPlease eat something nice. You deserve it.",
  },
  {
    id: 'tired',
    label: "Open when you're tired",
    emoji: '☁️',
    color: '#3a0e16',
    border: 'rgba(244,160,176,0.3)',
    message: "You are allowed to rest.\n\nThe world will not fall apart if you take a break.\n\nActually, you have earned rest. Multiple times over.\n\nTake it. 🌷\n\nThe teddy is already napping in solidarity.",
  },
  {
    id: 'laugh',
    label: "Open when you need a laugh",
    emoji: '😂',
    color: '#3a0e16',
    border: 'rgba(244,160,176,0.3)',
    message: "Why does the teddy never win at anything?\n\nBecause he keeps getting called a bear market. 📉\n\n...\n\nYes. That was terrible. You're welcome.\n\nThe teddy is also laughing. (He doesn't get the joke either.)",
  },
  {
    id: 'birthday',
    label: "Open on your birthday 🎂",
    emoji: '🌷',
    color: '#c0384a',
    border: '#ffd700',
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
        border: `1.5px solid ${env.border}`,
        boxShadow: env.special
          ? '0 8px 32px rgba(255,215,0,0.25)'
          : '0 4px 16px rgba(0,0,0,0.3)',
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
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.15rem',
            color: env.special ? '#ffd700' : '#fdf6ec',
          }}
        >
          {env.label}
        </p>
        {!open && (
          <p
            className="text-xs mt-2 opacity-70"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: env.special ? '#ffd700' : '#f4a0b0',
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
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <p
              className="text-sm text-[#fdf6ec] leading-7 whitespace-pre-line"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: '0.92rem',
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
      className="py-20 px-4 border-b border-rose-900/30"
      style={{ background: '#1a0508' }}
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
            className="text-4xl md:text-5xl text-[#f4a0b0] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Open When You Need a Smile 💌
          </h2>
          <p className="text-[#9a6070] text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
