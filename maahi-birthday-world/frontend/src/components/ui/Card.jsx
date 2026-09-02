import { motion } from 'framer-motion'

export default function Card({ children, className = '', onClick, hoverable = false, paper = false }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverable ? { scale: 1.02, y: -4 } : {}}
      className={`
        bg-[#fffef9] border border-[#f5e4c0] rounded-2xl shadow-[0_4px_24px_rgba(139,94,60,0.10)]
        ${hoverable ? 'cursor-pointer hover:shadow-[0_8px_40px_rgba(139,94,60,0.18)] transition-shadow duration-300' : ''}
        ${paper ? 'paper-texture' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
