import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeddySVG from '../components/teddy/TeddySVG'

const steps = [
  { text: 'Finding flowers...', emoji: '🌷' },
  { text: "Checking teddy's outfit...", emoji: '🧸' },
  { text: 'Collecting terrible jokes...', emoji: '😂' },
  { text: 'Preparing birthday magic...', emoji: '✨' },
  { text: 'Almost ready...', emoji: '🌸' },
]

const finalMsg = { text: "Okay. She's here. Hide everything.", emoji: '😂' }

export default function LoadingScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showFinal, setShowFinal] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    if (currentStep < steps.length) {
      const t = setTimeout(() => setCurrentStep(s => s + 1), 900)
      return () => clearTimeout(t)
    } else {
      const t1 = setTimeout(() => setShowFinal(true), 300)
      const t2 = setTimeout(() => {
        setFadeOut(true)
        setTimeout(onComplete, 600)
      }, 2000)
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
  }, [currentStep, onComplete])

  const handleSkip = () => {
    setFadeOut(true)
    setTimeout(onComplete, 400)
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #fdf8f0 0%, #faf0dc 50%, #fdf8f0 100%)' }}
    >
      {/* Teddy */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="mb-8"
      >
        <TeddySVG size={140} animated={true} expression="happy" />
      </motion.div>

      {/* Loading messages */}
      <div className="h-16 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!showFinal ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-3"
            >
              {currentStep < steps.length ? (
                <>
                  <span className="text-3xl">{steps[currentStep]?.emoji}</span>
                  <span
                    className="text-lg text-[#6b4226]"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {steps[currentStep]?.text}
                  </span>
                </>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <div className="text-4xl mb-2">{finalMsg.emoji}</div>
              <p
                className="text-xl font-semibold text-[#4a2c0a]"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {finalMsg.text}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mt-8">
        {steps.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              background: i < currentStep ? '#8b5e3c' : '#ecd4a0',
              scale: i === currentStep - 1 ? 1.3 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="w-2 h-2 rounded-full"
          />
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-sm text-[#c4956a] hover:text-[#8b5e3c] transition-colors underline"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        Skip →
      </button>
    </motion.div>
  )
}
