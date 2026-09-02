import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeddySVG from '../components/teddy/TeddySVG'
import Modal from '../components/ui/Modal'

const objects = [
  {
    id: 'teddy',
    emoji: '🧸',
    label: 'The Teddy',
    x: '50%', y: '55%',
    transform: 'translate(-50%, -50%)',
    big: true,
    title: 'The Teddy 🧸',
    message: "I was told to behave today.\n\nI have already failed.\n\n(Apologies. I regret nothing.)",
  },
  {
    id: 'flower',
    emoji: '🌷',
    label: 'Flower Vase',
    x: '18%', y: '50%',
    transform: 'translate(-50%, -50%)',
    title: 'A Flower Delivery 🌷',
    message: "A flower delivery for Maahi! 🌷\n\nUnfortunately, the delivery person is imaginary.\n\nThe flowers, however, are very real in spirit.",
  },
  {
    id: 'gift',
    emoji: '🎁',
    label: 'Gift Box',
    x: '80%', y: '52%',
    transform: 'translate(-50%, -50%)',
    title: 'The Gift Box 🎁',
    message: "This contains absolutely nothing.\n\nBecause apparently someone forgot to put the gift inside.\n\n(The teddy has been notified. He is equally disappointed.)",
  },
  {
    id: 'cup',
    emoji: '☕',
    label: 'Birthday Coffee',
    x: '20%', y: '78%',
    transform: 'translate(-50%, -50%)',
    title: 'Birthday Coffee ☕',
    message: "Birthday coffee detected.\n\nProductivity has been officially cancelled.\n\nPlease proceed with rest and cake.",
  },
  {
    id: 'photo',
    emoji: '🖼️',
    label: 'Photo Frame',
    x: '78%', y: '25%',
    transform: 'translate(-50%, -50%)',
    title: 'Photo Frame 🖼️',
    message: "The frame is currently empty.\n\nPossibly because the photographer was also imaginary.\n\nThe teddy promises to pose when ready.",
  },
  {
    id: 'cake',
    emoji: '🎂',
    label: 'Birthday Cake',
    x: '50%', y: '82%',
    transform: 'translate(-50%, -50%)',
    title: 'The Birthday Cake 🎂',
    message: "One birthday cake.\n\nNo candles were harmed in the making of this website.\n\n(The teddy already ate a piece. He is not sorry.)",
  },
]

export default function TeddyRoom() {
  const [activeModal, setActiveModal] = useState(null)
  const active = objects.find(o => o.id === activeModal)

  return (
    <section
      id="teddy-room"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #fdf8f0 0%, #faf0dc 100%)' }}
    >
      <div className="max-w-3xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            The Teddy Room 🧸
          </h2>
          <p className="text-[#8b5e3c] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Click on things to discover their secrets...
          </p>
        </motion.div>

        {/* Room */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            height: 420,
            background: 'linear-gradient(180deg, #f0e4d0 0%, #e8d4b8 60%, #d4b890 100%)',
            boxShadow: 'inset 0 -10px 30px rgba(74,44,10,0.15), 0 8px 40px rgba(139,94,60,0.2)',
            border: '2px solid #ecd4a0',
          }}
        >
          {/* Wall */}
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: '65%',
              background: 'linear-gradient(180deg, #faf0dc 0%, #f5e4c0 100%)',
              borderBottom: '3px solid #d4b890',
            }}
          />

          {/* Floor */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '35%',
              background: 'repeating-linear-gradient(90deg, #d4b890 0px, #d4b890 59px, #c4a880 60px)',
              opacity: 0.8,
            }}
          />

          {/* Window on wall */}
          <div
            className="absolute top-4 left-1/2 -translate-x-1/2 rounded-xl overflow-hidden"
            style={{
              width: 100, height: 80,
              background: 'linear-gradient(135deg, #c8e8f8, #e8f4fc)',
              border: '3px solid #d4b890',
            }}
          >
            {/* Window cross */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-[#d4b890] opacity-70" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-[#d4b890] opacity-70" />
            </div>
            {/* Sun */}
            <div className="absolute top-2 right-3 text-lg">☀️</div>
          </div>

          {/* Clickable objects */}
          {objects.map((obj) => (
            <motion.button
              key={obj.id}
              onClick={() => setActiveModal(obj.id)}
              whileHover={{ scale: 1.15, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
              className="absolute flex flex-col items-center gap-0.5 cursor-pointer focus:outline-none"
              style={{
                left: obj.x,
                top: obj.y,
                transform: obj.transform,
                fontSize: obj.big ? '5rem' : '2.5rem',
              }}
              aria-label={`Click to learn about: ${obj.label}`}
            >
              {obj.id === 'teddy' ? (
                <TeddySVG size={140} animated={true} expression="happy" />
              ) : (
                <span role="img" aria-label={obj.label}>{obj.emoji}</span>
              )}
              <span
                className="text-[10px] text-[#8b5e3c] bg-[#fffef9]/70 px-2 py-0.5 rounded-full"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {obj.label}
              </span>
            </motion.button>
          ))}

          {/* Hint */}
          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-[#8b5e3c] bg-[#fffef9]/60 px-3 py-1 rounded-full"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            👆 Tap anything!
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!activeModal} onClose={() => setActiveModal(null)} title={active?.title}>
        <div className="whitespace-pre-line text-base leading-relaxed">
          {active?.message}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setActiveModal(null)}
            className="text-sm text-[#c4956a] hover:text-[#8b5e3c] transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Got it 🧸
          </button>
        </div>
      </Modal>
    </section>
  )
}
