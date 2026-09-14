import { meta } from '../data/site'
import { useScrollProgress } from '../hooks/useScrollProgress'

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLElement>()

  return (
    <header className="hero" id="top" ref={ref}>
      <div className="hero-backdrop" aria-hidden="true" />
      <img
        className="hero-photo"
        src="/anvik-hero.jpg"
        alt="The Anvik quadcopter in flight over a coastal container port."
        style={{ transform: `scale(${1.08 + progress * 0.06}) translateY(${progress * 24}px)` }}
      />
      <div className="shell">
        <p className="eyebrow">{meta.owner} · Defence Vertical</p>
        <h1>
          {meta.headline[0]}
          <br />
          <span className="l2">{meta.headline[1]}</span>
        </h1>
        <p className="hero-sub">{meta.tagline}</p>
        <div className="hero-meta">
          <span>Property ISR</span>
          <span>Portable quadcopter</span>
          <span>On-premise AI</span>
        </div>
      </div>
    </header>
  )
}
