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
      className="py-20 px-4 border-b border-rose-900/30"
      style={{ background: '#220810' }}
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
            className="text-4xl md:text-5xl text-[#f4a0b0] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            A Little Something You Should Hear 💫
          </h2>
        </motion.div>

        {/* Compliment card */}
        <div
          className="rounded-3xl p-10 mb-8 relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(244,160,176,0.2)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
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
              className="text-xl leading-8 text-[#fdf6ec] italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              "{compliments[index]}"
            </motion.p>
          </AnimatePresence>
        </div>

        <button onClick={next} className="btn-gold">
          Another one 🌷
        </button>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-[#9a6070]"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          These are all true, by the way. 🌹
        </motion.p>
      </div>
    </section>
  )
}
