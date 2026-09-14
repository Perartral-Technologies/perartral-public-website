import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading } from '../components/bits'
import { contact } from '../data/site'

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="shell">
        <Reveal>
          <Eyebrow>{contact.eyebrow}</Eyebrow>
          <SectionHeading lines={contact.heading} />
        </Reveal>
        <Reveal className="contact-card" delay={80}>
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
