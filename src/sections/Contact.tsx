import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionIndex } from '../components/bits'
import { ask, contact, deliverables } from '../data/site'

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-media" aria-hidden="true">
        <img src="/img/dusk-watch.jpg" alt="" />
      </div>
      <div className="shell">
        <SectionIndex n="09" name="Briefing" />
        <Reveal>
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <h2 className="contact-heading">
            Ready to <em>demonstrate.</em>
            <br />
            Ready to <em>deliver.</em>
          </h2>
          <p className="contact-lede">
            We request the opportunity to present these three platforms to the CRPF QR Cell and CEPI, and to
            participate in the field demonstration under Ref. B.V-7-C/2026-27-C (UAV Demo).
          </p>
        </Reveal>

        <div className="contact-cols">
          <Reveal delay={60}>
            <span className="req-title">{ask.heading}</span>
            <ul className="tick-list ask-list">
              {ask.items.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <span className="req-title">{deliverables.eyebrow}</span>
            <ul className="deliver-list">
              {deliverables.items.map((it, i) => (
                <li key={i}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {it}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal className="contact-card" delay={120}>
          <div>
            <div className="k">Contact</div>
            <div className="v">
              {contact.name}
              <br />
              <span style={{ color: 'var(--muted)' }}>{contact.roleLine}</span>
            </div>
          </div>
          <div>
            <div className="k">Email · Phone</div>
            <div className="v">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <br />
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            </div>
          </div>
          <div>
            <div className="k">Address</div>
            <div className="v">{contact.address}</div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
