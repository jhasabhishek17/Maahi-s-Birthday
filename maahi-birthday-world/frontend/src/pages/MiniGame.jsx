import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'

const GAME_W = 560
const GAME_H = 380
const CATCHER_W = 80
const ITEM_SIZE = 36
const GAME_DURATION = 30

const itemTypes = [
  { emoji: '🌷', points: 1, speed: 2.5 },
  { emoji: '🌸', points: 1, speed: 3 },
  { emoji: '🌻', points: 1, speed: 2 },
  { emoji: '🎂', points: 3, speed: 1.5 },
  { emoji: '📜', points: 0, speed: 2, dodge: true },
]

function getResult(score) {
  if (score <= 10)  return { msg: "The teddy is proud anyway. 🧸", sub: "Some things matter more than catching flowers. Like cake." }
  if (score <= 30)  return { msg: "Okayyy, someone is competitive. 👀", sub: "The flowers are impressed. Mostly." }
  if (score <= 50)  return { msg: "THE TEDDY HAS OFFICIALLY LOST. 🏆", sub: "This is embarrassing. The teddy expected to win." }
  return { msg: "ARE YOU EVEN HUMAN? 🌷✨", sub: "The birthday machine requests a rematch." }
}

export default function MiniGame() {
  const [gameState, setGameState] = useState('idle') // idle | playing | over
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [items, setItems] = useState([])
  const [catcherX, setCatcherX] = useState(GAME_W / 2 - CATCHER_W / 2)
  const [pops, setPops] = useState([])
  const gameAreaRef = useRef(null)
  const frameRef = useRef(null)
  const itemsRef = useRef([])
  const catcherRef = useRef(GAME_W / 2 - CATCHER_W / 2)
  const scoreRef = useRef(0)
  const nextIdRef = useRef(0)
  const spawnTimerRef = useRef(null)
  const timerRef = useRef(null)

  const addPop = useCallback((x, y, emoji) => {
    const id = Date.now() + Math.random()
    setPops(p => [...p, { id, x, y, emoji }])
    setTimeout(() => setPops(p => p.filter(pop => pop.id !== id)), 700)
  }, [])

  const gameLoop = useCallback(() => {
    if (!gameAreaRef.current) return
    itemsRef.current = itemsRef.current
      .map(item => ({ ...item, y: item.y + item.speed }))
      .filter(item => {
        // Collision check
        const cx = catcherRef.current
        const inX = item.x > cx - 10 && item.x < cx + CATCHER_W + 10
        const inY = item.y > GAME_H - 70 && item.y < GAME_H - 20
        if (inX && inY && !item.caught) {
          if (!item.dodge) {
            scoreRef.current += item.points
            setScore(scoreRef.current)
            addPop(item.x, GAME_H - 60, item.emoji)
          }
          return false
        }
        return item.y < GAME_H + 40
      })
    setItems([...itemsRef.current])
    frameRef.current = requestAnimationFrame(gameLoop)
  }, [addPop])

  const spawnItem = useCallback(() => {
    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)]
    const item = {
      id: nextIdRef.current++,
      x: Math.random() * (GAME_W - ITEM_SIZE),
      y: -ITEM_SIZE,
      emoji: type.emoji,
      points: type.points,
      speed: type.speed + Math.random(),
      dodge: type.dodge || false,
    }
    itemsRef.current = [...itemsRef.current, item]
  }, [])

  const startGame = useCallback(() => {
    setGameState('playing')
    setScore(0)
    setTimeLeft(GAME_DURATION)
    scoreRef.current = 0
    itemsRef.current = []
    setItems([])
    setPops([])
    setCatcherX(GAME_W / 2 - CATCHER_W / 2)
    catcherRef.current = GAME_W / 2 - CATCHER_W / 2

    frameRef.current = requestAnimationFrame(gameLoop)

    spawnTimerRef.current = setInterval(spawnItem, 1100)

    let t = GAME_DURATION
    timerRef.current = setInterval(() => {
      t -= 1
      setTimeLeft(t)
      if (t <= 0) {
        clearInterval(timerRef.current)
        clearInterval(spawnTimerRef.current)
        cancelAnimationFrame(frameRef.current)
        setGameState('over')
      }
    }, 1000)
  }, [gameLoop, spawnItem])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current)
      clearInterval(spawnTimerRef.current)
      clearInterval(timerRef.current)
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (gameState !== 'playing') return
    const rect = gameAreaRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - CATCHER_W / 2
    const clamped = Math.max(0, Math.min(GAME_W - CATCHER_W, x))
    catcherRef.current = clamped
    setCatcherX(clamped)
  }, [gameState])

  const handleTouchMove = useCallback((e) => {
    if (gameState !== 'playing') return
    e.preventDefault()
    const rect = gameAreaRef.current?.getBoundingClientRect()
    if (!rect) return
    const touch = e.touches[0]
    const x = touch.clientX - rect.left - CATCHER_W / 2
    const clamped = Math.max(0, Math.min(GAME_W - CATCHER_W, x))
    catcherRef.current = clamped
    setCatcherX(clamped)
  }, [gameState])

  const result = getResult(score)

  return (
    <section
      id="mini-game"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fdf8f0 100%)' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2
            className="text-4xl md:text-5xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Maahi vs The Birthday Machine 🎮
          </h2>
          <p className="text-[#8b5e3c] text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            🧸 The teddy asks: "Can Maahi defeat the Birthday Machine?"
          </p>
        </motion.div>

        {/* Instructions */}
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6 text-sm text-[#6b4226]"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <p>Move your mouse or finger to catch falling flowers!</p>
            <p className="mt-1 opacity-70">🌷 = 1pt &nbsp;|&nbsp; 🎂 = 3pts &nbsp;|&nbsp; 📜 = boring responsibility (dodge!)</p>
          </motion.div>
        )}

        {/* Game area */}
        <div
          ref={gameAreaRef}
          className="game-area select-none mb-6 mx-auto"
          style={{
            width: '100%',
            maxWidth: GAME_W,
            height: GAME_H,
            position: 'relative',
          }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Timer & Score HUD */}
          {gameState === 'playing' && (
            <>
              <div
                className="absolute top-3 left-3 text-sm font-medium text-[#4a2c0a] bg-[#fffef9]/80 px-3 py-1 rounded-full"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ⏱ {timeLeft}s
              </div>
              <div
                className="absolute top-3 right-3 text-sm font-medium text-[#4a2c0a] bg-[#fffef9]/80 px-3 py-1 rounded-full"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Score: {score}
              </div>
            </>
          )}

          {/* Falling items */}
          {items.map(item => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                left: item.x,
                top: item.y,
                fontSize: 28,
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {item.emoji}
            </div>
          ))}

          {/* Pop effects */}
          {pops.map(pop => (
            <motion.div
              key={pop.id}
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{ opacity: 0, scale: 1.5, y: -30 }}
              style={{
                position: 'absolute',
                left: pop.x,
                top: pop.y,
                fontSize: 22,
                pointerEvents: 'none',
              }}
            >
              {pop.emoji}
            </motion.div>
          ))}

          {/* Catcher */}
          {gameState === 'playing' && (
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: catcherX,
                width: CATCHER_W,
                fontSize: 32,
                textAlign: 'center',
                lineHeight: 1,
                transition: 'left 0.02s',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              🧺
            </div>
          )}

          {/* Start overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl mb-4">🎮</p>
              <Button onClick={startGame} variant="primary" size="lg">
                Start Game →
              </Button>
            </div>
          )}

          {/* Game Over overlay */}
          <AnimatePresence>
            {gameState === 'over' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                style={{ background: 'rgba(253,248,240,0.95)' }}
              >
                <p className="text-4xl mb-3">🎉</p>
                <p
                  className="text-2xl font-bold text-[#4a2c0a] mb-2 text-center px-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {result.msg}
                </p>
                <p
                  className="text-sm text-[#8b5e3c] mb-2 text-center px-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {result.sub}
                </p>
                <p
                  className="text-xl font-bold text-[#c4956a] mb-6"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Final Score: {score}
                </p>
                <Button onClick={startGame} variant="secondary">
                  Play Again 🌷
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
