import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionIndex } from '../components/bits'
import { glance, whoWeAre } from '../data/site'

export function Glance() {
  return (
    <section className="band glance" id="company">
      <div className="shell">
        <SectionIndex n="01" name="Company" />
        <div className="glance-head">
          <Reveal>
            <Eyebrow>{whoWeAre.eyebrow}</Eyebrow>
            <h2 className="section-heading">
              A deep-tech start-up building
              <span className="soft">AI-driven autonomy.</span>
            </h2>
            <p className="band-lede">{whoWeAre.lede}</p>
          </Reveal>
          <Reveal delay={100} className="glance-plaque">
            <img src="/img/perartral-logo.jpg" alt="Perartral · wordmark" />
            <span>Incubated at V-Nest · VIT Chennai</span>
          </Reveal>
        </div>

        <Reveal className="glance-grid" delay={60}>
          {glance.map((g) => (
            <div key={g.label} className="cell">
              <span className="v">
                {g.value}
                {g.unit && <span className="u">{g.unit}</span>}
              </span>
              <span className="k">{g.label}</span>
            </div>
          ))}
        </Reveal>

        <Reveal className="pillar-grid" delay={80}>
          {whoWeAre.pillars.map((p, i) => (
            <article key={p.k}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{p.k}</h3>
              <p>{p.v}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
