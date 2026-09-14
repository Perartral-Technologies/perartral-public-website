import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { DroneScene } from './components/drone/DroneScene'
import { VtolSection } from './components/drone/VtolSection'
import { ModelShowcase } from './components/drone/ModelShowcase'
import { Logo } from './components/ui/Logo'
import { ScrollIndicator } from './components/ui/ScrollIndicator'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useInView } from './hooks/useInView'

const highlights = [
  ['01', '48 MIN', 'Intelligent flight time'],
  ['02', '8K HDR', 'Stabilized optical system'],
  ['03', '360\u00b0', 'Omnidirectional sensing'],
]

const platforms = [
  {
    name: 'ATVA 2.0',
    category: 'VTOL FIXED-WING ISR',
    desc: 'Hybrid VTOL fixed-wing that lifts vertically and transitions to efficient forward cruise. 4-hour endurance, 100 km range, designed for coastal surveillance.',
    specs: [['ENDURANCE', '240 MIN'], ['RANGE', '100 KM'], ['SPEED', '108 KM/H'], ['PAYLOAD', '5 KG']],
  },
  {
    name: 'M50',
    category: 'HEAVY-LIFT MULTIROTOR',
    desc: 'Fully electric VTOL logistic drone with 43 kg payload capacity. Winch-based delivery from a 10 m \u00d7 10 m clearing. Built for forward-post resupply.',
    specs: [['PAYLOAD', '43 KG'], ['RANGE', '10 KM'], ['ENDURANCE', '30 MIN'], ['VTOL', '10\u00d710 M']],
  },
  {
    name: 'ANVIK',
    category: 'ISR QUADCOPTER',
    desc: 'Portable, ruggedised quadcopter with Perartral AI analytics. One operator carries and launches it in minutes. Property intelligence at the edge.',
    specs: [['ENDURANCE', '100 MIN'], ['RANGE', '10 KM'], ['SPEED', '40 KM/H'], ['PAYLOAD', '1 KG']],
  },
  {
    name: 'EDGEHAWK',
    category: 'TACTICAL SURVEILLANCE',
    desc: 'Compact tactical surveillance platform with on-edge AI processing. Rapid deployment in urban and wilderness environments.',
    specs: [['ENDURANCE', '60 MIN'], ['RANGE', '15 KM'], ['AI', 'ON-EDGE'], ['WEIGHT', '2.1 KG']],
  },
]

