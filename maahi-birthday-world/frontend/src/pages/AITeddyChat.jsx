import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TeddySVG from '../components/teddy/TeddySVG'

// AI Teddy — local intelligent responses (no API key needed, fully offline)
// Smart pattern matching + witty teddy persona
const teddyResponses = [
  // Greetings
  { patterns: ['hello', 'hi', 'hey', 'namaste', 'hii', 'heyy'],
    responses: ["Well hello there! The teddy was not expecting visitors. Please excuse the fur.", "Hey! You found the teddy chatbox. This is either very good or very suspicious. 🧸", "Hello hello! The teddy is at your service. Mostly."] },
  // How are you
  { patterns: ['how are you', 'kaisa hai', 'kaise ho', 'sup', 'whats up', 'what\'s up'],
    responses: ["Stuffed, thank you for asking. 🧸 And yourself?", "Honestly? Excellent. It's Maahi's birthday. Everything is automatically excellent today.", "I am doing wonderfully. I was napping but this is better."] },
  // Birthday
  { patterns: ['birthday', 'happy birthday', 'janam din', 'bday', 'b-day'],
    responses: ["BIRTHDAY! Yes!! The teddy has been waiting all year for this. 🎂🌷", "Happy Birthday Maahi! 🌷 The teddy says this with maximum sincerity and minimal drama.", "Today is the most important day. The teddy has prepared exactly zero things. But the feelings are real. 🧸"] },
  // Flowers
  { patterns: ['flower', 'phool', 'tulip', 'rose', 'sunflower', 'bouquet'],
    responses: ["🌷 Flowers! The teddy's second favourite thing after napping.", "Flowers are the universe's way of apologising for Mondays. 🌸", "Did someone say flowers? The imaginary delivery is already on its way. 🌷"] },
  // Sing
  { patterns: ['sing', 'song', 'gaana', 'music', 'concert', 'voice', 'guitar'],
    responses: ["Maahi's imaginary concert was a 5-star experience. The teddy gave a standing ovation. (I don't have legs but the sentiment was there.) 🎤", "Music section is upstairs! But between us — her voice needs no concert hall. 🎵", "The teddy attempted the guitar earlier. It went... fine. 🎸 Not everyone agreed."] },
  // Joke
  { patterns: ['joke', 'funny', 'haha', 'lol', 'mazak', 'hasao'],
    responses: ["Why did the teddy go to school? To get a little more 'bear'-ucation. 🧸😂", "What do you call a sleeping teddy? A nap-bear. (The Bad Joke Factory is hiring, apparently.) 😂", "Knock knock. Who's there? A very small, very sincere, very stuffed birthday wish. 🌷"] },
  // Coffee
  { patterns: ['coffee', 'chai', 'tea', 'kaphi'],
    responses: ["Birthday coffee detected. Productivity: cancelled. Joy: authorised. ☕", "The teddy deeply respects coffee. It keeps humans functional which keeps the teddy company. ☕", "Chai pe charcha, as they say. The teddy approves of this plan. 🍵"] },
  // Sad / feeling low
  { patterns: ['sad', 'udaas', 'dukhi', 'depressed', 'bura', 'not good', 'bad day', 'crying'],
    responses: ["Hey. That's okay. The teddy is here and not going anywhere. Bad days are allowed to exist. But today is your birthday — give yourself a few minutes of just being okay. 🌷", "The teddy would like to offer one imaginary hug. No pressure. Just here. 🧸", "Some days are harder than others. Today might still be one of them and that's valid. But you made it here and that counts for something. 🌷"] },
  // Thank you
  { patterns: ['thank you', 'thanks', 'shukriya', 'dhanyawad', 'ty', 'tysm'],
    responses: ["You're very welcome. The teddy is blushing. (Teddies can blush, it's canon.) 🧸", "No thanks needed! But the teddy accepts them gracefully anyway. 🌷", "Aww! The teddy is genuinely delighted. This is the best birthday, clearly."] },
  // Akshra / Maahi
  { patterns: ['akshra', 'maahi', 'akshuu', 'she is', 'she\'s'],
    responses: ["Ah yes. Maahi. The whole reason this website exists. The teddy approves of her, unconditionally. 🧸", "Akshra! The one and only. The teddy was briefed. The report is: excellent human, maximum approval. 👑", "The teddy has known about Maahi for approximately forever. Or since this website loaded. Same energy. 🌷"] },
  // Teddy
  { patterns: ['teddy', 'bear', 'bhalu', 'stuffed'],
    responses: ["That's me!! 🧸 Hello. I am extremely important and I take this role very seriously.", "The teddy is present, accounted for, and mildly flattered by your interest. 🧸", "Did you come here just to compliment the teddy? Because that is a valid reason to visit."] },
  // What are you / who are you
  { patterns: ['who are you', 'what are you', 'tum kaun', 'kya ho tum'],
    responses: ["I am the official teddy of this birthday website. Chief Teddy Officer, International Teddy Committee. 🧸📋", "Excellent question. I am a very important bear with very strong opinions about birthday celebrations. 🌷", "I'm the teddy! Small, stuffed, and full of birthday enthusiasm. Pleased to meet you officially."] },
  // Default fallback (rotates)
  { patterns: [],
    responses: [
      "Hmm. The teddy is thinking... 🧸 (This is unusual for the teddy.)",
      "Interesting. The teddy doesn't fully understand but is nodding supportively. 🌷",
      "The teddy has received your message and is processing it with great seriousness. 🧸",
      "That's... a lot. The teddy would like a moment. And possibly a snack.",
      "You know what? Valid. The teddy agrees with whatever that was. 🌷",
    ]}
]

