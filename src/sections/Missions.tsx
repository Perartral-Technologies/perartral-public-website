import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading, SectionIndex, KV } from '../components/bits'
import { missions, qrParams, coastalNeeds, propertyNeeds } from '../data/site'

const reqLists = [qrParams, coastalNeeds, propertyNeeds]
const reqTitles = [
  'Key QR parameters (draft) — CRPF Communication & IT Directorate, March 2026',
  'What the force needs — coastal & maritime surveillance',
  'What the property-ISR solution must produce',
]

export function Missions() {
  return (
    <section className="missions" id="missions">
      <div className="shell">
        <SectionIndex n="02" name="Mission set" />
        <Reveal>
          <Eyebrow>{missions.eyebrow}</Eyebrow>
          <SectionHeading lines={missions.heading} />
          <p className="band-lede">{missions.lede}</p>
        </Reveal>
      </div>

      {missions.items.map((m, i) => (
        <article key={m.ps} className={`mission${i % 2 ? ' flip' : ''}`}>
          <Reveal className="mission-media" delay={40}>
            <img src={m.img} alt={m.title} style={{ objectPosition: m.position }} />
            <span className="mission-ps">{m.ps}</span>
          </Reveal>
          <div className="mission-body">
            <Reveal delay={80}>
              <span className="mission-platform">{m.platform}</span>
              <h3>{m.title}</h3>
              <p className="mission-problem">{m.problem}</p>
              <p className="mission-detail">{m.detail}</p>
              <span className="mission-spec">{m.spec}</span>
            </Reveal>
            <Reveal delay={120}>
              <div className="req-block">
                <span className="req-title">{reqTitles[i]}</span>
                <ul className="kv-list">
                  {reqLists[i].map((r) => (
                    <KV key={r.k} k={r.k} v={r.v} />
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </article>
      ))}
    </section>
  )
}
