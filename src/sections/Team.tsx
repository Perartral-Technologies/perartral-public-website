import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading } from '../components/bits'
import { team } from '../data/site'

const initials = (name: string) =>
  name
    .split(' ')
    .filter((p) => p && !p.endsWith('.'))
    .slice(0, 2)
    .map((p) => p[0])
    .join('')

export function Team() {
  return (
    <section className="band" id="team">
      <div className="shell">
        <Reveal>
          <Eyebrow>{team.eyebrow}</Eyebrow>
          <SectionHeading lines={['Aerospace mentorship,', 'an AI core, one manufacturer.']} />
        </Reveal>

        <Reveal className="team-grid" delay={80}>
          {team.members.map((m) => (
            <article key={m.name}>
              <div className="avatar">{initials(m.name)}</div>
              <h3>{m.name}</h3>
              <p className="role">{m.role}</p>
              <p className="note">{m.note}</p>
            </article>
          ))}
        </Reveal>

        <Reveal className="partner-lines" delay={120}>
          <p>{team.institution}</p>
          <p>{team.manufacturing}</p>
        </Reveal>
      </div>
    </section>
  )
}
