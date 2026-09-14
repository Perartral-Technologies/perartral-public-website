import { useScrollProgress } from '../hooks/useScrollProgress'
import { TerrainMap } from '../components/TerrainMap'
import { Reveal } from '../components/Reveal'
import { Eyebrow, SectionHeading } from '../components/bits'
import { pipeline, illustrativeAlert } from '../data/site'

function AlertCard() {
  return (
    <div className="alert-card">
      <div className="hdr">{illustrativeAlert.label} alert</div>
      <div className="row">
        <span>Parcel</span>
        <b>{illustrativeAlert.parcel}</b>
      </div>
      <div className="row">
        <span>Finding</span>
        <b>{illustrativeAlert.finding}</b>
      </div>
      <div className="row">
        <span>Coordinates</span>
        <b>{illustrativeAlert.coords}</b>
      </div>
      <div className="row">
        <span>Timestamp</span>
        <b>{illustrativeAlert.timestamp}</b>
      </div>
    </div>
  )
}

export function PerartralAI() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()

  // The track is 340vh tall inside a 100vh sticky, so the sticky is "held"
  // roughly over progress 0.23 .. 0.77 (enter/exit eat the rest).
  const held = Math.min(1, Math.max(0, (progress - 0.23) / (0.77 - 0.23)))
  const step = Math.min(4, Math.floor(held * 5))

  return (
    <section className="ai" id="perartral-ai">
      <div className="ai-head shell">
        <Reveal>
          <Eyebrow>The Perartral AI detection model</Eyebrow>
          <SectionHeading lines={['Five steps from', 'flight to evidence pack.']} />
          <span className="tag-illustrative">Illustrative — invented location</span>
        </Reveal>
      </div>

      {/* scroll-driven (wide + motion-ok) */}
      <div className="ai-track" ref={ref}>
        <div className="ai-sticky shell">
          <div className="ai-stage">
            <TerrainMap step={step} />
            {step === 4 && (
              <div style={{ position: 'absolute', right: 0, bottom: 0 }}>
                <AlertCard />
              </div>
            )}
          </div>
          <div className="ai-steps">
            {pipeline.map((s, i) => (
              <div key={s.n} className={`ai-step${i === step ? ' active' : ''}`}>
                <span className="n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* static fallback (narrow / reduced-motion) */}
      <div className="ai-static shell">
        {pipeline.map((s, i) => (
          <article key={s.n}>
            <span className="n">{s.n}</span>
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div style={{ marginTop: 22 }}>
                <div style={{ maxWidth: 420 }}>
                  <TerrainMap step={i} />
                </div>
              </div>
              {i === pipeline.length - 1 && (
                <div style={{ marginTop: 22 }}>
                  <AlertCard />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
