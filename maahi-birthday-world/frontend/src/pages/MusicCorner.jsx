import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'

const concertComments = [
  "The teddy is vibing 🧸",
  "47 flowers received 🌷",
  "Standing ovation from... nobody",
  "Someone in the back is crying. It might be the teddy.",
  "The concert is going extremely well",
  "Encore! Encore! (the teddy is demanding one)",
  "Talent level: immeasurable 🎤",
  "The floor is shaking. That might just be the teddy dancing.",
  "Security reports: zero incidents. No security either.",
  "5 stars. Would attend again immediately.",
]

const stats = [
  { label: "Vocal Power",       pct: 100, note: "" },
  { label: "Teddy's Dance",     pct: 72,  note: "" },
  { label: "Audience Rating",   pct: 100, note: "" },
  { label: "Teddy's Rhythm",    pct: 20,  note: "(the teddy is trying)" },
  { label: "General Chaos",     pct: 87,  note: "" },
]

function StatBar({ label, pct, note, animate }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (animate) {
      const t = setTimeout(() => setWidth(pct), 300)
      return () => clearTimeout(t)
    } else {
      setWidth(0)
    }
  }, [animate, pct])

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-[#faf0dc]" style={{ fontFamily: "'Inter', sans-serif" }}>
          {label} {note && <span className="opacity-60">{note}</span>}
        </span>
        <span className="text-xs text-[#e8b4b8]" style={{ fontFamily: "'Inter', sans-serif" }}>
          {pct}%
        </span>
      </div>
      <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
        <div
          className="progress-fill"
          style={{ width: `${width}%`, transition: 'width 1.5s ease' }}
        />
      </div>
    </div>
  )
}

export default function MusicCorner() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [comments, setComments] = useState([])
  const [commentIdx, setCommentIdx] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const commentTimerRef = useRef(null)
  const endTimerRef = useRef(null)

  const startConcert = () => {
    setIsPlaying(true)
    setComments([concertComments[0]])
    setCommentIdx(1)
    setShowReview(false)

    commentTimerRef.current = setInterval(() => {
      setCommentIdx(i => {
        const next = i < concertComments.length ? i : 0
        setComments(prev => [concertComments[next], ...prev].slice(0, 4))
        return next + 1
      })
    }, 2000)

    endTimerRef.current = setTimeout(() => {
      clearInterval(commentTimerRef.current)
      setIsPlaying(false)
      setShowReview(true)
    }, 18000)
  }

  const stopConcert = () => {
    clearInterval(commentTimerRef.current)
    clearTimeout(endTimerRef.current)
    setIsPlaying(false)
    setShowReview(true)
  }

  useEffect(() => () => {
    clearInterval(commentTimerRef.current)
    clearTimeout(endTimerRef.current)
  }, [])

  const stageEmojis = ['🎤', '🎶', '✨', '🌷', '🧸']

  return (
    <section
      id="music-corner"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #faf0dc 100%)' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Maahi's Imaginary Concert 🎶
          </h2>
        </motion.div>

        {/* Stage card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`concert-stage p-6 md:p-8 mb-6 ${isPlaying ? 'concert-active' : ''}`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h3
              className="text-3xl font-bold mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: '#faf0dc' }}
            >
              🎤 MAAHI LIVE
            </h3>
            <div
              className="text-xs space-y-1 opacity-80"
              style={{ fontFamily: "'Inter', sans-serif", color: '#faf0dc' }}
            >
              <p>Audience: 1 teddy &nbsp;·&nbsp; Flowers: 47 &nbsp;·&nbsp; Security: 0</p>
              <p>Talent: Immeasurable (the teddy disagrees slightly)</p>
            </div>
          </div>

          {/* Stage performance */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                {/* Bouncing emojis */}
                <div className="flex justify-center gap-4 mb-6">
                  {stageEmojis.map((e, i) => (
                    <motion.span
                      key={e}
                      animate={{ y: [0, -16, 0] }}
                      transition={{ duration: 0.6, delay: i * 0.12, repeat: Infinity }}
                      className="text-3xl"
                    >
                      {e}
                    </motion.span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mb-4">
                  {stats.map(s => (
                    <StatBar key={s.label} {...s} animate={isPlaying} />
                  ))}
                </div>

                {/* Live comments */}
                <div
                  className="rounded-xl p-3 space-y-1"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <AnimatePresence>
                    {comments.map((c, i) => (
                      <motion.p
                        key={c + i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1 - i * 0.25, x: 0 }}
                        className="text-xs"
                        style={{ color: '#faf0dc', fontFamily: "'Inter', sans-serif" }}
                      >
                        💬 {c}
                      </motion.p>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="flex justify-center gap-3">
            {!isPlaying && !showReview && (
              <Button onClick={startConcert} variant="primary" size="lg">
                🎤 Start Concert
              </Button>
            )}
            {isPlaying && (
              <button
                onClick={stopConcert}
                className="px-6 py-3 rounded-full bg-[rgba(255,255,255,0.2)] text-[#faf0dc] text-sm hover:bg-[rgba(255,255,255,0.3)] transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ⏹ Stop Concert
              </button>
            )}
          </div>
        </motion.div>

        {/* Review */}
        <AnimatePresence>
          {showReview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 text-center"
              style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}
            >
              <p className="text-2xl mb-2">⭐⭐⭐⭐⭐</p>
              <p
                className="text-lg font-semibold text-[#4a2c0a] mb-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Concert Review: 5/5
              </p>
              <p
                className="text-sm text-[#8b5e3c] mb-4"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                The teddy gives his personal rating. Would attend again immediately.
              </p>
              <Button onClick={startConcert} variant="secondary">
                🎤 Encore!
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
