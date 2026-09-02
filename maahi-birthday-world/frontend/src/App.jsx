import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeddySVG from './components/teddy/TeddySVG'
import { jokes } from './data/jokes'
import { compliments } from './data/compliments'

/* ═══════════════════════════════════════════════════════
   🎵 BOLLYWOOD BIRTHDAY MUSIC — Lightweight & Bulletproof Loop
═══════════════════════════════════════════════════════ */
function useBollywoodMusic() {
  const ctxRef    = useRef(null)
  const isPlaying = useRef(false)
  const timerRef  = useRef(null)
  const [playing, setPlaying] = useState(false)

  // Melody notes: [frequency Hz, duration seconds]
  const MELODY = [
    [392,0.34],[392,0.17],[440,0.45],[392,0.45],[392,0.45],[370,0.45],[330,0.9],
    [392,0.34],[392,0.17],[440,0.45],[392,0.45],[392,0.45],[523,0.45],[494,0.9],
    [392,0.34],[392,0.17],[784,0.45],[659,0.45],[523,0.45],[494,0.45],[440,0.9],
    [349,0.34],[349,0.17],[330,0.45],[523,0.45],[587,0.45],[523,1.1],
  ]

  const playNoteSequence = useCallback(() => {
    if (!isPlaying.current) return

    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      if (!ctxRef.current || ctxRef.current.state === 'closed') {
        ctxRef.current = new AC()
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      let currentTime = ctx.currentTime + 0.05
      MELODY.forEach(([freq, dur]) => {
        // Main melody oscillator
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq

        gain.gain.setValueAtTime(0, currentTime)
        gain.gain.linearRampToValueAtTime(0.18, currentTime + 0.03)
        gain.gain.linearRampToValueAtTime(0.12, currentTime + dur - 0.04)
        gain.gain.linearRampToValueAtTime(0, currentTime + dur)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(currentTime)
        osc.stop(currentTime + dur + 0.01)

        // Warm sub-harmony
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'triangle'
        osc2.frequency.value = freq * 0.5

        gain2.gain.setValueAtTime(0, currentTime)
        gain2.gain.linearRampToValueAtTime(0.05, currentTime + 0.04)
        gain2.gain.linearRampToValueAtTime(0, currentTime + dur)

        osc2.connect(gain2)
        gain2.connect(ctx.destination)

        osc2.start(currentTime)
        osc2.stop(currentTime + dur + 0.01)

        currentTime += dur
      })

      const totalTime = (currentTime - ctx.currentTime) * 1000
      timerRef.current = setTimeout(() => {
        if (isPlaying.current) playNoteSequence()
      }, Math.max(totalTime - 200, 2000))

    } catch (e) {
      console.warn("Audio play issue:", e)
    }
  }, [])

  const startLoop = useCallback(() => {
    if (isPlaying.current) return
    isPlaying.current = true
    setPlaying(true)
    playNoteSequence()
  }, [playNoteSequence])

  const stopLoop = useCallback(() => {
    isPlaying.current = false
    clearTimeout(timerRef.current)
    if (ctxRef.current && ctxRef.current.state !== 'closed') {
      try { ctxRef.current.close() } catch (e) {}
    }
    ctxRef.current = null
    setPlaying(false)
  }, [])

  useEffect(() => {
    return () => {
      isPlaying.current = false
      clearTimeout(timerRef.current)
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        try { ctxRef.current.close() } catch (e) {}
      }
    }
  }, [])

  return { startLoop, stopLoop, playing }
}

/* ═══════════════════════════════════════════════════════
   🎊 SOUND EFFECTS (Pop, Clap, Champagne Cork, Song)
═══════════════════════════════════════════════════════ */
const playPop = () => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const sr = ctx.sampleRate
    const buf = ctx.createBuffer(1, sr * 0.18, sr)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
    const src = ctx.createBufferSource(); src.buffer = buf
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 0.6
    const g = ctx.createGain(); g.gain.setValueAtTime(1.2, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16)
    src.connect(f); f.connect(g); g.connect(ctx.destination)
    src.start(); src.stop(ctx.currentTime + 0.18)
    setTimeout(() => ctx.close(), 500)
  } catch (e) {}
}

const playClap = (n = 8) => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    for (let i = 0; i < n; i++) {
      const t = ctx.currentTime + i * 0.2
      const sr = ctx.sampleRate
      const buf = ctx.createBuffer(1, sr * 0.06, sr)
      const d = buf.getChannelData(0)
      for (let j = 0; j < d.length; j++) d[j] = (Math.random() * 2 - 1) * (1 - j / d.length)
      const src = ctx.createBufferSource(); src.buffer = buf
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 1.2
      const g = ctx.createGain(); g.gain.setValueAtTime(0.7, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
      src.connect(f); f.connect(g); g.connect(ctx.destination)
      src.start(t); src.stop(t + 0.07)
    }
    setTimeout(() => ctx.close(), 2500)
  } catch (e) {}
}

const playChampagnePop = () => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(450, now)
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.08)
    g.gain.setValueAtTime(1.4, now)
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.09)
    osc.connect(g); g.connect(ctx.destination)
    osc.start(now); osc.stop(now + 0.1)

    const sr = ctx.sampleRate
    const buf = ctx.createBuffer(1, sr * 1.2, sr)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 1.4)

    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const noiseFilter = ctx.createBiquadFilter(); noiseFilter.type = 'bandpass'; noiseFilter.frequency.value = 2400; noiseFilter.Q.value = 0.9
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.linearRampToValueAtTime(0.5, now + 0.05)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2)

    noise.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(ctx.destination)
    noise.start(now + 0.04); noise.stop(now + 1.3)

    setTimeout(() => ctx.close(), 1800)
  } catch (e) {}
}

const playBirthdaySong = () => {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    const ctx = new AC()
    const mel = [[392,.3],[392,.15],[440,.45],[392,.45],[523,.45],[494,.9],[392,.3],[392,.15],[440,.45],[392,.45],[587,.45],[523,.9],[392,.3],[392,.15],[784,.45],[659,.45],[523,.45],[494,.45],[440,.9],[698,.3],[698,.15],[659,.45],[523,.45],[587,.45],[523,.9]]
    let t = ctx.currentTime + 0.1
    mel.forEach(([fr, du]) => {
      const o = ctx.createOscillator(), g = ctx.createGain()
      o.connect(g); g.connect(ctx.destination)
      o.type = 'sine'; o.frequency.value = fr
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22, t + 0.04); g.gain.linearRampToValueAtTime(0, t + du)
      o.start(t); o.stop(t + du)
      t += du
    })
    setTimeout(() => ctx.close(), t * 1000 + 400)
  } catch (e) {}
}

/* ═══════════════════════════════════════════════════════
   🎊 CONFETTI BURST
═══════════════════════════════════════════════════════ */
const boom = async (opts = {}) => {
  try {
    const c = (await import('canvas-confetti')).default
    const def = { particleCount: 200, spread: 100, colors: ['#c0384a', '#ffd700', '#f4a0b0', '#fff', '#e05060', '#ff69b4', '#9b59b6'], disableForReducedMotion: true }
    c({ ...def, origin: { y: 0.5 }, ...opts })
    setTimeout(() => c({ ...def, particleCount: 80, origin: { x: 0.05, y: 0.6 } }), 300)
    setTimeout(() => c({ ...def, particleCount: 80, origin: { x: 0.95, y: 0.6 } }), 500)
  } catch (e) {}
}

/* ═══════════════════════════════════════════════════════
   🌸 MULTI-FLOWER FAST RAIN
═══════════════════════════════════════════════════════ */
function RoseSVG({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r = a * Math.PI / 180
        return <ellipse key={i} cx={22 + 13 * Math.cos(r)} cy={22 + 13 * Math.sin(r)} rx="8" ry="6" fill="#c0384a" opacity="0.85" transform={`rotate(${a} ${22 + 13 * Math.cos(r)} ${22 + 13 * Math.sin(r)})`} />
      })}
      <circle cx="22" cy="22" r="9" fill="#c0384a" />
      <circle cx="22" cy="22" r="5.5" fill="#e05060" />
      <circle cx="22" cy="22" r="2.5" fill="#ff6070" opacity="0.9" />
    </svg>
  )
}

