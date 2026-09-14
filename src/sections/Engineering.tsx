import { lazy, Suspense, useRef } from 'react'
import { Eyebrow, SectionIndex } from '../components/bits'
import { useScrollProgress, usePrefersReducedMotion } from '../hooks/useScrollProgress'
import { useWebGL } from '../hooks/useWebGL'

const ExplodeCanvas = lazy(() =>
  import('../components/drone/ExplodeCanvas').then((m) => ({ default: m.ExplodeCanvas })),
)

const STEPS = [
  {
    t: 'Assembled',
    d: 'One rugged airframe · shell, frame, quad propulsion. One operator, hand-launched in minutes.',
  },
  {
    t: 'Serviceable systems',
    d: 'Every system separates cleanly · power module, flight core, propulsion, vision, landing gear. Field-repairable by design.',
  },
  {
    t: 'Built to be opened',
    d: 'Modular construction means a damaged arm or a spent pack is swapped in the field, not shipped back.',
  },
]

/** Sticky scroll track · mounted only once WebGL is confirmed, so the
 *  progress hook measures a real element. */
function Track() {
  const { ref: trackRef, progress } = useScrollProgress<HTMLDivElement>()
  const shared = useRef({ v: 0 })
  shared.current.v = progress

  return (
    <div className="eng-track" ref={trackRef}>
      <div className="eng-sticky">
        <Suspense fallback={<div className="drone-loading-veil">LOADING AIRFRAME…</div>}>
          <ExplodeCanvas progress={shared.current} />
        </Suspense>
        <div className="eng-steps">
          {STEPS.map((s, i) => {
            const local = Math.min(1, Math.max(0, (progress - i * 0.3 - 0.05) / 0.22))
            return (
              <article key={s.t} className="eng-step" style={{ opacity: 0.22 + local * 0.78 }}>
                <span className="eng-step-n">{String(i + 1).padStart(2, '0')}</span>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </article>
            )
          })}
        </div>
        <div className="eng-hud">
          <span>ANVIK · EXPLODED VIEW</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

export function Engineering() {
  const webgl = useWebGL()
  const reduced = usePrefersReducedMotion()
  const show3d = webgl === true && !reduced

  return (
    <section className="engineering" id="engineering">
      <div className="shell eng-head">
        <SectionIndex n="04b" name="Engineering" />
        <Eyebrow>Inside the airframe</Eyebrow>
        <h2 className="section-heading">
          Exploded.
          <span className="soft">
            Every system <em>serviceable.</em>
          </span>
        </h2>
        <p className="band-lede">
          Anvik is built modular · flight core, power, propulsion, vision and landing gear separate in
          the field. Scroll to break it apart.
        </p>
      </div>

      {show3d ? (
        <Track />
      ) : (
        <div className="shell">
          <div className="eng-static">
            <img src="/img/anvik-ember.jpg" alt="The Anvik quadcopter" />
            <div className="eng-static-list">
              {STEPS.map((s, i) => (
                <article key={s.t} className="eng-step static">
                  <span className="eng-step-n">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
