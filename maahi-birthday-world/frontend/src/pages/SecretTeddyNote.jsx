import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useHiddenFlowers } from '../hooks/useHiddenFlowers'
import TeddySVG from '../components/teddy/TeddySVG'

export default function SecretTeddyNote() {
  const { allFound } = useHiddenFlowers()
  const [stage, setStage] = useState(0) // 0=closed, 1=flap-open, 2=letter-out, 3=message

  useEffect(() => {
    if (!allFound) return
    const t1 = setTimeout(() => setStage(1), 600)
    const t2 = setTimeout(() => setStage(2), 1400)
    const t3 = setTimeout(() => setStage(3), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [allFound])

  return (
    <section
      id="secret-note"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fdf8f0 100%)' }}
    >
      <div className="max-w-lg mx-auto text-center">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2
            className="text-4xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Secret Teddy Note 🧸
          </h2>
        </motion.div>

        {/* Locked state */}
        {!allFound && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl p-10"
            style={{
              background: '#fffef9',
              border: '2px dashed #ecd4a0',
              filter: 'grayscale(0.3)',
            }}
          >
            <div className="text-5xl mb-4 opacity-40">🔒</div>
            <p
              className="text-[#8b5e3c] italic"
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.2rem' }}
            >
              Find all 7 hidden flowers to unlock the Secret Teddy Note...
            </p>
          </motion.div>
        )}

        {/* Unlocked — envelope animation */}
        {allFound && (
          <div className="flex flex-col items-center gap-8">

            {/* Envelope */}
            <div className="relative" style={{ width: 200, height: 140 }}>
              {/* Envelope body */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute inset-0 rounded-xl overflow-hidden"
                style={{ background: '#f5e4c0', border: '2px solid #c4956a' }}
              >
                {/* Bottom triangle */}
                <svg viewBox="0 0 200 140" style={{ position: 'absolute', bottom: 0 }}>
                  <polygon points="0,140 100,70 200,140" fill="#ecd4a0" />
                </svg>
                {/* Side triangles */}
                <svg viewBox="0 0 200 140" style={{ position: 'absolute', inset: 0 }}>
                  <polygon points="0,0 0,140 85,70" fill="#f0d8b0" />
                  <polygon points="200,0 200,140 115,70" fill="#f0d8b0" />
                </svg>
              </motion.div>

              {/* Flap */}
              <motion.div
                animate={{ rotateX: stage >= 1 ? 180 : 0 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 70,
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  overflow: 'hidden',
                }}
              >
                <svg viewBox="0 0 200 70">
                  <polygon points="0,0 100,60 200,0" fill="#c4956a" />
                  <polygon points="0,0 100,60 200,0" fill="#d4a574" opacity="0.3" />
                </svg>
              </motion.div>

              {/* Letter sliding out */}
              <AnimatePresence>
                {stage >= 2 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: -60, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute left-4 right-4 bottom-8 rounded-lg p-3"
                    style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}
                  >
                    <div className="text-xs text-[#8b5e3c] text-center">📜 Secret note</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Message */}
            <AnimatePresence>
              {stage >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="rounded-2xl p-8 text-left w-full"
                  style={{
                    background: '#fffef9',
                    border: '1px solid #f5e4c0',
                    boxShadow: '0 8px 32px rgba(139,94,60,0.12)',
                  }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <TeddySVG size={70} animated={false} expression="wink" />
                    <p
                      className="text-lg font-semibold text-[#4a2c0a]"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Psst...
                    </p>
                  </div>
                  <div
                    className="text-[#4a2c0a] leading-8 space-y-3"
                    style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.15rem' }}
                  >
                    <p>This website isn't asking you for anything.</p>
                    <p>
                      You don't have to reply.<br />
                      You don't have to do anything.
                    </p>
                    <p>Just take the flowers, the jokes, the imaginary teddy, and the birthday wishes.</p>
                    <p className="font-bold text-[#8b5e3c] text-xl">Today is yours.</p>
                    <p>Make it a good one. 🌷🧸</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
