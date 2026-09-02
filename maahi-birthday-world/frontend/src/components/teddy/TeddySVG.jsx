/**
 * Mr. Bean's Teddy — original inspired recreation
 * Simple, worn, lovable bear with button eyes
 */
export default function TeddySVG({ size = 200, dancing = false, expression = 'happy', className = '' }) {
  const w = size, h = size * 1.15

  return (
    <div
      className={`inline-block select-none ${dancing ? 'dancing' : ''} ${className}`}
      style={{ width: w, height: h }}
      aria-label="A lovable teddy bear"
      role="img"
    >
      <svg viewBox="0 0 100 115" width={w} height={h} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id={`body-${size}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#c8935a" />
            <stop offset="55%"  stopColor="#b07840" />
            <stop offset="100%" stopColor="#8a5c28" />
          </radialGradient>
          <radialGradient id={`head-${size}`} cx="38%" cy="32%" r="62%">
            <stop offset="0%"   stopColor="#ca9560" />
            <stop offset="60%"  stopColor="#b07840" />
            <stop offset="100%" stopColor="#8a5c28" />
          </radialGradient>
          <radialGradient id={`tummy-${size}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%"   stopColor="#f0dfc0" />
            <stop offset="100%" stopColor="#ddc898" />
          </radialGradient>
          <filter id={`shadow-${size}`}>
            <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#5a3010" floodOpacity="0.18"/>
          </filter>
        </defs>

        {/* ── EARS ── */}
        {/* Left ear */}
        <circle cx="24" cy="22" r="10" fill={`url(#body-${size})`} />
        <circle cx="24" cy="22" r="5.5" fill="#e8b8a0" opacity="0.7" />
        {/* Right ear */}
        <circle cx="76" cy="22" r="10" fill={`url(#body-${size})`} />
        <circle cx="76" cy="22" r="5.5" fill="#e8b8a0" opacity="0.7" />

        {/* ── HEAD ── */}
        <circle cx="50" cy="36" r="26" fill={`url(#head-${size})`} filter={`url(#shadow-${size})`} />

        {/* Forehead shine */}
        <ellipse cx="43" cy="26" rx="7" ry="5" fill="white" opacity="0.12" />

        {/* ── MUZZLE ── */}
        <ellipse cx="50" cy="46" rx="11" ry="8" fill="#d4a070" />
        <ellipse cx="50" cy="46" rx="9"  ry="6" fill="#e0b888" />

        {/* ── LEFT EYE (big button — Mr Bean style) ── */}
        {/* Eye socket depression */}
        <circle cx="39" cy="33" r="6.5" fill="#1a0a04" />
        {/* Button shank ring */}
        <circle cx="39" cy="33" r="5.5" fill="#2d1208" />
        {/* Button face */}
        <circle cx="39" cy="33" r="4.5" fill="#0d0503" />
        {/* Cross stitch on button */}
        <line x1="36.5" y1="30.5" x2="41.5" y2="35.5" stroke="#4a2010" strokeWidth="0.7" opacity="0.8"/>
        <line x1="41.5" y1="30.5" x2="36.5" y2="35.5" stroke="#4a2010" strokeWidth="0.7" opacity="0.8"/>
        {/* Eye shine */}
        <circle cx="37.5" cy="31.5" r="1.2" fill="white" opacity="0.7" />

        {/* ── RIGHT EYE (smaller — slightly worn) ── */}
        <circle cx="62" cy="33" r="5.5" fill="#1a0a04" />
        <circle cx="62" cy="33" r="4.5" fill="#2d1208" />
        <circle cx="62" cy="33" r="3.8" fill="#0d0503" />
        <line x1="59.8" y1="30.8" x2="64.2" y2="35.2" stroke="#4a2010" strokeWidth="0.7" opacity="0.8"/>
        <line x1="64.2" y1="30.8" x2="59.8" y2="35.2" stroke="#4a2010" strokeWidth="0.7" opacity="0.8"/>
        <circle cx="60.5" cy="31.5" r="1" fill="white" opacity="0.7" />

        {/* ── NOSE (small, simple) ── */}
        <ellipse cx="50" cy="42" rx="3.5" ry="2.5" fill="#3d1a08" />

        {/* ── MOUTH ── */}
        {expression === 'happy' && (
          <path d="M 44 47 Q 50 53 56 47" stroke="#3d1a08" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        )}
        {expression === 'surprised' && (
          <ellipse cx="50" cy="49" rx="3" ry="3.5" fill="#3d1a08" />
        )}
        {expression === 'wink' && (
          <path d="M 44 47 Q 50 52 56 47" stroke="#3d1a08" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        )}

        {/* ── CHEEKS ── */}
        <ellipse cx="34" cy="40" rx="5" ry="3.5" fill="#e8706a" opacity="0.35" />
        <ellipse cx="66" cy="40" rx="5" ry="3.5" fill="#e8706a" opacity="0.35" />

        {/* ── BODY ── */}
        <ellipse cx="50" cy="82" rx="22" ry="24" fill={`url(#body-${size})`} filter={`url(#shadow-${size})`} />

        {/* Tummy */}
        <ellipse cx="50" cy="82" rx="14" ry="16" fill={`url(#tummy-${size})`} />

        {/* Tummy stitch (worn look) */}
        <ellipse cx="50" cy="82" rx="14" ry="16" fill="none"
          stroke="#b07840" strokeWidth="0.6" strokeDasharray="3,2" opacity="0.4" />

        {/* ── LEFT ARM ── */}
        <ellipse cx="26" cy="82" rx="7" ry="13" fill={`url(#body-${size})`}
          transform="rotate(-20 26 82)" />
        {/* Left paw */}
        <ellipse cx="19" cy="93" rx="5.5" ry="4" fill="#9a6830"
          transform="rotate(-20 19 93)" />

        {/* ── RIGHT ARM ── */}
        <ellipse cx="74" cy="82" rx="7" ry="13" fill={`url(#body-${size})`}
          transform="rotate(20 74 82)" />
        {/* Right paw */}
        <ellipse cx="81" cy="93" rx="5.5" ry="4" fill="#9a6830"
          transform="rotate(20 81 93)" />

        {/* ── LEGS ── */}
        {/* Left leg */}
        <ellipse cx="38" cy="103" rx="9" ry="7" fill={`url(#body-${size})`} />
        <ellipse cx="37" cy="109" rx="8" ry="4.5" fill="#9a6830" />
        {/* Right leg */}
        <ellipse cx="62" cy="103" rx="9" ry="7" fill={`url(#body-${size})`} />
        <ellipse cx="63" cy="109" rx="8" ry="4.5" fill="#9a6830" />

        {/* ── WEAR PATCH (authentic worn look) ── */}
        <ellipse cx="44" cy="74" rx="4" ry="3" fill="none"
          stroke="#9a6830" strokeWidth="1" strokeDasharray="2,1.5" opacity="0.5" />

        {/* ── BOWTIE (red — Mr Bean style) ── */}
        <polygon points="44,61 38,57 38,65" fill="#c0384a" opacity="0.9" />
        <polygon points="56,61 62,57 62,65" fill="#c0384a" opacity="0.9" />
        <circle cx="50" cy="61" r="3.5" fill="#a02030" />
        {/* Bowtie detail */}
        <circle cx="50" cy="61" r="1.5" fill="#c0384a" opacity="0.7" />

        {/* ── STITCHING DETAILS ── */}
        {/* Head top stitch */}
        <path d="M 47 10.5 L 50 12 L 53 10.5" stroke="#9a6830" strokeWidth="0.7"
          strokeLinecap="round" fill="none" opacity="0.45" />
        {/* Side body stitch */}
        <path d="M 28 76 L 29 79 L 28 82" stroke="#9a6830" strokeWidth="0.7"
          strokeLinecap="round" fill="none" opacity="0.35" />
      </svg>
    </div>
  )
}
