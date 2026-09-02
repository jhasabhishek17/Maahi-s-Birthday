import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { jokes } from '../data/jokes'
import Button from '../components/ui/Button'

export default function JokeFactory() {
  const [jokeIndex, setJokeIndex] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [key, setKey] = useState(0)

  const nextJoke = useCallback(() => {
    setJokeIndex(i => (i + 1) % jokes.length)
    setFeedback(null)
    setKey(k => k + 1)
  }, [])

  const giveFeedback = (type) => {
    const responses = {
      funny: "The joke thanks you for your support. It will now retire undefeated. 🎉",
      terrible: "Thank you for your honest feedback. I will now pretend I didn't see that. 🧸",
    }
    setFeedback(responses[type])
  }

  const joke = jokes[jokeIndex]

  return (
    <section
      id="joke-factory"
      className="py-20 px-4"
      style={{ background: '#fffef9' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            The Bad Joke Factory 😂
          </h2>
          <p className="text-[#8b5e3c] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            Generating terrible jokes since forever.
          </p>
        </motion.div>

        {/* Joke counter */}
        <p
          className="text-center text-xs text-[#c4956a] mb-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Joke #{jokeIndex + 1} of {jokes.length}
        </p>

        {/* Joke card */}
        <div
          className="rounded-3xl p-8 mb-8 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #faf0dc 0%, #fdf8f0 100%)',
            border: '2px solid #ecd4a0',
            boxShadow: '0 8px 32px rgba(139,94,60,0.12)',
            minHeight: 200,
          }}
        >
          {/* Decorative */}
          <div className="absolute top-3 left-4 text-2xl opacity-20">😂</div>
          <div className="absolute bottom-3 right-4 text-2xl opacity-20">🧸</div>

          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center justify-center gap-6"
            >
              {/* Setup */}
              <p
                className="text-xl text-[#4a2c0a] leading-relaxed"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {joke.setup}
              </p>

              {/* Divider */}
              <div className="w-16 h-px bg-[#ecd4a0]" />

              {/* Punchline */}
              <p
                className="text-2xl text-[#8b5e3c] font-bold leading-relaxed"
                style={{ fontFamily: "'Dancing Script', cursive" }}
              >
                {joke.punchline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Generate button */}
        <div className="flex justify-center mb-8">
          <Button onClick={nextJoke} variant="primary" size="lg">
            Generate another terrible joke 😂
          </Button>
        </div>

        {/* Feedback */}
        <div className="text-center">
          <p
            className="text-sm text-[#6b4226] mb-3"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            That joke was...
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => giveFeedback('funny')}
              className="px-5 py-2.5 rounded-full text-sm border border-[#ecd4a0] bg-[#faf0dc] text-[#4a2c0a] hover:bg-[#f5e4c0] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              😂 Actually funny
            </button>
            <button
              onClick={() => giveFeedback('terrible')}
              className="px-5 py-2.5 rounded-full text-sm border border-[#ecd4a0] bg-[#fffef9] text-[#6b4226] hover:bg-[#faf0dc] transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              😑 Terrible. Obviously.
            </button>
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-sm text-[#8b5e3c] italic"
                style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem' }}
              >
                {feedback}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
