import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import TeddySVG from '../components/teddy/TeddySVG'

// Guitar section — ASCII/SVG guitar with birthday song chord progression
const guitarChords = [
  { chord: 'G',  finger: '320003', emoji: '🎸', note: 'Happy Birthday...' },
  { chord: 'C',  finger: 'x32010', emoji: '🎵', note: 'to you...' },
  { chord: 'D',  finger: 'xx0232', emoji: '🎶', note: 'Happy Birthday...' },
  { chord: 'G',  finger: '320003', emoji: '✨', note: 'to you!' },
  { chord: 'G7', finger: '320001', emoji: '🌷', note: 'Happy Birthday, dear Maahi...' },
  { chord: 'C',  finger: 'x32010', emoji: '🧸', note: 'Happy Birthday...' },
  { chord: 'D7', finger: 'xx0212', emoji: '🎤', note: '...to youuu~ 🎶' },
]

function GuitarString({ active, string }) {
  return (
    <div className="relative h-24 flex items-center">
      <div
        className="w-full h-px transition-all duration-300"
        style={{ background: active ? '#c4956a' : '#ecd4a0', height: active ? 2 : 1 }}
      />
      {active && (
        <motion.div
          animate={{ scaleX: [1, 1.02, 0.99, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 0.3, repeat: 2 }}
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent, #e8b4b8, transparent)' }}
        />
      )}
      <div className="absolute right-0 text-xs text-[#c4956a]"
        style={{ fontFamily: "'Inter', sans-serif" }}>
        {string}
      </div>
    </div>
  )
}

export default function GuitarSong() {
  const [playing, setPlaying] = useState(false)
  const [currentChord, setCurrentChord] = useState(0)
  const [strumming, setStrumming] = useState(false)
  const intervalRef = useRef(null)

  const startSong = () => {
    setPlaying(true)
    setCurrentChord(0)
    let i = 0
    intervalRef.current = setInterval(() => {
      setStrumming(true)
      setTimeout(() => setStrumming(false), 300)
      i++
      if (i >= guitarChords.length) {
        clearInterval(intervalRef.current)
        setTimeout(() => setPlaying(false), 800)
      } else {
        setCurrentChord(i)
      }
    }, 1400)
  }

  const stopSong = () => {
    clearInterval(intervalRef.current)
    setPlaying(false)
    setCurrentChord(0)
    setStrumming(false)
  }

  const chord = guitarChords[currentChord]

  return (
    <section
      id="guitar-song"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #fffef9 0%, #faf0dc 100%)' }}
    >
      <div className="max-w-xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2
            className="text-4xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            A Song For You 🎸
          </h2>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', color: '#8b5e3c' }}>
            Because every birthday deserves its own song.
          </p>
        </motion.div>

        {/* Guitar visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-8 mb-6"
          style={{
            background: 'linear-gradient(135deg, #4a2c0a 0%, #6b4226 40%, #8b5e3c 100%)',
            boxShadow: '0 8px 40px rgba(74,44,10,0.3)',
          }}
        >
          {/* Guitar body outline */}
          <div className="flex items-center gap-6 mb-6">
            {/* SVG Guitar */}
            <motion.div
              animate={strumming ? { rotate: [-3, 3, -2, 2, 0] } : { rotate: 0 }}
              transition={{ duration: 0.4 }}
              className="shrink-0"
            >
              <svg width="80" height="140" viewBox="0 0 80 140" xmlns="http://www.w3.org/2000/svg">
                {/* Neck */}
                <rect x="36" y="0" width="8" height="70" rx="2" fill="#c4956a" />
                {/* Frets */}
                {[15, 28, 41, 54].map(y => (
                  <rect key={y} x="34" y={y} width="12" height="1.5" rx="1" fill="#8b5e3c" />
                ))}
                {/* Tuning pegs */}
                {[8, 18, 28].map((y, i) => (
                  <g key={i}>
                    <circle cx="32" cy={y} r="4" fill="#a07040" />
                    <circle cx="48" cy={y} r="4" fill="#a07040" />
                  </g>
                ))}
                {/* Body */}
                <ellipse cx="40" cy="108" rx="30" ry="28" fill="#8b5e3c" />
                <ellipse cx="40" cy="108" rx="24" ry="22" fill="#a07040" />
                {/* Sound hole */}
                <circle cx="40" cy="105" r="10" fill="#4a2c0a" />
                <circle cx="40" cy="105" r="8" fill="#321c04" />
                {/* Strings */}
                {[-3, -1, 1, 3].map((offset, i) => (
                  <line
                    key={i}
                    x1={40 + offset * 2.5} y1="68"
                    x2={40 + offset * 2.5} y2="125"
                    stroke={strumming ? '#e8b4b8' : '#ecd4a0'}
                    strokeWidth={strumming ? "1.5" : "1"}
                    opacity={strumming ? "1" : "0.7"}
                  />
                ))}
                {/* Bridge */}
                <rect x="28" y="120" width="24" height="4" rx="2" fill="#6b4226" />
              </svg>
            </motion.div>

            {/* Chord display */}
            <div className="flex-1 text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChord}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-5xl font-bold text-[#faf0dc] mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {chord.chord}
                  </p>
                  <p className="text-[#c4956a] text-xs mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    {chord.finger}
                  </p>
                  <p className="text-xl text-[#faf0dc]"
                    style={{ fontFamily: "'Dancing Script', cursive" }}>
                    {chord.emoji} {chord.note}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress */}
          {playing && (
            <div className="flex justify-center gap-1.5 mb-4">
              {guitarChords.map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentChord ? 20 : 8,
                    background: i <= currentChord ? '#e8b4b8' : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            {!playing ? (
              <button
                onClick={startSong}
                className="px-8 py-3 rounded-full bg-[#e8b4b8] text-[#4a2c0a] font-medium text-sm hover:bg-[#f0cdd0] transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                🎸 Play Happy Birthday
              </button>
            ) : (
              <button
                onClick={stopSong}
                className="px-6 py-3 rounded-full bg-[rgba(255,255,255,0.15)] text-[#faf0dc] text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ⏹ Stop
              </button>
            )}
          </div>
        </motion.div>

        {/* Lyrics card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}
        >
          <p
            className="text-[#4a2c0a] leading-8"
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.15rem' }}
          >
            🎵 Happy Birthday to you,<br />
            Happy Birthday to you,<br />
            Happy Birthday, dear <span className="font-bold text-[#8b5e3c]">Maahi</span>...<br />
            Happy Birthday to you! 🎶
          </p>
          <p
            className="text-xs text-[#c4956a] mt-4"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            (The teddy attempted the guitar part. It went better than expected.) 🧸🎸
          </p>
        </motion.div>
      </div>
    </section>
  )
}