function getResponse(input) {
  const lower = input.toLowerCase().trim()
  for (const entry of teddyResponses.slice(0, -1)) {
    if (entry.patterns.some(p => lower.includes(p))) {
      return entry.responses[Math.floor(Math.random() * entry.responses.length)]
    }
  }
  // Fallback
  const fallbacks = teddyResponses[teddyResponses.length - 1].responses
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

export default function AITeddyChat() {
  const [messages, setMessages] = useState([
    { from: 'teddy', text: "Hello! 🧸 I'm the Birthday Teddy. You can talk to me — I promise I'm mostly helpful." }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  const sendMessage = (e) => {
    e?.preventDefault()
    if (!input.trim()) return

    const userMsg = { from: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const reply = getResponse(userMsg.text)
      setMessages(prev => [...prev, { from: 'teddy', text: reply }])
      setIsTyping(false)
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }, 900 + Math.random() * 600)
  }

  const quickReplies = ['Happy Birthday! 🌷', 'Tell me a joke 😂', 'How are you, teddy?', 'Sing something! 🎤']

  return (
    <section
      id="ai-teddy-chat"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fffef9 100%)' }}
    >
      <div className="max-w-lg mx-auto">

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
            Chat with the Teddy 🧸
          </h2>
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem', color: '#8b5e3c' }}>
            The teddy is surprisingly talkative today.
          </p>
        </motion.div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1.5px solid #ecd4a0',
            boxShadow: '0 8px 40px rgba(139,94,60,0.12)',
          }}
        >
          {/* Chat header */}
          <div
            className="flex items-center gap-3 p-4"
            style={{ background: 'linear-gradient(90deg, #4a2c0a, #6b4226)', borderBottom: '1px solid #8b5e3c' }}
          >
            <TeddySVG size={40} animated={false} expression="happy" />
            <div>
              <p className="text-sm font-semibold text-[#faf0dc]"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                The Birthday Teddy
              </p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-[#c4956a]" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Online & ready to chat
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="p-4 space-y-3 overflow-y-auto"
            style={{ background: '#fdf8f0', minHeight: 280, maxHeight: 340 }}
          >
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
              >
                {msg.from === 'teddy' && (
                  <span className="text-xl shrink-0">🧸</span>
                )}
                <div
                  className="max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                  style={{
                    background: msg.from === 'user' ? '#8b5e3c' : '#fffef9',
                    color: msg.from === 'user' ? '#fffef9' : '#4a2c0a',
                    border: msg.from === 'teddy' ? '1px solid #f5e4c0' : 'none',
                    fontFamily: msg.from === 'teddy' ? "'Dancing Script', cursive" : "'Inter', sans-serif",
                    fontSize: msg.from === 'teddy' ? '1rem' : '0.875rem',
                    borderRadius: msg.from === 'user'
                      ? '1.25rem 1.25rem 0.25rem 1.25rem'
                      : '0.25rem 1.25rem 1.25rem 1.25rem',
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xl">🧸</span>
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{ background: '#fffef9', border: '1px solid #f5e4c0', borderRadius: '0.25rem 1.25rem 1.25rem 1.25rem' }}
                  >
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4].map((d, i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, delay: d, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-[#c4956a]"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          <div
            className="px-4 pt-3 pb-2 flex flex-wrap gap-2"
            style={{ background: '#fdf8f0', borderTop: '1px solid #f5e4c0' }}
          >
            {quickReplies.map(q => (
              <button
                key={q}
                onClick={() => { setInput(q); setTimeout(() => document.getElementById('teddy-chat-input')?.focus(), 50) }}
                className="px-3 py-1.5 rounded-full text-xs border border-[#ecd4a0] bg-[#faf0dc] text-[#4a2c0a] hover:bg-[#f5e4c0] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex gap-2 p-4"
            style={{ background: '#fffef9', borderTop: '1px solid #f5e4c0' }}
          >
            <input
              id="teddy-chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Say something to the teddy..."
              className="flex-1 rounded-full px-4 py-2.5 text-sm focus:outline-none"
              style={{
                background: '#faf0dc',
                border: '1px solid #ecd4a0',
                color: '#4a2c0a',
                fontFamily: "'Inter', sans-serif",
              }}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all disabled:opacity-40"
              style={{ background: '#8b5e3c' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8 L14 2 L10 8 L14 14 Z" fill="#fffef9" />
              </svg>
            </button>
          </form>
        </motion.div>

        <p
          className="text-center text-xs text-[#c4956a] mt-4"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          🔒 Everything stays here. Nothing is sent or stored anywhere.
        </p>
      </div>
    </section>
  )
}