export default function App() {
  const scroll = useScrollProgress()
  const page = useRef<HTMLDivElement>(null)
  const { ref: techRef, inView: techVisible } = useInView()
  const { ref: specsRef, inView: specsVisible } = useInView()
  const { ref: platformsRef, inView: platformsVisible } = useInView()

  useEffect(() => {
    const nodes = page.current?.querySelectorAll('.intro-animate')
    if (nodes?.length) animate(nodes, { opacity: [0, 1], translateY: [16, 0], delay: stagger(90), duration: 1000, ease: 'outExpo' })
  }, [])

  return <main ref={page}>
      <div className="scene"><DroneScene scroll={scroll} /></div>

      <nav>
        <a className="brand" href="#top" aria-label="Perartral home"><Logo /></a>
        <div className="nav-links">
          <a href="#platforms">PLATFORMS</a>
          <a href="#airframe">ATVA 2.0</a>
          <a href="#technology">TECHNOLOGY</a>
          <a href="#specs">SPECS</a>
        </div>
        <button className="menu" aria-label="Open menu">menu <b>+</b></button>
      </nav>

      {/* --- hero --- */}
      <section id="top" className="hero section">
        <div className="hero-particles">
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
          <div className="hero-particle" />
        </div>
        <p className="eyebrow intro-animate"><span className="label-bracket">INTRODUCING THE A-01</span></p>
        <h1 className="intro-animate">
          <span className="blur-reveal visible">THE FUTURE</span><br />
          <span className="blur-reveal visible">OF </span>
          <span className="blur-reveal visible"><em>FLIGHT</em></span>
        </h1>
        <div className="hero-accent intro-animate" />
        <p className="lede intro-animate">A new expression of aerial freedom, engineered for the moments that move you.</p>
        <ScrollIndicator />
      </section>

      {/* --- manifesto --- */}
      <section className="manifesto section right-copy">
        <p className="eyebrow"><span className="label-bracket">01 · DESIGNED TO DISAPPEAR</span></p>
        <h2>COMPACT BY<br /><em>INSTINCT.</em></h2>
        <p>Four precision-machined arms rest tightly against a sculpted monocoque body. One movement turns restraint into range.</p>
      </section>

      {/* --- reveal --- */}
      <section className="reveal section">
        <div className="reveal-copy">
          <p className="eyebrow"><span className="label-bracket">02 · AERIAL INTELLIGENCE</span></p>
          <h2>UNFOLD<br />YOUR <em>VIEW.</em></h2>
          <p>Independent arm sequencing creates an effortless transition from carry to capture.</p>
        </div>
        <div className="vertical-label">PERARTRAL / A-01 / 2026</div>
      </section>

      {/* --- engineering overlay --- */}
      <section className="engineering-scroll" aria-label="Drone engineering view">
        <div className="engineering-stage" />
      </section>

      {/* --- ATVA 2.0 showcase --- */}
      <VtolSection />

      {/* --- model showcase (all platforms) --- */}
      <ModelShowcase />

      {/* --- technology --- */}
      <section id="technology" className="technology section" ref={techRef}>
        <p className="eyebrow anim-reveal" style={techVisible ? { opacity: 1, transform: 'translateY(0)' } : undefined}>
          <span className="label-bracket">04 · PRECISION ENGINEERED</span>
        </p>
        <h2 className="anim-reveal" style={techVisible ? { opacity: 1, transform: 'translateY(0)', transitionDelay: '.1s' } : undefined}>
          EVERY DETAIL,<br /><em>IN ITS PLACE.</em>
        </h2>
        <div className="highlights">
          {highlights.map(([number, title, text], i) => (
            <article key={number} className="anim-reveal" style={techVisible ? { opacity: 1, transform: 'translateY(0)', transitionDelay: `${0.15 + i * 0.1}s` } : undefined}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* --- specifications --- */}
      <section id="specs" className="specifications section" ref={specsRef}>
        <p className="eyebrow anim-reveal" style={specsVisible ? { opacity: 1, transform: 'translateY(0)' } : undefined}>
          <span className="label-bracket">05 · CONCEPT SPECIFICATIONS</span>
        </p>
        <h2 className="anim-reveal" style={specsVisible ? { opacity: 1, transform: 'translateY(0)', transitionDelay: '.1s' } : undefined}>
          ENGINEERED<br />TO <em>ENDURE.</em>
        </h2>
        <div className="spec-grid">
          {[
            ['FLIGHT TIME', '42 MIN'],
            ['MAX SPEED', '68 KM/H'],
            ['TRANSMISSION', '15 KM'],
            ['CAMERA', '4K / 60 FPS'],
            ['WEIGHT', '895 G'],
          ].map(([label, value], i) => (
            <p key={label} className="anim-reveal" style={specsVisible ? { opacity: 1, transform: 'translateY(0)', transitionDelay: `${0.1 + i * 0.06}s` } : undefined}>
              <span>{label}</span><b>{value}</b>
            </p>
          ))}
        </div>
      </section>

      {/* --- platform overview --- */}
      <section id="platforms" className="platform-section" ref={platformsRef}>
        <p className="eyebrow anim-reveal" style={platformsVisible ? { opacity: 1, transform: 'translateY(0)' } : undefined}>
          <span className="label-bracket">AERIAL PLATFORMS</span>
        </p>
        <h2 className="anim-reveal" style={platformsVisible ? { opacity: 1, transform: 'translateY(0)', transitionDelay: '.1s' } : undefined}>
          THE PERARTRAL<br /><em>FAMILY.</em>
        </h2>
        <div className="platform-grid">
          {platforms.map((p, i) => (
            <article
              key={p.name}
              className="anim-reveal"
              style={platformsVisible ? { opacity: 1, transform: 'translateY(0)', transitionDelay: `${0.15 + i * 0.1}s` } : undefined}
            >
              <p className="platform-card-cat">{p.category}</p>
              <h3 className="platform-card-name">{p.name}</h3>
              <p className="platform-card-desc">{p.desc}</p>
              <div className="platform-card-specs">
                {p.specs.map(([k, v]) => (
                  <div key={k} className="platform-card-spec">
                    <span>{k}</span><span>{v}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --- closing --- */}
      <section className="final section">
        <p className="eyebrow"><span className="label-bracket">READY WHEN YOU ARE</span></p>
        <h2>SEE THE WORLD<br />FROM <em>ELSEWHERE.</em></h2>
        <div className="actions">
          <a className="button primary" href="#top">EXPLORE THE DRONE <b>\u2197</b></a>
          <a className="button" href="#platforms">VIEW PLATFORMS <b>\u2193</b></a>
        </div>
        <footer>
          <span>\u00a9 2026 PERARTRAL</span>
          <span>MADE FOR THE UNDISCOVERED</span>
        </footer>
      </section>
    </main>
  }
