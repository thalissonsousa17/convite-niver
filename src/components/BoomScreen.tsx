const DUR = 900

export default function BoomScreen() {
  const ring: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, #fbbf24 0%, #f97316 35%, #0ea5e9 65%, transparent 80%)',
          animationName: 'boomFlash',
          animationDuration: `${DUR}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      />
      <div
        style={{
          ...ring,
          border: '10px solid #fbbf24',
          boxShadow: '0 0 50px #fbbf24, 0 0 100px #f97316',
          animationName: 'boomRing',
          animationDuration: `${DUR * 0.95}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      />
      <div
        style={{
          ...ring,
          width: '120px',
          height: '120px',
          border: '7px solid #0ea5e9',
          boxShadow: '0 0 40px #0ea5e9',
          animationName: 'boomRing2',
          animationDuration: `${DUR * 0.85}ms`,
          animationDelay: '80ms',
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          fontSize: '160px',
          lineHeight: 1,
          animationName: 'boomStar',
          animationDuration: `${DUR}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
          filter: 'blur(2px)',
          opacity: 0.6,
        }}
      >
        ✦
      </div>
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          fontSize: '90px',
          lineHeight: 1,
          animationName: 'boomEmoji',
          animationDuration: `${DUR}ms`,
          animationFillMode: 'forwards',
          animationTimingFunction: 'ease-out',
        }}
      >
        🎉
      </div>
    </div>
  )
}

export const DUR_BOOM = DUR
