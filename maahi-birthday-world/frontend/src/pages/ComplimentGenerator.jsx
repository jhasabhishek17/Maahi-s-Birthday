import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { compliments } from '../data/compliments'
import Button from '../components/ui/Button'

export default function ComplimentGenerator() {
  const [index, setIndex] = useState(0)
  const [key, setKey] = useState(0)

  const next = useCallback(() => {
    setIndex(i => {
      let next = Math.floor(Math.random() * compliments.length)
      while (next === i) next = Math.floor(Math.random() * compliments.length)
      return next
    })
    setKey(k => k + 1)
  }, [])

  return (
    <section
      id="compliments"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fffef9 100%)' }}
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
            A Little Something You Should Hear 💫
          </h2>
        </motion.div>

        {/* Compliment card */}
        <div
          className="rounded-3xl p-10 mb-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fffef9 0%, #faf0dc 100%)',
            border: '2px solid #ecd4a0',
            boxShadow: '0 8px 40px rgba(139,94,60,0.12)',
            minHeight: 160,
          }}
        >
          <div className="absolute top-3 left-4 text-xl opacity-20">✨</div>
          <div className="absolute bottom-3 right-4 text-xl opacity-20">🌷</div>

          <AnimatePresence mode="wait">
            <motion.p
              key={key}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-xl leading-8 text-[#4a2c0a] italic"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              "{compliments[index]}"
            </motion.p>
          </AnimatePresence>
        </div>

        <Button onClick={next} variant="secondary" size="md">
          Another one 🌷
        </Button>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xs text-[#c4956a]"
          style={{ fontFamily: "'Dancing Script', cursive", fontSize: '0.95rem' }}
        >
          These are all true, by the way.
        </motion.p>
      </div>
    </section>
  )
}
