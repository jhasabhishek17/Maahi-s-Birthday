import { motion } from 'framer-motion'

export default function BirthdayLetter() {
  return (
    <section
      id="birthday-letter"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fdf8f0 100%)' }}
    >
      <div className="max-w-2xl mx-auto">

        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-widest text-[#c4956a] mb-2"
            style={{ fontFamily: "'Inter', sans-serif" }}>
            — something small —
          </p>
          <h2 className="text-4xl text-[#4a2c0a]"
            style={{ fontFamily: "'Dancing Script', cursive" }}>
            A tiny birthday note 💌
          </h2>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl shadow-[0_8px_40px_rgba(139,94,60,0.15)] overflow-hidden"
          style={{ background: '#fffef9', border: '1px solid #f5e4c0' }}
        >
          {/* Left bookmark accent */}
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
            style={{ background: 'linear-gradient(180deg, #e8b4b8, #c4956a, #e8b4b8)' }} />

          {/* Corner flowers */}
          <div className="absolute top-4 right-4 text-2xl opacity-30">🌷</div>
          <div className="absolute bottom-4 right-4 text-2xl opacity-30">🌸</div>
          <div className="absolute bottom-4 left-6 text-xl opacity-20">✨</div>

          {/* Letter content */}
          <div
            className="p-8 md:p-12 pl-10 leading-8 text-[#4a2c0a]"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: '1.15rem',
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(139,94,60,0.07) 31px, rgba(139,94,60,0.07) 32px)',
            }}
          >
            <p className="text-xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Akshra, Maahi, Akshuu —
            </p>

            <p className="mb-4">
              You have had a pretty rough year, and maybe life hasn't always been particularly kind lately.
            </p>

            <p className="mb-4">
              So today isn't about fixing everything.
            </p>

            <p className="mb-4">
              It's simply about reminding you that <span className="font-bold text-[#8b5e3c]">you deserve good things too.</span>
            </p>

            <p className="mb-4">
              You're intelligent, supportive, ridiculously talented, and somehow manage to be there for people even when life gets difficult.
            </p>

            <p className="mb-6">
              And because you're apparently also a professional singer, this website officially declares that your imaginary birthday concert starts now.
            </p>

            <p className="text-2xl font-bold text-[#6b4226] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Happy Birthday, Maahi. 🌷
            </p>

            <div className="border-l-2 border-[#e8b4b8] pl-4 mb-6 text-[#6b4226]">
              <p>No expectations.</p>
              <p>No pressure.</p>
              <p>Just a little birthday corner made for you.</p>
            </div>

            <p className="mb-1">Eat something nice.</p>
            <p className="mb-1">Listen to your favourite song.</p>
            <p className="mb-1">Buy yourself flowers.</p>
            <p className="mb-1">Laugh at something stupid.</p>
            <p className="mt-4 font-bold text-[#8b5e3c]">
              And please remember that you deserve a genuinely good day. ✨
            </p>
          </div>

          {/* Wax seal */}
          <div className="flex justify-end p-6 pt-0">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
              className="relative"
            >
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="28" fill="#c4956a" />
                <circle cx="30" cy="30" r="24" fill="#8b5e3c" />
                <circle cx="30" cy="30" r="20" fill="#6b4226" />
                {/* Star pattern */}
                {[0,45,90,135,180,225,270,315].map((angle, i) => (
                  <line
                    key={i}
                    x1="30" y1="30"
                    x2={30 + 16 * Math.cos(angle * Math.PI / 180)}
                    y2={30 + 16 * Math.sin(angle * Math.PI / 180)}
                    stroke="#c4956a" strokeWidth="1" opacity="0.7"
                  />
                ))}
                <circle cx="30" cy="30" r="5" fill="#c4956a" opacity="0.6" />
                <text x="30" y="34" textAnchor="middle" fontSize="10" fill="#faf0dc" fontFamily="serif">🌷</text>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
