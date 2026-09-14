import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading } from '../components/bits'
import { deliverables } from '../data/site'

export function Deliverables() {
  return (
    <section className="band" id="deliverables">
      <div className="shell">
        <Reveal>
          <Eyebrow>{deliverables.eyebrow}</Eyebrow>
          <SectionHeading lines={deliverables.heading} />
        </Reveal>
        <Reveal className="deliver-list" as="ul" delay={80}>
          {deliverables.items.map((it, i) => (
            <li key={i}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {it}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
