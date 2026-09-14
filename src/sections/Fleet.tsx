import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionIndex, KV } from '../components/bits'
import { m50, atva, q20, compliance } from '../data/site'

function SpecGrid({ specs }: { specs: { k: string; v: string }[] }) {
  return (
    <ul className="kv-list spec-grid">
      {specs.map((s) => (
        <KV key={s.k} k={s.k} v={s.v} />
      ))}
    </ul>
  )
}

export function Fleet() {
  return (
    <section className="fleet" id="platforms">
      <div className="shell">
        <SectionIndex n="05" name="The wider programme" />
        <Reveal>
          <Eyebrow>Three airframes, one autonomy stack</Eyebrow>
          <h2 className="section-heading">
            A wider programme
            <span className="soft">behind Anvik.</span>
          </h2>
          <p className="band-lede">
            Perartral proposed three platforms to CEPI / CRPF, built on Amber Wings’ shared airframe
            programme — the same software, GCS and AI layer across all of them.
          </p>
        </Reveal>
      </div>

      {/* ---------- M50 ---------- */}
      <div className="shell fleet-block">
        <Reveal className="fleet-head">
          <span className="fleet-tag">PS 01 — Medium Logistic Drone</span>
          <h3>
            {m50.name} <em>{m50.title}</em>
          </h3>
          <p>{m50.role}</p>
        </Reveal>
        <Reveal className="fleet-figure duo" delay={60}>
          <div className="duo-main">
            <img src={m50.img} alt="M50 heavy-lift multirotor carrying a slung load at dusk." />
          </div>
          <div className="duo-side">
            <img src="/img/warehouse.jpg" alt="Unmanned aircraft staged inside the integration warehouse." />
          </div>
          <figcaption>{m50.caption}</figcaption>
        </Reveal>
        <div className="fleet-cols">
          <Reveal delay={80}>
            <SpecGrid specs={m50.specs} />
          </Reveal>
          <Reveal delay={120}>
            <ul className="tick-list">
              {m50.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="fleet-note">{m50.positioning}</p>
          </Reveal>
        </div>

        {/* QR compliance */}
        <Reveal className="compliance" delay={60}>
          <div className="comp-head">
            <h4>{compliance.heading}</h4>
            <p>{compliance.lede}</p>
          </div>
          <div className="comp-cols">
            {compliance.columns.map((c) => (
              <div key={c.state} className={`comp-col state-${c.mark}`}>
                <span className="comp-state">
                  <i />
                  {c.state}
                </span>
                <ul>
                  {c.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="comp-commit">{compliance.commitment}</p>
        </Reveal>
      </div>

      {/* ---------- ATVA 1.5 ---------- */}
      <div className="shell fleet-block">
        <Reveal className="fleet-head">
          <span className="fleet-tag">PS 02 — Coastal & Maritime Surveillance</span>
          <h3>
            {atva.name} <em>{atva.title}</em>
          </h3>
          <p>{atva.role}</p>
        </Reveal>
        <Reveal className="fleet-figure duo" delay={60}>
          <div className="duo-main">
            <img src={atva.img} alt="ATVA 1.5 fixed-wing VTOL flying over a river valley." />
          </div>
          <div className="duo-side">
            <img src={atva.darkImg} alt="ATVA 1.5 studio render on black." />
          </div>
          <figcaption>{atva.caption}</figcaption>
        </Reveal>
        <div className="fleet-cols">
          <Reveal delay={80}>
            <SpecGrid specs={atva.specs} />
          </Reveal>
          <Reveal delay={120}>
            <ul className="tick-list">
              {atva.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <p className="fleet-note">{atva.missionPackage}</p>
          </Reveal>
        </div>
      </div>

      {/* ---------- cover break ---------- */}
      <Reveal as="figure" className="cover">
        <img src="/img/anvik-ember.jpg" alt="Quadcopter silhouette against an ember sky." />
        <figcaption className="cover-cap">
          <span>Field-proven airframes</span>
          <span>Amber Wings programme · IIT Madras</span>
        </figcaption>
      </Reveal>

      {/* ---------- Q20 provenance ---------- */}
      <div className="shell fleet-block q20">
        <div className="q20-grid">
          <Reveal className="q20-media">
            <img src={q20.img} alt="Q20 medium-lift quadcopter carrying a payload box over ridgeline terrain." />
          </Reveal>
          <Reveal className="q20-body" delay={80}>
            <span className="fleet-tag">Provenance airframe</span>
            <h3>
              {q20.name} <em>{q20.title}</em>
            </h3>
            <span className="mission-spec">{q20.spec}</span>
            <ul className="tick-list">
              {q20.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
