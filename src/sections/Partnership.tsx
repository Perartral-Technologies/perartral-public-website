import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading, SectionIndex } from '../components/bits'
import { partnership } from '../data/site'

export function Partnership() {
  return (
    <section className="band partners" id="partnership">
      <div className="shell">
        <SectionIndex n="06" name="Partnership" />
        <Reveal>
          <Eyebrow>{partnership.eyebrow}</Eyebrow>
          <SectionHeading lines={partnership.heading} />
        </Reveal>

        <Reveal className="partner-cols" delay={60}>
          {[
            { ...partnership.perartral, logo: undefined as string | undefined },
            partnership.amberWings,
          ].map((p) => (
            <article key={p.name} className="partner-col">
              <div className="pc-head">
                <div>
                  <span className="pc-role">{p.role}</span>
                  <h3>{p.name}</h3>
                </div>
                {p.logo && <img className="pc-logo" src={p.logo} alt={`${p.name} logo`} />}
              </div>
              <ul>
                {p.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>

        <Reveal className="commercial" delay={80}>
          <span className="req-title">Commercial model</span>
          <div className="commercial-grid">
            {partnership.commercial.map((c) => (
              <div key={c.k} className="comm-cell">
                <h4>{c.k}</h4>
                <p>{c.v}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal className="build-strip" delay={60}>
          {partnership.photos.map((p) => (
            <figure key={p.img}>
              <img src={p.img} alt={p.cap} loading="lazy" />
              <figcaption>{p.cap}</figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
