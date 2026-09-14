import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading } from '../components/bits'
import { problem } from '../data/site'

export function Problem() {
  return (
    <section className="band" id="problem">
      <div className="shell">
        <Reveal>
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <SectionHeading lines={problem.heading} />
        </Reveal>

        <Reveal className="problem-grid" delay={80}>
          {problem.points.map((p, i) => (
            <p key={i} data-n={String(i + 1).padStart(2, '0')}>
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal className="need" delay={120}>
          {problem.need}
        </Reveal>
      </div>
    </section>
  )
}
