import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading, SectionIndex } from '../components/bits'
import { roadmap } from '../data/site'

export function Roadmap() {
  return (
    <section className="band roadmap" id="roadmap">
      <div className="shell">
        <SectionIndex n="07" name="Execution roadmap" />
        <Reveal>
          <Eyebrow>{roadmap.eyebrow}</Eyebrow>
          <SectionHeading lines={roadmap.heading} />
        </Reveal>

        <Reveal className="timeline" delay={60}>
          {roadmap.phases.map((p, i) => (
            <article key={p.when} className="phase">
              <div className="phase-marker">
                <i />
              </div>
              <span className="phase-when">{p.when}</span>
              <h3>{p.title}</h3>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <span className="phase-n">{String(i + 1).padStart(2, '0')}</span>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
