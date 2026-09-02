/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory:  '#fdf6ec',
        cream:  '#fff8f0',
        rose:   { light: '#ffe4e8', mid: '#f4a0b0', deep: '#c0384a', dark: '#8b1a2a' },
        gold:   { light: '#f5deb3', mid: '#d4a574', dark: '#a07040' },
        brown:  { soft: '#8b5e3c', deep: '#4a2c0a' },
        blush:  '#fce4ec',
      },
      fontFamily: {
        display:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
        fun:      ['"Pacifico"', 'cursive'],
        body:     ['"Poppins"', 'system-ui', 'sans-serif'],
        hindi:    ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      animation: {
        'rose-fall':   'roseFall 12s linear infinite',
        'candle':      'candleFlicker 0.8s ease-in-out infinite',
        'dance':       'teddyDance 0.6s ease-in-out infinite alternate',
        'float':       'floatUp 4s ease-in-out infinite',
        'pulse-soft':  'pulseSoft 2s ease-in-out infinite',
        'cake-bounce': 'cakeBounce 0.5s cubic-bezier(.36,.07,.19,.97)',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        roseFall: {
          '0%':   { transform: 'translateY(-60px) rotate(0deg) translateX(0)',  opacity: '0' },
          '5%':   { opacity: '0.8' },
          '95%':  { opacity: '0.6' },
          '100%': { transform: 'translateY(110vh) rotate(540deg) translateX(40px)', opacity: '0' },
        },
        candleFlicker: {
          '0%,100%': { transform: 'scaleY(1) translateX(0)',   opacity: '1' },
          '50%':     { transform: 'scaleY(1.2) translateX(1px)', opacity: '0.85' },
        },
        teddyDance: {
          '0%':   { transform: 'rotate(-8deg) translateY(0)' },
          '100%': { transform: 'rotate(8deg) translateY(-8px)' },
        },
        floatUp: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        pulseSoft: {
          '0%,100%': { boxShadow: '0 0 20px rgba(192,56,74,0.2)' },
          '50%':     { boxShadow: '0 0 40px rgba(192,56,74,0.4)' },
        },
        cakeBounce: {
          '0%,100%': { transform: 'scale(1)' },
          '30%':     { transform: 'scale(1.1)' },
          '60%':     { transform: 'scale(0.95)' },
        },
      },
    },
  },
  plugins: [],
}
