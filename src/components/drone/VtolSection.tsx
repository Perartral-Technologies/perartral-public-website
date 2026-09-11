import { useEffect, useRef, useState } from 'react'
import { VtolScene } from './VtolScene'

/**
 * Dedicated showcase for the second airframe. The canvas mounts only once the
 * section approaches the viewport (and unmounts once it is well past), so the
 * second WebGL context costs nothing during the quadcopter sequence above.
 * Scroll progress is measured from this section's own rect rather than the
 * whole document, so it stays correct no matter how the page grows.
 */
export function VtolSection() {
  const section = useRef<HTMLElement>(null)
  const progress = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = section.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMounted(entry.isIntersecting)
        // The quadcopter lives in a fixed full-page canvas. Once this section
        // is in view its engineering labels would otherwise show through and
        // sit on top of the VTOL, so the backdrop is faded out for the act.
        document.body.classList.toggle('airframe-active', entry.isIntersecting)
      },
      { rootMargin: '35% 0px 35% 0px' },
    )
    observer.observe(el)

    let frame = 0
    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const span = window.innerHeight + rect.height
      progress.current = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure) }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      observer.disconnect()
      document.body.classList.remove('airframe-active')
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <section ref={section} id="airframe" className="airframe section">
    <div className="airframe-visual">
      {mounted && <VtolScene progress={progress} />}
    </div>
    <div className="airframe-copy">
      <p className="eyebrow"><span className="label-bracket">03 · INTRODUCING THE ATVA 2.0</span></p>
      <h2>RANGE,<br /><em>REIMAGINED.</em></h2>
      <p className="airframe-lede">The ATVA 2.0 is a fixed-wing VTOL that lifts vertically and transitions to efficient forward cruise. Four lift rotors for departure, one pusher for the journey.</p>
      <dl className="airframe-specs">
        <div><dt>PLATFORM</dt><dd>ATVA 2.0</dd></div>
        <div><dt>CONFIGURATION</dt><dd>VTOL FIXED-WING</dd></div>
        <div><dt>LIFT ROTORS</dt><dd>4</dd></div>
        <div><dt>ENDURANCE</dt><dd>240 MIN</dd></div>
        <div><dt>RANGE</dt><dd>100 KM</dd></div>
        <div><dt>CRUISE SPEED</dt><dd>108 KM/H</dd></div>
        <div><dt>PAYLOAD</dt><dd>UP TO 5 KG</dd></div>
        <div><dt>SERVICE ALTITUDE</dt><dd>4,500 M</dd></div>
      </dl>
    </div>
  </section>
}
