import { lazy, Suspense } from 'react'
import { meta } from '../data/site'
import { useScrollProgress, usePrefersReducedMotion } from '../hooks/useScrollProgress'
import { useWebGL } from '../hooks/useWebGL'

const DroneCanvas = lazy(() =>
  import('../components/drone/DroneCanvas').then((m) => ({ default: m.DroneCanvas })),
)

const CHIPS = [
  { k: 'ENDURANCE', v: '100 MIN', x: '60%', y: '15%' },
  { k: 'RANGE', v: '10 KM', x: '81%', y: '36%' },
  { k: 'WIND', v: '30 KT', x: '56%', y: '70%' },
  { k: 'PAYLOAD', v: 'EO/IR', x: '77%', y: '78%' },
]

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLElement>()
  const webgl = useWebGL()
  const reduced = usePrefersReducedMotion()
  const show3d = webgl === true && !reduced

  return (
    <header className={`hero${show3d ? ' hero-3d' : ''}`} id="top" ref={ref}>
      {show3d ? (
        <Suspense fallback={<div className="drone-loading-veil" />}>
          <div className="hero-drone" aria-hidden="true">
            <DroneCanvas />
          </div>
          {CHIPS.map((c) => (
            <div key={c.k} className="hchip" style={{ left: c.x, top: c.y }}>
              <span className="hc-k">{c.k}</span>
              <span className="hc-v">{c.v}</span>
            </div>
          ))}
        </Suspense>
      ) : (
        <img
          className="hero-photo"
          src="/img/fleet-dawn.jpg"
          alt="Amber Wings unmanned aircraft lined up on the tarmac at dawn."
          style={{ transform: `scale(${1.1 + progress * 0.08}) translateY(${progress * 36}px)` }}
        />
      )}
      <div className="hero-frame" aria-hidden="true">
        <span className="hf-corner tl" />
        <span className="hf-corner tr" />
        <span className="hf-corner bl" />
        <span className="hf-corner br" />
      </div>
      <div className="shell">
        <p className="eyebrow">{meta.company} · {meta.vertical}</p>
        <h1>
          <em>Autonomy</em> for India’s
          <br />
          internal security.
        </h1>
        <p className="hero-sub">{meta.tagline}</p>
        <div className="hero-meta">
          <span>MHA / CRPF concept note</span>
          <span>Ref. B.V-7-C/2026-27-C</span>
          <span>{show3d ? 'Live model · move the pointer' : 'NCNC field demo · Aug 2026'}</span>
        </div>
      </div>
      <div className="hero-foot wide">
        <span>{meta.submission}</span>
        <span className="scroll-cue">Scroll ↓</span>
      </div>
    </header>
  )
}
