/* Floating petal background — fixed, pointer-events-none */
const petals = [
  { left: '5%',  size: 12, opacity: 0.5, cls: 'petal-1'  },
  { left: '15%', size: 10, opacity: 0.4, cls: 'petal-2'  },
  { left: '25%', size: 14, opacity: 0.6, cls: 'petal-3'  },
  { left: '35%', size: 9,  opacity: 0.35,cls: 'petal-4'  },
  { left: '45%', size: 13, opacity: 0.5, cls: 'petal-5'  },
  { left: '55%', size: 11, opacity: 0.45,cls: 'petal-6'  },
  { left: '65%', size: 10, opacity: 0.4, cls: 'petal-7'  },
  { left: '72%', size: 14, opacity: 0.55,cls: 'petal-8'  },
  { left: '80%', size: 9,  opacity: 0.35,cls: 'petal-9'  },
  { left: '88%', size: 12, opacity: 0.5, cls: 'petal-10' },
  { left: '92%', size: 10, opacity: 0.4, cls: 'petal-11' },
  { left: '10%', size: 8,  opacity: 0.3, cls: 'petal-12' },
]

function Petal({ size, color = '#e8b4b8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 2 C12 4, 14 8, 12 12 C10 16, 8 16, 6 12 C4 8, 6 4, 10 2Z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  )
}

export default function FloatingPetals() {
  const colors = ['#e8b4b8', '#ecd4a0', '#d4e8c8', '#f0cdd0', '#c4956a']

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((p, i) => (
        <div
          key={i}
          className={p.cls}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-20px',
            opacity: p.opacity,
          }}
        >
          <Petal size={p.size} color={colors[i % colors.length]} />
        </div>
      ))}
    </div>
  )
}
