import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading, SectionIndex } from '../components/bits'
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
    <section className="band team" id="team">
      <div className="shell">
        <SectionIndex n="08" name="Team & institution" />
        <Reveal>
          <Eyebrow>{team.eyebrow}</Eyebrow>
          <SectionHeading lines={['ISRO mentorship,', 'a six-member engineering core.']} />
        </Reveal>

        <div className="team-layout">
          <Reveal className="team-photo" delay={40}>
            <img src={team.photo} alt="The Perartral and Amber Wings teams at the facility." loading="lazy" />
            <figcaption>{team.coreTeam}</figcaption>
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
        </div>

        <Reveal className="partner-lines" delay={120}>
          <p>{team.institution}</p>
        </Reveal>
      </div>
    </section>
  )
}
