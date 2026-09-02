import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'

const flowerOptions = [
  { id: 'tulip',    emoji: '🌷', name: 'Tulips'       },
  { id: 'rose',     emoji: '🌹', name: 'Roses'        },
  { id: 'sunflower',emoji: '🌻', name: 'Sunflowers'   },
  { id: 'cherry',   emoji: '🌸', name: 'Cherry Blossom'},
  { id: 'daisy',    emoji: '🌼', name: 'Daisies'      },
]

const ribbonColors = [
  { id: 'rose',   color: '#e8b4b8', name: 'Muted Rose'  },
  { id: 'beige',  color: '#ecd4a0', name: 'Warm Beige'  },
  { id: 'sage',   color: '#b8d4a8', name: 'Sage Green'  },
  { id: 'cream',  color: '#fffef9', name: 'Cream White' },
  { id: 'brown',  color: '#c4956a', name: 'Warm Brown'  },
]

const STORAGE_KEY = 'maahi_bouquet'

function BouquetPreview({ flowers, ribbon, note }) {
  const hasFlowers = flowers.length > 0
  const ribbonColor = ribbonColors.find(r => r.id === ribbon)?.color || '#e8b4b8'

  return (
    <div className="bouquet-preview p-6 text-center">
      {!hasFlowers ? (
        <p className="text-[#c4956a] text-sm" style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1rem' }}>
          Choose flowers to see your bouquet... 🌷
        </p>
      ) : (
        <div>
          {/* Flower arrangement */}
          <div className="flex flex-wrap justify-center gap-1 mb-4 text-4xl">
            {flowers.flatMap(fId => {
              const f = flowerOptions.find(o => o.id === fId)
              return f ? [f.emoji, f.emoji, f.emoji] : []
            }).slice(0, 12).map((e, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: (i % 3 - 1) * 8 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 15 }}
                style={{ display: 'inline-block' }}
              >
                {e}
              </motion.span>
            ))}
          </div>

          {/* Ribbon */}
          <div className="flex justify-center mb-3">
            <div
              className="px-8 py-1 rounded-full text-xs font-medium text-[#4a2c0a]"
              style={{
                background: ribbonColor,
                border: `1px solid ${ribbonColor}`,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              🎀 {ribbonColors.find(r => r.id === ribbon)?.name || 'Ribbon'}
            </div>
          </div>

          {/* Note */}
          {note && (
            <p
              className="text-sm text-[#6b4226] italic mt-2"
              style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1rem' }}
            >
              "{note}"
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default function DigitalBouquet() {
  const [selectedFlowers, setSelectedFlowers] = useState([])
  const [selectedRibbon, setSelectedRibbon] = useState('rose')
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [savedBouquet, setSavedBouquet] = useState(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (stored) setSavedBouquet(stored)
    } catch {}
  }, [])

  const toggleFlower = (id) => {
    setSelectedFlowers(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
    setSaved(false)
  }

  const handleSave = () => {
    const bouquet = {
      flowers: selectedFlowers,
      ribbon: selectedRibbon,
      note,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bouquet))
    setSavedBouquet(bouquet)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const restoreSaved = () => {
    if (!savedBouquet) return
    setSelectedFlowers(savedBouquet.flowers || [])
    setSelectedRibbon(savedBouquet.ribbon || 'rose')
    setNote(savedBouquet.note || '')
  }

  return (
    <section
      id="digital-bouquet"
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
            className="text-4xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Build Your Bouquet 💐
          </h2>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', color: '#8b5e3c' }}>
            Create your perfect digital bouquet. Saved just for you.
          </p>
        </motion.div>

        {/* Saved bouquet restore */}
        {savedBouquet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 rounded-xl p-3 flex items-center justify-between"
            style={{ background: '#faf0dc', border: '1px solid #ecd4a0' }}
          >
            <p className="text-sm text-[#6b4226]" style={{ fontFamily: "'Inter', sans-serif" }}>
              💛 You have a saved bouquet!
            </p>
            <button
              onClick={restoreSaved}
              className="text-xs text-[#8b5e3c] underline"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Restore it
            </button>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-6">

            {/* Step 1: Flowers */}
            <div>
              <p className="text-sm font-semibold text-[#4a2c0a] mb-3 uppercase tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                1 · Choose flowers
              </p>
              <div className="flex flex-wrap gap-2">
                {flowerOptions.map(f => (
                  <button
                    key={f.id}
                    onClick={() => toggleFlower(f.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all"
                    style={{
                      background: selectedFlowers.includes(f.id) ? '#8b5e3c' : '#faf0dc',
                      color: selectedFlowers.includes(f.id) ? '#fffef9' : '#4a2c0a',
                      border: `1px solid ${selectedFlowers.includes(f.id) ? '#8b5e3c' : '#ecd4a0'}`,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {f.emoji} {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Ribbon */}
            <div>
              <p className="text-sm font-semibold text-[#4a2c0a] mb-3 uppercase tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                2 · Choose ribbon
              </p>
              <div className="flex gap-3">
                {ribbonColors.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRibbon(r.id)}
                    title={r.name}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{
                      background: r.color,
                      border: selectedRibbon === r.id
                        ? '3px solid #4a2c0a'
                        : '2px solid #ecd4a0',
                      transform: selectedRibbon === r.id ? 'scale(1.2)' : 'scale(1)',
                    }}
                    aria-label={r.name}
                  />
                ))}
              </div>
            </div>

            {/* Step 3: Note */}
            <div>
              <p className="text-sm font-semibold text-[#4a2c0a] mb-3 uppercase tracking-wider"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                3 · Add a note (optional)
              </p>
              <div className="relative">
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value.slice(0, 100))}
                  placeholder="A tiny note for your bouquet..."
                  rows={3}
                  className="w-full rounded-xl p-3 text-sm resize-none focus:outline-none"
                  style={{
                    background: '#fffef9',
                    border: '1px solid #ecd4a0',
                    color: '#4a2c0a',
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: '1rem',
                  }}
                />
                <span
                  className="absolute bottom-2 right-3 text-xs text-[#c4956a]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {note.length}/100
                </span>
              </div>
            </div>

            {/* Save */}
            <Button
              onClick={handleSave}
              variant="primary"
              disabled={selectedFlowers.length === 0}
            >
              {saved ? '✅ Saved!' : 'Save My Bouquet 💾'}
            </Button>

            <AnimatePresence>
              {saved && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-[#8b5e3c] italic"
                  style={{ fontFamily: "'Dancing Script', cursive", fontSize: '0.95rem' }}
                >
                  Bouquet saved! 🌷 It'll be here whenever you want to see it.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Preview */}
          <div>
            <p className="text-sm font-semibold text-[#4a2c0a] mb-3 uppercase tracking-wider"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              Live preview
            </p>
            <BouquetPreview
              flowers={selectedFlowers}
              ribbon={selectedRibbon}
              note={note}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
