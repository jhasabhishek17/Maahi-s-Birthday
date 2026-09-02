import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const traits = [
  {
    emoji: '🧠', title: 'Intelligent',
    desc: "Can probably solve problems I haven't even understood yet.",
  },
  {
    emoji: '🤝', title: 'Supportive',
    desc: "Somehow manages to support everyone while dealing with her own chaos.",
  },
  {
    emoji: '🎶', title: 'Amazing Singer',
    desc: "The unofficial birthday concert starts whenever Maahi feels like singing.",
  },
  {
    emoji: '🌷', title: 'Kind',
    desc: "One of those rare people who makes the world slightly less chaotic.",
  },
  {
    emoji: '😂', title: 'Funny',
    desc: "Could make a grumpy teddy laugh. Not easy. Trust me.",
  },
  {
    emoji: '💫', title: 'Strong',
    desc: "Has survived things that would break a lot of people. Still here. Still kind.",
  },
  {
    emoji: '✨', title: 'Thoughtful',
    desc: "Remembers things people forgot they even mentioned.",
  },
  {
    emoji: '🧸', title: 'Teddy-Approved',
    desc: "Highest honour available. The teddy does not approve just anyone.",
  },
  {
    emoji: '🌻', title: 'Always There',
    desc: "Shows up for people. Always. Even when it's inconvenient.",
  },
  {
    emoji: '👑', title: 'Certified Good Human',
    desc: "Official certification. The paperwork is filed somewhere. The teddy signed it.",
  },
]

function TraitCard({ trait, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      whileHover={{ scale: 1.04, y: -6 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      className="relative rounded-2xl p-5 text-center cursor-default overflow-hidden"
      style={{
        background: '#fffef9',
        border: '1px solid #f5e4c0',
        boxShadow: hovered
          ? '0 8px 32px rgba(139,94,60,0.18)'
          : '0 2px 12px rgba(139,94,60,0.08)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      {/* Emoji */}
      <div className="text-4xl mb-3">{trait.emoji}</div>

      {/* Title */}
      <h3 className="text-base font-semibold text-[#4a2c0a] mb-2"
        style={{ fontFamily: "'Playfair Display', serif" }}>
        {trait.title}
      </h3>

      {/* Description (hover reveal) */}
      <AnimatePresence>
        {hovered && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-[#8b5e3c] leading-relaxed overflow-hidden"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {trait.desc}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Hover hint */}
      {!hovered && (
        <p className="text-[10px] text-[#c4956a]" style={{ fontFamily: "'Inter', sans-serif" }}>
          hover to read ✨
        </p>
      )}

      {/* Corner decoration */}
      <div
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full opacity-10"
        style={{ background: '#e8b4b8' }}
      />
    </motion.div>
  )
}

export default function ThingsThatMakeMaahi() {
  return (
    <section
      id="things-maahi"
      className="py-20 px-4"
      style={{ background: '#fffef9' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Things That Make Maahi, Maahi ✨
          </h2>
          <p className="text-[#8b5e3c]" style={{ fontFamily: "'Inter', sans-serif" }}>
            (Hover each card to read what the teddy thinks)
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {traits.map((trait, i) => (
            <TraitCard key={trait.title} trait={trait} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
