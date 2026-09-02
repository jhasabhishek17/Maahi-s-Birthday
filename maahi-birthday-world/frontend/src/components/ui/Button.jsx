import { motion } from 'framer-motion'

/**
 * Reusable Button component
 * variant: 'primary' | 'secondary' | 'ghost'
 * size: 'sm' | 'md' | 'lg'
 */
export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
}) {
  const base = `
    inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium
    transition-all duration-200 focus:outline-none focus-visible:ring-2
    focus-visible:ring-offset-2 cursor-pointer select-none
  `

  const variants = {
    primary: `
      bg-[#8b5e3c] text-[#fffef9] hover:bg-[#6b4226]
      shadow-[0_4px_20px_rgba(139,94,60,0.35)]
      hover:shadow-[0_6px_28px_rgba(139,94,60,0.45)]
      focus-visible:ring-[#8b5e3c]
      disabled:bg-[#c4956a] disabled:shadow-none
    `,
    secondary: `
      bg-[#faf0dc] text-[#4a2c0a] border border-[#ecd4a0]
      hover:bg-[#f5e4c0] hover:border-[#c4956a]
      focus-visible:ring-[#c4956a]
      disabled:opacity-50
    `,
    ghost: `
      bg-transparent text-[#6b4226] hover:bg-[#faf0dc]
      focus-visible:ring-[#c4956a]
      disabled:opacity-50
    `,
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </motion.button>
  )
}
