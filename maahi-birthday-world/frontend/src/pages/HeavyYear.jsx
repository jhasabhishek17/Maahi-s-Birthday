import { motion } from 'framer-motion'

const flowers = ['🌷', '🌸', '🌹', '🌻', '🌼']

export default function HeavyYear() {
  return (
    <section
      id="heavy-year"
      className="py-20 px-4"
      style={{ background: 'linear-gradient(180deg, #faf0dc 0%, #fdf8f0 100%)' }}
    >
      <div className="max-w-xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2
            className="text-3xl md:text-4xl text-[#4a2c0a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            For the Year That Wasn't Exactly Easy...
          </h2>
        </motion.div>

        {/* Heavy card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-8 mb-10 text-center"
          style={{
            background: '#fffef9',
            border: '1px solid #f5e4c0',
            boxShadow: '0 4px 24px rgba(139,94,60,0.08)',
          }}
        >
          <div
            className="text-[#6b4226] italic leading-8 space-y-4"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}
          >
            <p>Some years are just heavier than others.</p>
            <p>You don't have to pretend every day was perfect.</p>
            <div className="w-12 h-px bg-[#ecd4a0] mx-auto" />
            <p className="font-semibold text-[#4a2c0a]">But you made it here.</p>
            <p>And that's worth celebrating too.</p>
          </div>
        </motion.div>

        {/* Blooming flowers animation */}
        <div className="flex justify-center gap-6 mb-10">
          {flowers.map((f, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0, opacity: 0, y: 20 }}
              whileInView={{ scaleY: 1, opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.4 + i * 0.15,
                type: 'spring',
                stiffness: 200,
                damping: 12,
              }}
              style={{ transformOrigin: 'bottom center', fontSize: '2rem' }}
            >
              {f}
            </motion.div>
          ))}
        </div>

        {/* Brighter card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-8 text-center"
          style={{
            background: 'linear-gradient(135deg, #faf0dc 0%, #f5e4c0 100%)',
            border: '1px solid #ecd4a0',
          }}
        >
          <h3
            className="text-2xl text-[#4a2c0a] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Now let's make today a little better. 🌷
          </h3>
          <p
            className="text-[#6b4226] leading-7"
            style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem' }}
          >
            Whatever happened this year — today belongs to you.<br />
            So eat something delicious, laugh at something ridiculous,<br />
            and let someone (even if it's just the teddy) celebrate you.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
