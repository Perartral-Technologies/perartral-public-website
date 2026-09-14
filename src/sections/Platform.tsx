import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionIndex, KV } from '../components/bits'
import { anvik } from '../data/site'

export function Platform() {
  return (
    <section className="platform" id="anvik">
      <div className="shell">
        <SectionIndex n="04" name="Anvik platform" />
        <Reveal>
          <Eyebrow>{anvik.eyebrow}</Eyebrow>
          <h2 className="section-heading">
            Anvik.
            <span className="soft">
              Precision. Persistence. <em>Perception.</em>
            </span>
          </h2>
          <p className="band-lede">{anvik.lede}</p>
        </Reveal>
      </div>

      <Reveal as="figure" className="platform-figure">
        <img src={anvik.img} alt="The Anvik quadcopter in flight over a coastal container port." />
        {anvik.hotspots.map((h, i) => (
          <div key={i} className="hotspot" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <div className="dot" />
            <div className="label">
              <b>{h.title}</b>
              <span>{h.body}</span>
            </div>
          </div>
        ))}
        <figcaption>Anvik · portable ISR quadcopter</figcaption>
      </Reveal>

      <div className="shell">
        <Reveal className="spec-row six" delay={60}>
          {anvik.specs.map((s) => (
            <div key={s.label} className="cell">
              <span className="v">
                {s.value}
                {s.unit && <span className="u">{s.unit}</span>}
              </span>
              <span className="k">{s.label}</span>
            </div>
          ))}
        </Reveal>

        <div className="platform-meta">
          <Reveal>
            <ul className="trait-list">
              {anvik.traits.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={60}>
            <ul className="spec2-list kv-list">
              {anvik.secondary.map((s) => (
                <KV key={s.label} k={s.label} v={s.value} />
              ))}
            </ul>
          </Reveal>
        </div>

        <button className="btn" onClick={() => window.print()}>
          Print spec sheet <b>⎙</b>
        </button>
      </div>
    </section>
  )
}