function SunflowerSVG({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
        const r = a * Math.PI / 180
        return <ellipse key={i} cx={22 + 13 * Math.cos(r)} cy={22 + 13 * Math.sin(r)} rx="9" ry="4" fill="#ffd700" transform={`rotate(${a} ${22 + 13 * Math.cos(r)} ${22 + 13 * Math.sin(r)})`} />
      })}
      <circle cx="22" cy="22" r="9" fill="#5a2e10" />
      <circle cx="22" cy="22" r="6" fill="#3a1a08" />
    </svg>
  )
}

function TulipSVG({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      <path d="M 22 40 L 22 25" stroke="#2e7d10" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 12 18 C 10 32 34 32 32 18 C 32 10 22 8 22 18 C 22 8 12 10 12 18 Z" fill="#ff69b4" />
      <path d="M 17 22 C 16 32 28 32 27 22 C 27 15 22 12 22 22 Z" fill="#f4a0b0" />
    </svg>
  )
}

function CherryBlossomSVG({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      {[0, 72, 144, 216, 288].map((a, i) => {
        const r = a * Math.PI / 180
        return <ellipse key={i} cx={22 + 11 * Math.cos(r)} cy={22 + 11 * Math.sin(r)} rx="8" ry="7" fill="#ffb3c1" opacity="0.9" transform={`rotate(${a} ${22 + 11 * Math.cos(r)} ${22 + 11 * Math.sin(r)})`} />
      })}
      <circle cx="22" cy="22" r="5" fill="#c0384a" />
    </svg>
  )
}

function DaisySVG({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
        const r = a * Math.PI / 180
        return <ellipse key={i} cx={22 + 12 * Math.cos(r)} cy={22 + 12 * Math.sin(r)} rx="8" ry="4.5" fill="#ffffff" transform={`rotate(${a} ${22 + 12 * Math.cos(r)} ${22 + 12 * Math.sin(r)})`} />
      })}
      <circle cx="22" cy="22" r="6" fill="#ffd700" />
    </svg>
  )
}

const multiFlowers = [
  { c: 'f1', s: 32, type: 'rose' },
  { c: 'f2', s: 28, type: 'sunflower' },
  { c: 'f3', s: 34, type: 'tulip' },
  { c: 'f4', s: 26, type: 'cherry' },
  { c: 'f5', s: 30, type: 'daisy' },
  { c: 'f6', s: 34, type: 'rose' },
  { c: 'f7', s: 28, type: 'sunflower' },
  { c: 'f8', s: 32, type: 'tulip' },
  { c: 'f9', s: 28, type: 'cherry' },
  { c: 'f10', s: 30, type: 'daisy' },
  { c: 'f11', s: 34, type: 'rose' },
  { c: 'f12', s: 28, type: 'sunflower' },
  { c: 'f13', s: 32, type: 'tulip' },
  { c: 'f14', s: 26, type: 'cherry' },
  { c: 'f15', s: 30, type: 'daisy' },
  { c: 'f16', s: 34, type: 'rose' },
  { c: 'f17', s: 28, type: 'sunflower' },
  { c: 'f18', s: 32, type: 'tulip' },
  { c: 'f19', s: 30, type: 'cherry' },
  { c: 'f20', s: 28, type: 'daisy' },
]

function renderFlowerIcon(type, size) {
  switch (type) {
    case 'sunflower': return <SunflowerSVG size={size} />
    case 'tulip': return <TulipSVG size={size} />
    case 'cherry': return <CherryBlossomSVG size={size} />
    case 'daisy': return <DaisySVG size={size} />
    case 'rose':
    default: return <RoseSVG size={size} />
  }
}

function FloatingFlowers() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {multiFlowers.map(({ c, s, type }, i) => (
        <div key={i} className={`flower-fall ${c}`}>
          {renderFlowerIcon(type, s)}
        </div>
      ))}
    </div>
  )
}

function PaperConfetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className={`paper p${i + 1}`} />
      ))}
    </div>
  )
}

function ClubLights() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '65%', height: '100vh', background: 'linear-gradient(145deg, rgba(192,56,74,0.14) 0%, transparent 55%)', animation: 'laser1 4s ease-in-out infinite', transformOrigin: 'top left' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, width: '65%', height: '100vh', background: 'linear-gradient(215deg, rgba(255,215,0,0.12) 0%, transparent 55%)', animation: 'laser2 3.5s ease-in-out infinite', transformOrigin: 'top right' }} />
      <div style={{ position: 'absolute', top: 0, left: '25%', width: '50%', height: '100vh', background: 'linear-gradient(180deg, rgba(155,89,182,0.1) 0%, transparent 45%)', animation: 'laser3 5s ease-in-out infinite', transformOrigin: 'top center' }} />
    </div>
  )
}

