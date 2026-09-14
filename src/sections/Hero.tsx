import { meta } from '../data/site'
import { useScrollProgress } from '../hooks/useScrollProgress'

export function Hero() {
  const { ref, progress } = useScrollProgress<HTMLElement>()

  return (
    <header className="hero" id="top" ref={ref}>
      <img
        className="hero-photo"
        src="/img/fleet-dawn.jpg"
        alt="Amber Wings unmanned aircraft lined up on the tarmac at dawn."
        style={{ transform: `scale(${1.1 + progress * 0.08}) translateY(${progress * 36}px)` }}
      />
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
          <span>NCNC field demo · Aug 2026</span>
        </div>
      </div>
      <div className="hero-foot wide">
        <span>{meta.submission}</span>
        <span className="scroll-cue">Scroll ↓</span>
      </div>
    </header>
  )
}
