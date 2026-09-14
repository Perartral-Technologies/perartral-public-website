import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading } from '../components/bits'
import { specs, specSecondary, platformTraits, hotspots, platformFamily, meta } from '../data/site'

export function Platform() {
  return (
    <section className="platform" id="platform">
      <div className="shell">
        <Reveal>
          <Eyebrow>The platform</Eyebrow>
          <SectionHeading lines={[meta.product, 'Portable ISR quadcopter.']} />
          <p className="band-lede">
            Extremely low footprint, ruggedised, high modularity — one operator carries and launches it in minutes.
          </p>
        </Reveal>
      </div>

      <Reveal as="figure" className="platform-figure">
        <img src="/anvik-platform.jpg" alt="The Anvik quadcopter in flight over a coastal port." />
        {hotspots.map((h, i) => (
          <div key={i} className="hotspot" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <div className="dot" />
            <div className="label">
              <b>{h.title}</b>
              <span>{h.body}</span>
            </div>
          </div>
        ))}
        <figcaption>Anvik · flight-test footage frame</figcaption>
      </Reveal>

      <div className="shell">
        <Reveal className="spec-row" delay={60}>
          {specs.map((s) => (
            <div key={s.label} className="cell">
              <span className="v">
                {s.value}
                <span className="u">{s.unit}</span>
              </span>
              <span className="k">{s.label}</span>
            </div>
          ))}
        </Reveal>

        <div className="platform-meta">
          <Reveal>
            <ul className="trait-list">
              {platformTraits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={60}>
            <ul className="spec2-list">
              {specSecondary.map((s) => (
                <li key={s.label}>
                  <span>{s.label}</span>
                  <b>{s.value}</b>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <button className="btn" onClick={() => window.print()}>
          Print spec sheet <b>⎙</b>
        </button>

        <Reveal as="div" className="family" delay={40}>
          <p className="family-lede">
            <b>Part of a wider programme.</b> Anvik is one of three Perartral platforms proposed for CEPI / CRPF,
            built on Amber Wings’ shared airframe programme.
          </p>
          <div className="family-grid">
            {platformFamily.map((p) => (
              <figure key={p.key} className="family-card">
                <div className="family-photo">
                  <img src={p.img} alt={`${p.name} — ${p.role}`} style={{ objectPosition: p.position }} />
                </div>
                <figcaption>
                  <b>{p.name}</b>
                  <span className="role">{p.role}</span>
                  <span className="spec">{p.spec}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