function ChampagneFoamOverlay({ show }) {
  if (!show) return null
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-end justify-center">
      {Array.from({ length: 45 }, (_, i) => {
        const size = Math.random() * 28 + 12
        const left = 48 + (Math.random() * 24 - 12)
        const delay = Math.random() * 0.4
        const duration = 1.2 + Math.random() * 0.6
        return (
          <div
            key={i}
            className="foam-bubble absolute rounded-full border border-yellow-200"
            style={{
              width: size,
              height: size,
              left: `${left}%`,
              bottom: '120px',
              background: i % 2 === 0 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 235, 150, 0.9)',
              boxShadow: '0 0 12px rgba(255,215,0,0.8)',
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`
            }}
          />
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   🕺 PARTY SCENE SVG — Clean Spacing & ViewBox (920 x 440)
═══════════════════════════════════════════════════════ */
function PartyScene() {
  return (
    <div style={{ width: '100%', maxWidth: 860, margin: '0 auto' }} className="overflow-x-auto">
      <svg viewBox="0 0 920 440" width="100%" xmlns="http://www.w3.org/2000/svg">
        {/* Floor */}
        {Array.from({ length: 23 }, (_, col) => Array.from({ length: 5 }, (_, row) => (
          <rect key={`floor-${col}-${row}`}
            x={col * 40} y={375 + row * 12} width={40} height={12}
            fill={(col + row) % 2 === 0 ? 'rgba(192,56,74,0.28)' : 'rgba(255,215,0,0.15)'}
            style={{ animation: `floorPulse ${1.4 + row * 0.3}s ease-in-out ${col * 0.08}s infinite` }} />
        )))}

        {/* Disco Ball */}
        <g transform="translate(460,50)">
          <line x1="0" y1="-50" x2="0" y2="-20" stroke="#aaa" strokeWidth="2" opacity="0.8" />
          <circle cx="0" cy="0" r="30" fill="#d0d0d0" opacity="0.95" />
          <g style={{ animation: 'discoBallSpin 3s linear infinite', transformOrigin: '0px 0px' }}>
            {Array.from({ length: 24 }, (_, i) => {
              const a = i * 15; const r = a * Math.PI / 180; const d = 24
              return <rect key={i} x={d * Math.cos(r) - 4} y={d * Math.sin(r) - 4} width="8" height="8"
                fill={['white', '#f4a0b0', '#ffd700', '#aae', '#afa', '#ffb3c1'][i % 6]}
                opacity="0.9" rx="1" transform={`rotate(${a} ${d * Math.cos(r)} ${d * Math.sin(r)})`} />
            })}
          </g>
          <circle cx="0" cy="0" r="30" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          <circle cx="-9" cy="-11" r="7" fill="white" opacity="0.4" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <ellipse key={i} cx={0} cy={0} rx="4" ry="2.5"
              fill={['#c0384a', '#ffd700', '#f4a0b0', '#9b59b6', '#3498db', '#2ecc71'][i]}
              opacity="0.85"
              style={{ animation: `discoLight ${2 + i * 0.3}s linear infinite`, transformOrigin: '0px 0px' }}
              transform={`rotate(${a}) translate(90,0)`} />
          ))}
        </g>

        {/* Adult Dancer 1 */}
        <g transform="translate(45,230)" style={{ animation: 'dance1 0.5s ease-in-out infinite alternate' }}>
          <rect x="-16" y="0" width="32" height="45" rx="10" fill="#c0384a" />
          <circle cx="0" cy="-22" r="20" fill="#f4c4a0" />
          <ellipse cx="0" cy="-38" rx="20" ry="10" fill="#1a0a04" />
          <circle cx="-6" cy="-24" r="3" fill="#1a0a04" />
          <circle cx="6" cy="-24" r="3" fill="#1a0a04" />
          <path d="M -6 -14 Q 0 -8 6 -14" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="-16" y1="8" x2="-38" y2="-15" stroke="#f4c4a0" strokeWidth="9" strokeLinecap="round" />
          <line x1="16" y1="12" x2="36" y2="20" stroke="#f4c4a0" strokeWidth="9" strokeLinecap="round" />
          <line x1="-8" y1="45" x2="-15" y2="82" stroke="#3a3a5c" strokeWidth="11" strokeLinecap="round" />
          <line x1="8" y1="45" x2="18" y2="80" stroke="#2d2d4a" strokeWidth="11" strokeLinecap="round" />
        </g>

        {/* Adult Dancer 2 */}
        <g transform="translate(130,220)" style={{ animation: 'dance2 0.6s ease-in-out infinite alternate' }}>
          <rect x="-15" y="0" width="30" height="44" rx="10" fill="#9b59b6" />
          <circle cx="0" cy="-21" r="19" fill="#e8b090" />
          <ellipse cx="0" cy="-36" rx="19" ry="9" fill="#5a2d0a" />
          <ellipse cx="-14" cy="-28" rx="7" ry="14" fill="#5a2d0a" />
          <ellipse cx="14" cy="-28" rx="7" ry="14" fill="#5a2d0a" />
          <circle cx="-6" cy="-23" r="2.5" fill="#1a0a04" />
          <circle cx="6" cy="-23" r="2.5" fill="#1a0a04" />
          <path d="M -5 -13 Q 0 -7 5 -13" stroke="#c0384a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <circle cx="-19" cy="-22" r="2.5" fill="#ffd700" />
          <line x1="-15" y1="6" x2="-35" y2="-5" stroke="#e8b090" strokeWidth="9" strokeLinecap="round" />
          <line x1="15" y1="6" x2="38" y2="-10" stroke="#e8b090" strokeWidth="9" strokeLinecap="round" />
          <path d="M -20 44 Q -25 80 -15 82 L 15 82 Q 25 80 20 44" fill="#9b59b6" />
          <line x1="-10" y1="82" x2="-10" y2="100" stroke="#c0384a" strokeWidth="7" strokeLinecap="round" />
          <line x1="10" y1="82" x2="14" y2="100" stroke="#a02030" strokeWidth="7" strokeLinecap="round" />
        </g>

        {/* Kid Dancer 1 */}
        <g transform="translate(220,270)" style={{ animation: 'danceKid 0.4s ease-in-out infinite alternate' }}>
          <rect x="-12" y="0" width="24" height="34" rx="8" fill="#ffd700" />
          <circle cx="0" cy="-16" r="15" fill="#f4c4a0" />
          <ellipse cx="0" cy="-27" rx="14" ry="7" fill="#1a0a04" />
          <circle cx="-4" cy="-17" r="2" fill="#1a0a04" />
          <circle cx="4" cy="-17" r="2" fill="#1a0a04" />
          <path d="M -4 -9 Q 0 -5 4 -9" stroke="#c0384a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <line x1="-12" y1="6" x2="-28" y2="-7" stroke="#f4c4a0" strokeWidth="8" strokeLinecap="round" />
          <line x1="12" y1="6" x2="28" y2="-2" stroke="#f4c4a0" strokeWidth="8" strokeLinecap="round" />
          <line x1="-6" y1="34" x2="-9" y2="60" stroke="#c0384a" strokeWidth="8" strokeLinecap="round" />
          <line x1="6" y1="34" x2="12" y2="58" stroke="#a02030" strokeWidth="8" strokeLinecap="round" />
          <text x="0" y="74" textAnchor="middle" fontSize="9" fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="bold">Kid 1 🎈</text>
        </g>

        {/* Kid Dancer 2 */}
        <g transform="translate(295,265)" style={{ animation: 'danceKid 0.45s ease-in-out 0.2s infinite alternate' }}>
          <rect x="-11" y="0" width="22" height="32" rx="7" fill="#3498db" />
          <circle cx="0" cy="-15" r="14" fill="#e8b090" />
          <ellipse cx="0" cy="-25" rx="13" ry="7" fill="#2d1208" />
          <circle cx="-4" cy="-16" r="2" fill="#1a0a04" />
          <circle cx="4" cy="-16" r="2" fill="#1a0a04" />
          <path d="M -4 -8 Q 0 -4 4 -8" stroke="#c0384a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <line x1="-11" y1="5" x2="-26" y2="-10" stroke="#e8b090" strokeWidth="8" strokeLinecap="round" />
          <line x1="11" y1="5" x2="26" y2="0" stroke="#e8b090" strokeWidth="8" strokeLinecap="round" />
          <line x1="-5" y1="32" x2="-8" y2="58" stroke="#3498db" strokeWidth="8" strokeLinecap="round" />
          <line x1="5" y1="32" x2="10" y2="56" stroke="#2070a0" strokeWidth="8" strokeLinecap="round" />
          <text x="0" y="72" textAnchor="middle" fontSize="9" fontFamily="Poppins,sans-serif" fill="#70c0ff" fontWeight="bold">Kid 2 🎈</text>
        </g>

        {/* Guitarist */}
        <g transform="translate(460,210)">
          <ellipse cx="0" cy="100" rx="24" ry="9" fill="#6b3520" />
          <line x1="-16" y1="100" x2="-16" y2="150" stroke="#6b3520" strokeWidth="6" strokeLinecap="round" />
          <line x1="16" y1="100" x2="16" y2="150" stroke="#6b3520" strokeWidth="6" strokeLinecap="round" />
          <rect x="-22" y="20" width="44" height="80" rx="12" fill="#1e3a6e" />
          <circle cx="0" cy="0" r="25" fill="#f4c4a0" />
          <ellipse cx="0" cy="-21" rx="23" ry="12" fill="#1a0a04" />
          {[-16, -8, 0, 8, 16].map((x, i) => (
            <path key={i} d={`M ${x} -28 Q ${x + 3} -42 ${x} -36`} stroke="#1a0a04" strokeWidth="5" fill="none" strokeLinecap="round" />
          ))}
          <circle cx="-7" cy="2" r="3.5" fill="#1a0a04" />
          <circle cx="7" cy="2" r="3.5" fill="#1a0a04" />
          <path d="M -6 12 Q 0 18 6 12" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="-14" cy="8" rx="6" ry="4" fill="#e8a0a0" opacity="0.45" />
          <ellipse cx="14" cy="8" rx="6" ry="4" fill="#e8a0a0" opacity="0.45" />

          {/* Guitar */}
          <g style={{ animation: 'guitarStrum 0.3s ease-in-out infinite alternate', transformOrigin: '0px 60px' }}>
            <rect x="3" y="25" width="10" height="75" rx="5" fill="#c8935a" />
            {[35, 48, 61, 74].map(y => <rect key={y} x="2" y={y} width="12" height="2" rx="1" fill="#8b5c28" />)}
            <ellipse cx="8" cy="118" rx="34" ry="36" fill="#8b5e3c" />
            <ellipse cx="8" cy="118" rx="27" ry="29" fill="#a07040" />
            <circle cx="8" cy="115" r="13" fill="#3a1a08" />
            {[-3, -1, 1, 3, 5, 7].map((o, i) => (
              <line key={i} x1={8 + o} y1="95" x2={8 + o} y2="148" stroke="#ffd700" strokeWidth="0.9" opacity="0.85" />
            ))}
            <rect x="-16" y="144" width="48" height="6" rx="3" fill="#6b4226" />
          </g>
          <line x1="-20" y1="40" x2="5" y2="55" stroke="#f4c4a0" strokeWidth="12" strokeLinecap="round" />
          <line x1="20" y1="50" x2="18" y2="110" stroke="#f4c4a0" strokeWidth="12" strokeLinecap="round" />
          <line x1="-10" y1="100" x2="-15" y2="150" stroke="#1e3a6e" strokeWidth="14" strokeLinecap="round" />
          <line x1="10" y1="100" x2="20" y2="148" stroke="#1e3a6e" strokeWidth="14" strokeLinecap="round" />
        </g>

        {/* Adult Dancer 3 */}
        <g transform="translate(630,225)" style={{ animation: 'dance3 0.55s ease-in-out infinite alternate' }}>
          <rect x="-15" y="0" width="30" height="44" rx="10" fill="#2ecc71" />
          <circle cx="0" cy="-21" r="19" fill="#f0c8a0" />
          <ellipse cx="0" cy="-36" rx="19" ry="10" fill="#3a1a0a" />
          <circle cx="-6" cy="-23" r="3" fill="#1a0a04" />
          <circle cx="6" cy="-23" r="3" fill="#1a0a04" />
          <path d="M -5 -12 Q 0 -6 5 -12" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="-15" y1="8" x2="-36" y2="-12" stroke="#f0c8a0" strokeWidth="9" strokeLinecap="round" />
          <line x1="15" y1="8" x2="38" y2="-8" stroke="#f0c8a0" strokeWidth="9" strokeLinecap="round" />
          <line x1="-8" y1="44" x2="-14" y2="80" stroke="#1e3a1e" strokeWidth="11" strokeLinecap="round" />
          <line x1="8" y1="44" x2="18" y2="78" stroke="#1e3a1e" strokeWidth="11" strokeLinecap="round" />
        </g>

        {/* Adult Dancer 4 */}
        <g transform="translate(720,220)" style={{ animation: 'dance4 0.5s ease-in-out 0.25s infinite alternate' }}>
          <rect x="-16" y="0" width="32" height="46" rx="10" fill="#e74c3c" />
          <circle cx="0" cy="-22" r="20" fill="#e8b090" />
          <ellipse cx="0" cy="-38" rx="20" ry="10" fill="#5a2d0a" />
          <circle cx="-7" cy="-24" r="3" fill="#1a0a04" />
          <circle cx="7" cy="-24" r="3" fill="#1a0a04" />
          <path d="M -6 -12 Q 0 -6 6 -12" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
          <line x1="-16" y1="10" x2="-40" y2="5" stroke="#e8b090" strokeWidth="10" strokeLinecap="round" />
          <line x1="16" y1="10" x2="42" y2="-8" stroke="#e8b090" strokeWidth="10" strokeLinecap="round" />
          <line x1="-9" y1="46" x2="-16" y2="82" stroke="#8a1a1a" strokeWidth="12" strokeLinecap="round" />
          <line x1="9" y1="46" x2="20" y2="80" stroke="#8a1a1a" strokeWidth="12" strokeLinecap="round" />
        </g>

        {/* Drinks & Champagne Table */}
        <g transform="translate(810,240)">
          <rect x="-10" y="115" width="95" height="10" rx="5" fill="#6b3520" />
          <line x1="5" y1="125" x2="5" y2="168" stroke="#6b3520" strokeWidth="7" strokeLinecap="round" />
          <line x1="70" y1="125" x2="70" y2="168" stroke="#6b3520" strokeWidth="7" strokeLinecap="round" />

          <rect x="0" y="55" width="20" height="60" rx="5" fill="#2d6e20" />
          <rect x="5" y="38" width="10" height="20" rx="4" fill="#2d6e20" />
          <rect x="2" y="70" width="16" height="22" rx="2" fill="#ffd700" opacity="0.85" />
          <text x="10" y="84" textAnchor="middle" fontSize="6" fill="#2d0a12" fontWeight="bold">PARTY</text>
          <rect x="7" y="34" width="6" height="6" rx="2" fill="#c8935a" />

          <g transform="translate(30,62)">
            <polygon points="0,0 10,0 7,28 3,28" fill="rgba(200,255,255,0.45)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="5" y1="28" x2="5" y2="44" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
            <ellipse cx="5" cy="44" rx="6" ry="2.5" fill="rgba(255,255,255,0.3)" />
          </g>
          <g transform="translate(50,66)">
            <polygon points="0,0 10,0 7,26 3,26" fill="rgba(200,255,255,0.4)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            <line x1="5" y1="26" x2="5" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
            <ellipse cx="5" cy="40" rx="6" ry="2.5" fill="rgba(255,255,255,0.3)" />
          </g>
        </g>

        <text x="460" y="420" textAnchor="middle" fontSize="12" fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="600">
          🎉 Party chal rahi hai! Dance, Music, Cake, Champagne! 🎉
        </text>
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   🎈 BALLOONS
═══════════════════════════════════════════════════════ */
const BC = ['#c0384a', '#e05060', '#ffd700', '#f4a0b0', '#ff7f50', '#9b59b6', '#3498db', '#ff69b4']
const BM = ['🌹 Maahi!', '🎉 Party!', '🧸 Teddy!', '✨ Amazing!', '🎂 Cake!', '💛 Love!', '🌸 Akshuu!', '🎊 Yaaay!']

function Balloon({ id, color, xRatio, message, onPop }) {
  const [popped, setPopped] = useState(false)
  const [msg, setMsg] = useState(false)
  const handle = async () => {
    if (popped) return
    setPopped(true); setMsg(true); playPop()
    try {
      const c = (await import('canvas-confetti')).default
      c({ particleCount: 55, spread: 75, colors: [color, '#ffd700', '#fff', '#f4a0b0'], origin: { x: xRatio, y: 0.5 }, scalar: 0.9, disableForReducedMotion: true })
    } catch (e) {}
    setTimeout(() => setMsg(false), 1800)
    setTimeout(() => onPop(id), 2000)
  }
  return (
    <motion.div initial={{ scale: 0, y: 30 }} animate={{ scale: 1, y: [0, -15, 0] }} exit={{ scale: [1, 1.6, 0], opacity: [1, 1, 0], transition: { duration: 0.3 } }}
      transition={{ scale: { type: 'spring', stiffness: 180 }, y: { duration: 2.5 + Math.random(), repeat: Infinity, ease: 'easeInOut' } }}
      onClick={handle} className="cursor-pointer select-none relative" title="Pop! 🎈">
      <svg width="72" height="95" viewBox="0 0 72 95">
        <ellipse cx="36" cy="36" rx="30" ry="34" fill={color} />
        <ellipse cx="27" cy="23" rx="9" ry="11" fill="white" opacity="0.2" />
        <path d="M 34 70 Q 36 74 38 70" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M 36 73 Q 31 82 36 90" stroke="#d4a0a8" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <AnimatePresence>
        {msg && <motion.div initial={{ opacity: 0, y: 0, scale: 0.6 }} animate={{ opacity: 1, y: -45, scale: 1 }} exit={{ opacity: 0 }}
          className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl px-3 py-1.5 text-xs font-bold z-20 pointer-events-none"
          style={{ background: '#ffd700', color: '#2d0a12', fontFamily: "'Poppins',sans-serif", top: 0 }}>
          {message}
        </motion.div>}
      </AnimatePresence>
    </motion.div>
  )
}

function BalloonSection({ onAllPopped }) {
  const [balloons, setBalloons] = useState(Array.from({ length: 8 }, (_, i) => ({ id: i, color: BC[i], xRatio: (0.1 + i * 0.11), message: BM[i] })))
  const pop = useCallback((id) => {
    setBalloons(b => {
      const next = b.filter(x => x.id !== id)
      if (next.length === 0) { onAllPopped?.(); boom() }
      return next
    })
  }, [onAllPopped])
  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center items-end gap-4 min-h-[130px]">
        <AnimatePresence>
          {balloons.map(b => <Balloon key={b.id} {...b} onPop={pop} />)}
        </AnimatePresence>
        {balloons.length === 0 && <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem', color: '#ffd700' }}>
          🎊 Saare phoot gaye! Mast party! 🎉
        </motion.p>}
      </div>
      {balloons.length > 0 && <p style={{ color: '#9a6070', fontSize: '0.88rem', marginTop: 12, fontFamily: "'Poppins',sans-serif" }}>
        👆 Tap to pop! Cracker sound aayega! 🎆 ({balloons.length} bache hain)
      </p>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   🎂 CHOCOLATE CAKE WITH GIRL CUTTING
═══════════════════════════════════════════════════════ */
function ChocCake({ blown, cut, onBlow, onCut }) {
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 340 310" width="100%" style={{ maxWidth: 380 }} xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="160" cy="298" rx="155" ry="10" fill="#1a0804" opacity="0.4" />

        <rect x="10" y="228" width="230" height="62" rx="12" fill="#3d1c09" />
        <rect x="10" y="228" width="230" height="16" rx="8" fill="#5a2e10" />
        {[26, 50, 74, 98, 122, 146, 170, 194, 218].map((x, i) => (
          <ellipse key={i} cx={x} cy={228} rx={i % 2 === 0 ? 9 : 7} ry={i % 2 === 0 ? 12 : 9} fill="#1a0804" opacity="0.9" />
        ))}
        {[38, 72, 106, 140, 174, 208].map((x, i) => (
          <circle key={i} cx={x} cy={243} r="4" fill="#ffd700" opacity="0.6" />
        ))}

        <rect x="22" y="168" width="206" height="62" rx="10" fill="#6b3520" />
        <rect x="22" y="168" width="206" height="14" rx="7" fill="#8b4a28" />
        {[40, 70, 100, 130, 160, 190, 215].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={190} rx="9" ry="11" fill="#e03050" />
            <polygon points={`${x - 3},${180} ${x + 3},${180} ${x},${177}`} fill="#1e6b10" opacity="0.9" />
          </g>
        ))}

        <rect x="36" y="112" width="178" height="58" rx="9" fill="#2d1008" />
        <rect x="36" y="112" width="178" height="13" rx="6" fill="#4a1e0c" />
        {[48, 70, 92, 115, 138, 162, 186, 205].map((x, i) => (
          <ellipse key={i} cx={x} cy={112} rx={i % 2 === 0 ? 9 : 7} ry={i % 2 === 0 ? 12 : 10} fill="#1a0804" opacity="0.9" />
        ))}

        <text x="125" y="148" textAnchor="middle" fontSize="20"
          fontFamily="'Pacifico','Cormorant Garamond',serif" fill="#ffb3c1" fontWeight="bold"
          style={{ textShadow: '0 0 10px rgba(255,100,130,0.8)' }}>
          Akshuu ❤️
        </text>
        <text x="125" y="261" textAnchor="middle" fontSize="10"
          fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="700" opacity="0.9">
          🎂 Happy Birthday! 🎂
        </text>

        {[62, 88, 120, 152, 178].map((x, i) => (
          <g key={i}>
            <rect x={x - 5} y={74} width="10" height="39"
              fill={['#f4a0b0', '#ffd700', '#c0384a', '#9b59b6', '#ff7f50'][i]} rx="4" />
            {!blown ? (
              <g className="flame" style={{ transformOrigin: `${x}px 68px` }}>
                <ellipse cx={x} cy={67} rx="6" ry="9" fill="#FFA500" opacity="0.95" />
                <ellipse cx={x} cy={62} rx="4" ry="6" fill="#FFD700" />
                <ellipse cx={x} cy={57} rx="2" ry="3.5" fill="white" opacity="0.9" />
              </g>
            ) : <text x={x} y={65} textAnchor="middle" fontSize="14">💨</text>}
          </g>
        ))}

        {cut && <line x1={125} y1={112} x2={125} y2={290} stroke="rgba(255,255,255,0.75)" strokeWidth="3.5" strokeDasharray="7,3" strokeLinecap="round" />}

        {blown && (
          <g>
            <line x1="265" y1="235" x2="265" y2="292" stroke="#c0384a" strokeWidth="13" strokeLinecap="round" />
            <line x1="278" y1="237" x2="280" y2="292" stroke="#a02030" strokeWidth="12" strokeLinecap="round" />
            <ellipse cx="262" cy="292" rx="10" ry="5.5" fill="#5a1020" />
            <ellipse cx="280" cy="292" rx="10" ry="5.5" fill="#5a1020" />
            <path d="M 252 235 Q 248 260 252 290 L 292 290 Q 296 260 292 235 Z" fill="#c0384a" opacity="0.9" />
            <rect x="252" y="182" width="44" height="56" rx="9" fill="#e05060" />
            <g style={{ transform: cut ? 'rotate(10deg)' : 'rotate(0deg)', transformOrigin: '230px 185px', transition: 'transform 0.4s' }}>
              <line x1="252" y1="188" x2="218" y2="175" stroke="#f4c4a0" strokeWidth="12" strokeLinecap="round" />
              <ellipse cx="215" cy="173" rx="10" ry="7" fill="#e8b090" />
              {cut && <>
                <rect x="192" y="167" width="26" height="7" rx="3.5" fill="#d0d0d0" />
                <path d="M 192 170 L 178 178 L 192 174" fill="#a0a0a0" />
              </>}
            </g>
            <line x1="296" y1="190" x2="314" y2="210" stroke="#f4c4a0" strokeWidth="12" strokeLinecap="round" />
            <circle cx="272" cy="156" r="28" fill="#f4c4a0" />
            <ellipse cx="272" cy="133" rx="27" ry="13" fill="#1a0a04" />
            <rect x="246" y="130" width="13" height="74" rx="6.5" fill="#1a0a04" />
            <rect x="285" y="130" width="13" height="74" rx="6.5" fill="#1a0a04" />
            <circle cx="264" cy="156" r="2.8" fill="#1a0a04" />
            <circle cx="280" cy="156" r="2.8" fill="#1a0a04" />
            <path d={cut ? "M 262 168 Q 272 178 282 168" : "M 264 168 Q 272 174 280 168"}
              stroke="#c0384a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        )}
      </svg>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginTop: 12 }}>
        {!blown && <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={onBlow} className="btn-gold">
          🌬️ Candles Phunko!
        </motion.button>}
        {blown && !cut && <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={onCut} className="btn-rose">
          🔪 Cake Kato, Akshuu!
        </motion.button>}
        {cut && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: '#ffd700', textAlign: 'center' }}>
            🎂 Akshuu ne cake kaata! Waah! 🎉<br />
            <span style={{ fontSize: '0.95rem', color: '#d4a0a8' }}>Clapping + Birthday song baj raha hai! 👏🎵</span>
          </p>
        </motion.div>}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   🌹 BOUQUET SCENE — ViewBox (440 x 320)
═══════════════════════════════════════════════════════ */
function BouquetScene() {
  const [given, setGiven] = useState(false)
  const give = () => { setGiven(true); boom({ particleCount: 120, spread: 75 }) }
  return (
    <div className="flex flex-col items-center max-w-lg w-full mx-auto">
      <svg viewBox="0 0 440 320" width="100%" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="220" cy="275" rx="200" ry="16" fill="rgba(192,56,74,0.12)" />

        {/* Abhishek */}
        <rect x="68" y="210" width="14" height="55" rx="7" fill="#3a3a5c" />
        <rect x="86" y="210" width="14" height="55" rx="7" fill="#2d2d4a" />
        <ellipse cx="75" cy="265" rx="10" ry="5" fill="#1a1a2e" />
        <ellipse cx="93" cy="265" rx="10" ry="5" fill="#1a1a2e" />
        <rect x="60" y="155" width="52" height="58" rx="10" fill="#1e3a6e" />
        <path d="M 80 155 L 86 165 L 92 155" fill="white" opacity="0.7" />
        <rect x="42" y="160" width="18" height="44" rx="9" fill="#f4c4a0" />
        <g style={{ transform: given ? 'translateX(28px)' : 'none', transition: 'transform 0.4s' }}>
          <rect x="112" y="162" width="44" height="16" rx="8" fill="#f4c4a0" />
        </g>
        <circle cx="86" cy="130" r="30" fill="#f4c4a0" />
        <ellipse cx="86" cy="106" rx="28" ry="12" fill="#2a1a0a" />
        <ellipse cx="62" cy="118" rx="8" ry="14" fill="#2a1a0a" />
        <ellipse cx="110" cy="118" rx="8" ry="14" fill="#2a1a0a" />
        <circle cx="78" cy="130" r="2.5" fill="#1a0a04" />
        <circle cx="94" cy="130" r="2.5" fill="#1a0a04" />
        <path d="M 79 142 Q 86 150 93 142" stroke="#c0384a" strokeWidth="2" fill="none" strokeLinecap="round" />

        <rect x="36" y="282" width="100" height="24" rx="12" fill="rgba(30,58,110,0.9)" stroke="#a0c0ff" strokeWidth="1.2" />
        <text x="86" y="298" textAnchor="middle" fontSize="11" fontFamily="Poppins,sans-serif" fill="#ffffff" fontWeight="bold">Abhishek 🌹</text>

        {/* Bouquet */}
        <g style={{ transform: given ? 'translateX(75px)' : 'none', transition: 'transform 0.4s' }}>
          <path d="M 170 230 L 200 175 L 230 230 Z" fill="#d4a060" opacity="0.8" />
          <path d="M 180 215 Q 200 220 220 215" stroke="#c0384a" strokeWidth="4.5" fill="none" />
          {[[200, 148, 36], [182, 158, 28], [218, 158, 28], [170, 170, 26], [230, 170, 26], [192, 165, 24], [208, 165, 24], [200, 178, 22], [185, 180, 20], [215, 180, 20], [200, 142, 20]].map(([cx, cy, sz], i) => (
            <g key={i}>
              {[0, 60, 120, 180, 240, 300].map((a, j) => { const r = a * Math.PI / 180, d = sz * 0.38; return <ellipse key={j} cx={cx + d * Math.cos(r)} cy={cy + d * Math.sin(r)} rx={sz * 0.28} ry={sz * 0.22} fill={i % 3 === 0 ? '#c0384a' : i % 3 === 1 ? '#e05060' : '#a02030'} opacity="0.85" transform={`rotate(${a} ${cx + d * Math.cos(r)} ${cy + d * Math.sin(r)})`} /> })}
              <circle cx={cx} cy={cy} r={sz * 0.25} fill={i % 2 === 0 ? '#c0384a' : '#e05060'} />
            </g>
          ))}
        </g>

        {/* Akshuu */}
        <rect x="328" y="210" width="14" height="55" rx="7" fill="#c0384a" />
        <rect x="346" y="210" width="14" height="55" rx="7" fill="#a02030" />
        <ellipse cx="335" cy="265" rx="9" ry="5" fill="#8a1a28" />
        <ellipse cx="353" cy="265" rx="9" ry="5" fill="#8a1a28" />
        <path d="M 318 210 Q 314 240 318 265 L 370 265 Q 374 240 370 210 Z" fill="#c0384a" />
        <rect x="320" y="155" width="48" height="58" rx="10" fill="#e05060" />
        <g style={{ transform: given ? 'translateX(-26px)' : 'none', transition: 'transform 0.4s' }}>
          <rect x="272" y="162" width="48" height="15" rx="7" fill="#f4c4a0" />
        </g>
        <rect x="368" y="160" width="16" height="44" rx="8" fill="#f4c4a0" />
        <circle cx="344" cy="125" r="30" fill="#f4c4a0" />
        <ellipse cx="344" cy="102" rx="30" ry="14" fill="#1a0a04" />
        <rect x="316" y="100" width="14" height="80" rx="7" fill="#1a0a04" />
        <rect x="362" y="100" width="14" height="80" rx="7" fill="#1a0a04" />
        <circle cx="336" cy="125" r="2.5" fill="#1a0a04" />
        <circle cx="352" cy="125" r="2.5" fill="#1a0a04" />
        <path d={given ? "M 334 138 Q 344 150 354 138" : "M 336 138 Q 344 144 352 138"} stroke="#c0384a" strokeWidth="2.2" fill="none" strokeLinecap="round" />

        <rect x="294" y="282" width="100" height="24" rx="12" fill="rgba(192,56,74,0.9)" stroke="#ffd700" strokeWidth="1.2" />
        <text x="344" y="298" textAnchor="middle" fontSize="11" fontFamily="Poppins,sans-serif" fill="#ffd700" fontWeight="bold">Akshuu ✨</text>

        {given && <g style={{ opacity: 1 }}>
          <rect x="130" y="45" width="180" height="28" rx="14" fill="rgba(192,56,74,0.4)" stroke="rgba(244,160,176,0.6)" strokeWidth="1.2" />
          <text x="220" y="64" textAnchor="middle" fontSize="11" fontFamily="Poppins,sans-serif" fill="#f4a0b0" fontWeight="600">🌹 Bestfriends Forever 🌹</text>
        </g>}
      </svg>
      {!given && <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} onClick={give} className="btn-gold mt-2">
        🌹 Abhishek Ne Diya Bouquet!
      </motion.button>}
      {given && <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}
        style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', color: '#f4a0b0', marginTop: 10, textAlign: 'center' }}>
        🌹 Yeh bouquet sirf bestfriends ki dosti ka symbol hai! 🧸
      </motion.p>}
    </div>
  )
}

const loadMsgs = ['🌸 Phoolon ki baarish ho rahi hai...', '🧸 Teddy taiyaar ho raha hai...', '🎂 Chocolate cake bake ho rahi hai...', '🎈 Balloons fula rahe hain...', '🪩 Disco ball set ho raha hai...', '🍾 Champagne chilled ho rahi hai...', '✨ Sab taiyaar! Akshuu ko bulao! 🥳']

/* ═══════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState('loading')
  const [loadStep, setLoadStep] = useState(0)
  const [blown, setBlown] = useState(false)
  const [cut, setCut] = useState(false)
  const [jokeIdx, setJokeIdx] = useState(0)
  const [jokeKey, setJokeKey] = useState(0)
  const [compIdx, setCompIdx] = useState(0)
  const [showFoam, setShowFoam] = useState(false)

  const { startLoop, stopLoop, playing } = useBollywoodMusic()

  useEffect(() => {
    if (screen !== 'loading') return
    if (loadStep < loadMsgs.length) { const t = setTimeout(() => setLoadStep(s => s + 1), 700); return () => clearTimeout(t) }
    else { const t = setTimeout(() => setScreen('hero'), 500); return () => clearTimeout(t) }
  }, [screen, loadStep])

  const handleBlow = () => { setBlown(true); boom({ particleCount: 150, spread: 80, origin: { y: 0.4 } }) }
  const handleCut = () => { setCut(true); playClap(8); playBirthdaySong(); boom({ particleCount: 220, spread: 110 }) }
  
  const safeJokes = (jokes && jokes.length > 0) ? jokes : [{ setup: 'हँसते रहो!', punchline: 'Happy Birthday! 🌹' }]
  const safeCompliments = (compliments && compliments.length > 0) ? compliments : ['You are amazing!']

  const nextJoke = () => { setJokeIdx(i => (i + 1) % safeJokes.length); setJokeKey(k => k + 1) }
  const nextComp = () => setCompIdx(i => { let n = Math.floor(Math.random() * safeCompliments.length); while (n === i && safeCompliments.length > 1) n = Math.floor(Math.random() * safeCompliments.length); return n })

  const triggerChampagneAction = () => {
    playChampagnePop()
    playClap(10)
    boom({ particleCount: 350, spread: 130 })
    setShowFoam(true)
    setTimeout(() => setShowFoam(false), 2200)
  }

  const CS = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244,160,176,0.2)', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }
  const ST = { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.7rem,5vw,2.7rem)', color: '#f4a0b0', textAlign: 'center', marginBottom: 8 }

  if (screen === 'loading') return (
    <div style={{ minHeight: '100vh', background: '#1a0508', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 2.5, repeat: Infinity }}><TeddySVG size={110} /></motion.div>
      <div style={{ marginTop: 32, textAlign: 'center', padding: '0 20px' }}>
        <AnimatePresence mode="wait">
          <motion.p key={loadStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', color: '#f4a0b0', fontStyle: 'italic' }}>
            {loadMsgs[Math.min(loadStep, loadMsgs.length - 1)]}
          </motion.p>
        </AnimatePresence>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {loadMsgs.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', transition: 'all 0.4s', background: i < loadStep ? '#c0384a' : '#4a1a20' }} />)}
        </div>
      </div>
    </div>
  )

  if (screen === 'hero') return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 30%, #3a0e16 0%, #1a0508 70%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '24px', overflow: 'hidden' }}>
      <FloatingFlowers /><PaperConfetti /><ClubLights />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#c0384a,#ffd700,#c0384a,#ffd700,#c0384a)' }} />
      <div style={{ fontSize: '2rem', letterSpacing: '6px', marginBottom: 20, opacity: 0.7 }}>🎉 🎈 🌸 🎊 🌻 🎈 🎉</div>
      <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }} style={{ marginBottom: 16 }}>
        <TeddySVG size={155} />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="glow-title" style={{ fontFamily: "'Pacifico',cursive", fontSize: 'clamp(2rem,8vw,4rem)', color: '#c0384a', textAlign: 'center', marginBottom: 8 }}>
        Happy Birthday, Akshuu! 🌹
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', color: '#d4a0a8', fontStyle: 'italic', textAlign: 'center', marginBottom: 32, maxWidth: 380 }}>
        Abhishek ki taraf se — ek chhota sa birthday surprise 🧸
      </motion.p>
      <motion.button initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: 'spring' }}
        whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.94 }}
        onClick={() => { setScreen('main'); startLoop(); }}
        className="btn-rose" style={{ fontSize: '1.15rem' }}>
        🎁 Open Your Birthday Gift!
      </motion.button>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#c0384a,#ffd700,#c0384a)' }} />
    </div>
  )

  /* ── MAIN SCREEN ── */
  const currentJoke = safeJokes[jokeIdx % safeJokes.length] || safeJokes[0]
  const currentCompliment = safeCompliments[compIdx % safeCompliments.length] || safeCompliments[0]

  return (
    <div style={{ minHeight: '100vh', background: '#1a0508', position: 'relative' }}>
      <FloatingFlowers /><PaperConfetti /><ClubLights />

      <ChampagneFoamOverlay show={showFoam} />

      {/* Ticker */}
      <div style={{ background: '#c0384a', overflow: 'hidden', padding: '8px 0', borderBottom: '2px solid #ffd700', position: 'relative', zIndex: 10 }}>
        <span className="ticker" style={{ fontFamily: "'Poppins',sans-serif", fontSize: '0.88rem', color: 'white', fontWeight: 600 }}>
          &nbsp;&nbsp;&nbsp;🎉 Happy Birthday Akshuu! 🌹 &nbsp;|&nbsp; 🎂 From Abhishek with love! 🧸 &nbsp;|&nbsp; 🎈 Pop pop pop! 🎊 &nbsp;|&nbsp; 🌹 Bestfriends forever! ✨ &nbsp;|&nbsp; 🎵 Bollywood birthday music baj rahi hai! 🎉 &nbsp;|&nbsp; 🕺 Dance floor pe aao! 💃 &nbsp;|&nbsp; 🍾 Champagne time! 🎶&nbsp;&nbsp;&nbsp;
        </span>
      </div>

      {/* Music Toggle */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
        <button onClick={playing ? stopLoop : startLoop} className={playing ? 'btn-outline' : 'btn-rose'} style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
          {playing ? '🔇 Band Karo' : '🎵 Bollywood Music Bajao'}
        </button>
        {playing && <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 20, background: 'rgba(26,5,8,0.7)', padding: '4px 8px', borderRadius: 20 }}>
          {[0.3, 0.6, 0.4, 0.8, 0.5, 0.7, 0.45, 0.35, 0.6].map((d, i) => (
            <div key={i} className="wave-bar" style={{ height: 20, animationDelay: `${d}s` }} />
          ))}
        </div>}
      </div>

      {/* ── S1: HEADER ── */}
      <section style={{ background: 'radial-gradient(ellipse at 50% 0%, #3a0e16 0%, #1a0508 80%)', padding: '56px 16px 48px', textAlign: 'center', borderBottom: '1px solid rgba(244,160,176,0.15)' }}>
        <div style={{ fontSize: '2rem', letterSpacing: '6px', marginBottom: 16, opacity: 0.65 }}>🎉 🎈 🌸 🎊 🌻 🎈 🎉</div>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -10, 0] }} transition={{ scale: { type: 'spring', stiffness: 150 }, y: { duration: 3.5, repeat: Infinity } }}>
          <TeddySVG size={165} />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glow-title" style={{ fontFamily: "'Pacifico',cursive", fontSize: 'clamp(2.2rem,8vw,4.5rem)', color: '#c0384a', margin: '16px 0 4px' }}>
          Happy Birthday
        </motion.h1>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.6rem,6vw,3rem)', color: '#fdf6ec', fontStyle: 'italic', margin: '0 0 8px' }}>
          Akshra 🌹 Maahi 🌹 Akshuu
        </motion.h2>
        <p style={{ color: '#9a6070', fontFamily: "'Poppins',sans-serif", marginBottom: 24, fontSize: '0.9rem' }}>From your bestfriend — Abhishek 🧸</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '24px auto 0', maxWidth: 300 }}>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,transparent,rgba(244,160,176,0.4))' }} />
          <span style={{ fontSize: '1.3rem' }}>🌹 🧸 🌹</span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,rgba(244,160,176,0.4),transparent)' }} />
        </div>
      </section>

      {/* ── S2: PARTY SCENE ── */}
      <section style={{ background: '#220810', padding: '48px 16px', borderBottom: '1px solid rgba(244,160,176,0.12)' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          🕺 Party Chal Rahi Hai! 💃
        </motion.h2>
        <p style={{ textAlign: 'center', color: '#9a6070', fontFamily: "'Poppins',sans-serif", marginBottom: 24, fontSize: '0.9rem' }}>
          Disco ball, Dancers, Kids, Guitarist, Cake & Champagne! 🍾🎸🪩
        </p>

        <div className="flex justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
            onClick={triggerChampagneAction}
            className="btn-gold" style={{ fontSize: '0.95rem' }}
          >
            🍾 Pop Champagne Bottle & Foam Spray! 🎉
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <PartyScene />
        </motion.div>
      </section>

      {/* ── S3: BALLOONS ── */}
      <section style={{ background: '#1a0508', padding: '48px 16px', borderBottom: '1px solid rgba(244,160,176,0.12)' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          🎈 Balloons Phodo — Pop Pop Pop!
        </motion.h2>
        <p style={{ textAlign: 'center', color: '#9a6070', fontFamily: "'Poppins',sans-serif", marginBottom: 32, fontSize: '0.9rem' }}>
          Har balloon todne pe asli cracker sound aayega! 🎆
        </p>
        <BalloonSection onAllPopped={() => boom({ particleCount: 300 })} />
      </section>

      {/* ── S4: BOUQUET ── */}
      <section style={{ background: '#220810', padding: '48px 16px', borderBottom: '1px solid rgba(244,160,176,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          🌹 Abhishek Ka Special Bouquet
        </motion.h2>
        <p style={{ textAlign: 'center', color: '#9a6070', fontFamily: "'Poppins',sans-serif", marginBottom: 32, fontSize: '0.9rem' }}>
          Bestfriend ki taraf se — dil se ❤️
        </p>
        <BouquetScene />
      </section>

      {/* ── S5: CHOCOLATE CAKE ── */}
      <section style={{ background: '#1a0508', padding: '48px 16px', borderBottom: '1px solid rgba(244,160,176,0.12)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          🎂 Akshuu Ki Chocolate Birthday Cake
        </motion.h2>
        <p style={{ textAlign: 'center', color: '#9a6070', fontFamily: "'Poppins',sans-serif", marginBottom: 32, fontSize: '0.9rem' }}>
          Candles phunko → Cake kato → Clapping + Birthday song! 🎵👏
        </p>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 130 }}>
          <ChocCake blown={blown} cut={cut} onBlow={handleBlow} onCut={handleCut} />
        </motion.div>
        <AnimatePresence>
          {cut && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ ...CS, marginTop: 32, padding: '28px 36px', maxWidth: 440, textAlign: 'center' }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', color: '#f4a0b0', fontStyle: 'italic', lineHeight: 1.9 }}>
              "Akshuu ki zindagi itni meethi ho,<br />jitni yeh chocolate cake —<br />
              <span style={{ color: '#ffd700', fontWeight: 700 }}>aur usse bhi zyada! 🌹🧸</span>"
            </p>
          </motion.div>}
        </AnimatePresence>
      </section>

      {/* ── S6: LETTER ── */}
      <section style={{ background: '#220810', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid rgba(244,160,176,0.12)' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          💌 Ek Chhoti Si Baat
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ ...CS, borderLeft: '4px solid #c0384a', padding: '36px', maxWidth: 520, width: '100%' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', color: '#fdf6ec', lineHeight: 2.1 }}>
            <p style={{ fontWeight: 700, fontSize: '1.3rem', color: '#f4a0b0', marginBottom: 16 }}>Akshra, Maahi, Akshuu —</p>
            <p style={{ marginBottom: 12, color: '#d4b0b8' }}>Yeh saal shayad aasaan nahi raha. Mushkilein aayi — par tum hamesha strong rahi.</p>
            <p style={{ marginBottom: 12 }}>Tum intelligent ho, caring ho, amazingly talented ho.</p>
            <p style={{ marginBottom: 16, fontWeight: 600, fontSize: '1.2rem', color: '#f4a0b0' }}>Aaj ka din bas tera hai. 🌹</p>
            <p style={{ fontStyle: 'italic', color: '#d4b0b8' }}>Kha lo, muskura lo, enjoy karo! 🧸</p>
            <p style={{ marginTop: 16, fontSize: '0.9rem', color: '#9a6070', fontFamily: "'Poppins',sans-serif" }}>— Abhishek 🌹</p>
          </div>
        </motion.div>
      </section>

      {/* ── S7: DANCING TEDDY ── */}
      <section style={{ background: '#1a0508', padding: '48px 16px', textAlign: 'center', borderBottom: '1px solid rgba(244,160,176,0.12)' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          🧸 Teddy Ka Birthday Dance!
        </motion.h2>
        <p style={{ color: '#9a6070', marginBottom: 32, fontFamily: "'Poppins',sans-serif", fontSize: '0.9rem' }}>Dance floor pe teddy bhi aa gaya! 🕺</p>
        <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200 }} style={{ display: 'inline-block' }}>
          <TeddySVG size={155} dancing={true} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          style={{ ...CS, display: 'inline-block', marginTop: 24, padding: '20px 32px', maxWidth: 360 }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', color: '#f4a0b0', fontStyle: 'italic' }}>
            "Teddy is your number one fan.<br />Aur woh yeh bahut seriously leta hai. 🧸"
          </p>
        </motion.div>
      </section>

      {/* ── S8: SHAYARI ── */}
      <section style={{ background: '#220810', padding: '48px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid rgba(244,160,176,0.12)' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          🌹 Abhishek Ki Taraf Se — Shayari
        </motion.h2>
        <div style={{ maxWidth: 540, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[{ text: "ज़िन्दगी में आये हों जो गम और परेशानियाँ,\nफूलों की तरह महकती रहे तेरी हर कहानियाँ।\nजन्मदिन मुबारक हो अक्षु! ❤️" },
            { text: "आसमान से माँगी हैं दुआएँ तेरे लिए,\nखुशियाँ हमेशा बरसें तेरे दरवाज़े पर।\nजन्मदिन मुबारक! 🌹" },
            { text: "गुलाब जितनी प्यारी है तू,\nचाँद जितनी रोशन है तू।\nआज का दिन बस तेरा है! 🌹🧸" },
            { text: "Abhishek ki taraf se —\nSaari duaaon ke saath,\nHappy Birthday meri bestfriend! 🎂🌹" }
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ ...CS, borderLeft: `4px solid ${i % 2 === 0 ? '#c0384a' : '#ffd700'}`, padding: '24px 28px' }}>
              <p className="hindi" style={{ fontSize: '1.05rem', color: '#fdf6ec', lineHeight: 2.1, whiteSpace: 'pre-line' }}>{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── S9: JOKES IN HINDI ── */}
      <section style={{ background: '#1a0508', padding: '48px 16px', borderBottom: '1px solid rgba(244,160,176,0.12)' }}>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={ST}>
          😂 टेडी के मजेदार चुटकुले (Hindi Jokes)
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, maxWidth: 680, margin: '32px auto 0' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ ...CS, padding: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>😂</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: '#f4a0b0', marginBottom: 20 }}>टेडी का बकवास जोक</h3>
            <AnimatePresence mode="wait">
              <motion.div key={jokeKey} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <p className="hindi" style={{ color: '#fdf6ec', fontSize: '1.1rem', marginBottom: 14, lineHeight: 1.8 }}>{currentJoke.setup}</p>
                <div style={{ width: 40, height: 1, background: 'rgba(244,160,176,0.4)', margin: '0 auto 14px' }} />
                <p className="hindi" style={{ color: '#ffd700', fontSize: '1.15rem', fontWeight: 600 }}>{currentJoke.punchline}</p>
              </motion.div>
            </AnimatePresence>
            <button onClick={nextJoke} className="btn-outline" style={{ marginTop: 20 }}>अगला जोक 😂</button>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} style={{ ...CS, padding: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>💛</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', color: '#f4a0b0', marginBottom: 20 }}>आज की तारीफ (Compliment)</h3>
            <AnimatePresence mode="wait">
              <motion.p key={compIdx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                style={{ color: '#fdf6ec', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.15rem', fontStyle: 'italic', lineHeight: 1.8 }}>
                "{currentCompliment}"
              </motion.p>
            </AnimatePresence>
            <button onClick={nextComp} className="btn-outline" style={{ marginTop: 20 }}>और सुनो 💛</button>
          </motion.div>
        </div>
      </section>

      {/* ── S10: FINALE WITH CHAMPAGNE SPRAY ── */}
      <section style={{ background: '#220810', padding: '64px 16px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,#c0384a,#ffd700,#c0384a,transparent)' }} />
        <div style={{ fontSize: '2.5rem', letterSpacing: '6px', marginBottom: 24, opacity: 0.6 }}>🎉 🎈 🌸 🧸 🌻 🎈 🎉</div>
        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 140 }}>
          <TeddySVG size={130} dancing={true} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="glow-title" style={{ fontFamily: "'Pacifico',cursive", fontSize: 'clamp(2rem,7vw,3.8rem)', color: '#c0384a', margin: '24px 0 16px' }}>
          Happy Birthday, Akshuu! 🌹
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.25rem', color: '#fdf6ec', fontStyle: 'italic', lineHeight: 2, maxWidth: 480, margin: '0 auto 24px' }}>
          "Tum bahut pyari ho, bahut strong ho.<br />Aaj ka din tumhara hai — poora.<br />
          <span style={{ color: '#f4a0b0' }}>Yeh gift sirf tere liye hai — always. 🧸🌹</span>"
        </motion.p>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="hindi"
          style={{ fontSize: '1.15rem', color: '#f4a0b0', lineHeight: 2.2, marginBottom: 32 }}>
          जन्मदिन मुबारक हो, अक्षु। 🌹<br />
          <span style={{ fontSize: '0.95rem', color: '#9a6070' }}>— Abhishek की तरफ से, हमेशा। 🧸</span>
        </motion.p>

        <motion.button initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8, type: 'spring' }}
          whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}
          onClick={triggerChampagneAction}
          className="btn-gold" style={{ fontSize: '1.15rem' }}>
          🍾 Grand Finale — Champagne Foam Spray + Confetti + Taaliyan! 🎉
        </motion.button>

        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,transparent,#c0384a,#ffd700,#c0384a,transparent)' }} />
        <p style={{ marginTop: 40, fontSize: '0.75rem', color: 'rgba(244,160,176,0.35)', fontFamily: "'Poppins',sans-serif" }}>🔒 Koi data collect nahi kiya. Sirf pyaar hai yahan. 🌹</p>
      </section>
    </div>
  )
}
