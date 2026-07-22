import { useEffect } from 'react'

// Keyframes injetados programaticamente no <head> como fallback extra
const EXTRA_CSS = `
  @keyframes riseUp {
    0%   { transform: translateY(0px)    rotate(-6deg); opacity: 0;    }
    8%   { transform: translateY(-8vh)   rotate(-3deg); opacity: 0.85; }
    92%  { transform: translateY(-108vh) rotate( 4deg); opacity: 0.75; }
    100% { transform: translateY(-120vh) rotate( 6deg); opacity: 0;    }
  }
  @keyframes riseUpB {
    0%   { transform: translateY(0px)    rotate( 5deg); opacity: 0;    }
    8%   { transform: translateY(-8vh)   rotate( 3deg); opacity: 0.85; }
    92%  { transform: translateY(-108vh) rotate(-4deg); opacity: 0.75; }
    100% { transform: translateY(-120vh) rotate(-6deg); opacity: 0;    }
  }
  @keyframes riseUpC {
    0%   { transform: translateY(0px)    rotate( 0deg); opacity: 0;    }
    8%   { transform: translateY(-8vh)   rotate( 2deg); opacity: 0.85; }
    92%  { transform: translateY(-108vh) rotate(-3deg); opacity: 0.75; }
    100% { transform: translateY(-120vh) rotate( 4deg); opacity: 0;    }
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0.35; transform: scale(1)   rotate(0deg);  }
    50%       { opacity: 0.9;  transform: scale(1.4) rotate(20deg); }
  }
`

type BalloonCfg = {
  left: string
  size: number
  dur: number
  delay: number
  color: string
  anim: 'riseUp' | 'riseUpB' | 'riseUpC'
}

const C = [
  'var(--color-laranja)',
  'var(--color-ouro)',
  'var(--color-fucsia)',
  'var(--color-turquesa)',
]

const BALLOONS: BalloonCfg[] = [
  { left:  '2%', size:  80, dur: 10, delay:  -3, color: C[0], anim: 'riseUp'  },
  { left:  '8%', size:  60, dur: 13, delay:  -8, color: C[1], anim: 'riseUpB' },
  { left: '14%', size: 100, dur:  9, delay:  -1, color: C[2], anim: 'riseUpC' },
  { left: '20%', size:  55, dur: 15, delay: -11, color: C[3], anim: 'riseUp'  },
  { left: '27%', size:  90, dur: 11, delay:  -5, color: C[0], anim: 'riseUpB' },
  { left: '33%', size:  70, dur:  8, delay: -13, color: C[1], anim: 'riseUpC' },
  { left: '39%', size: 110, dur: 14, delay:  -2, color: C[2], anim: 'riseUp'  },
  { left: '46%', size:  65, dur: 10, delay:  -9, color: C[3], anim: 'riseUpB' },
  { left: '52%', size:  85, dur: 12, delay:  -6, color: C[0], anim: 'riseUpC' },
  { left: '58%', size:  55, dur: 16, delay: -14, color: C[1], anim: 'riseUp'  },
  { left: '65%', size:  95, dur:  9, delay:  -4, color: C[2], anim: 'riseUpB' },
  { left: '71%', size:  75, dur: 11, delay: -10, color: C[3], anim: 'riseUpC' },
  { left: '78%', size:  60, dur: 13, delay:  -7, color: C[0], anim: 'riseUp'  },
  { left: '84%', size: 105, dur:  8, delay: -12, color: C[1], anim: 'riseUpB' },
  { left: '90%', size:  70, dur: 15, delay:  -3, color: C[2], anim: 'riseUpC' },
  { left: '96%', size:  85, dur: 10, delay:  -5, color: C[3], anim: 'riseUp'  },
  { left:  '5%', size:  50, dur: 12, delay: -15, color: C[3], anim: 'riseUpC' },
  { left: '24%', size:  65, dur:  9, delay:  -3, color: C[2], anim: 'riseUp'  },
  { left: '43%', size:  80, dur: 14, delay:  -8, color: C[1], anim: 'riseUpB' },
  { left: '62%', size:  55, dur: 11, delay:  -6, color: C[0], anim: 'riseUpC' },
  { left: '80%', size:  70, dur:  8, delay: -10, color: C[3], anim: 'riseUp'  },
]

const SPARKLES = [
  { left: '15%', top: '15%', size: 20, delay: 0.3, color: C[1] },
  { left: '75%', top: '22%', size: 16, delay: 1.1, color: C[0] },
  { left: '30%', top: '55%', size: 22, delay: 0.7, color: C[3] },
  { left: '62%', top: '65%', size: 18, delay: 1.8, color: C[2] },
  { left: '88%', top: '45%', size: 14, delay: 0.5, color: C[1] },
  { left: '45%', top: '30%', size: 24, delay: 2.0, color: C[0] },
]

export default function PartyDecor() {
  useEffect(() => {
    if (document.getElementById('balloon-keyframes')) return
    const el = document.createElement('style')
    el.id = 'balloon-keyframes'
    el.textContent = EXTRA_CSS
    document.head.appendChild(el)
    return () => { document.getElementById('balloon-keyframes')?.remove() }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.left,
            bottom: '0px',
            animationName: b.anim,
            animationDuration: `${b.dur}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationDelay: `${b.delay}s`,
            animationFillMode: 'both',
          }}
        >
          <BalloonSvg color={b.color} size={b.size} />
        </div>
      ))}

      {SPARKLES.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            animationName: 'twinkle',
            animationDuration: `${2.5 + s.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationDelay: `${s.delay}s`,
            animationFillMode: 'both',
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2 L13.5 9 L20 12 L13.5 15 L12 22 L10.5 15 L4 12 L10.5 9 Z"
              fill={s.color}
              opacity="0.7"
            />
          </svg>
        </div>
      ))}

      <div className="absolute inset-0 bg-noite/50" />
    </div>
  )
}

function BalloonSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size * 1.35}
      viewBox="0 0 100 135"
      fill="none"
      style={{ display: 'block', opacity: 0.92 }}
    >
      <ellipse cx="50" cy="46" rx="44" ry="46" fill={color} />
      <ellipse cx="37" cy="30" rx="11" ry="13" fill="white" opacity="0.22" />
      <polygon points="46,92 54,92 50,100" fill={color} opacity="0.8" />
      <path d="M50 100 L50 133" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d="M46 100 Q40 108 46 116 Q52 124 46 130" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  )
}
