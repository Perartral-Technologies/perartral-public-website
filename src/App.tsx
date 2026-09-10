import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import { DroneScene } from './components/drone/DroneScene'
import { ScrollIndicator } from './components/ui/ScrollIndicator'
import { useScrollProgress } from './hooks/useScrollProgress'

const highlights = [
  ['01', '48 MIN', 'Intelligent flight time'],
  ['02', '8K HDR', 'Stabilized optical system'],
  ['03', '360°', 'Omnidirectional sensing'],
]

export default function App() {
  const scroll = useScrollProgress(); const page = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const nodes = page.current?.querySelectorAll('.intro-animate')
    if (nodes?.length) animate(nodes, { opacity: [0, 1], translateY: [18, 0], delay: stagger(85), duration: 900, ease: 'outExpo' })
  }, [])
  return <main ref={page}>
    <div className="scene"><DroneScene scroll={scroll} /></div>
    <nav><a className="brand" href="#top">AERION<span>°</span></a><div className="nav-links"><a href="#technology">TECHNOLOGY</a><a href="#specs">SPECIFICATIONS</a></div><button className="menu" aria-label="Open menu">MENU <b>+</b></button></nav>
    <section id="top" className="hero section">
      <p className="eyebrow intro-animate">INTRODUCING THE A-01</p>
      <h1 className="intro-animate">THE FUTURE<br />OF <em>FLIGHT</em></h1>
      <p className="lede intro-animate">A new expression of aerial freedom, engineered for the moments that move you.</p>
      <ScrollIndicator />
    </section>
    <section className="manifesto section right-copy">
      <p className="eyebrow">01 — DESIGNED TO DISAPPEAR</p>
      <h2>COMPACT BY<br /><em>INSTINCT.</em></h2>
      <p>Four precision-machined arms rest tightly against a sculpted monocoque body. One movement turns restraint into range.</p>
    </section>
    <section className="reveal section">
      <div className="reveal-copy"><p className="eyebrow">02 — AERIAL INTELLIGENCE</p><h2>UNFOLD<br />YOUR <em>VIEW.</em></h2><p>Independent arm sequencing creates an effortless transition from carry to capture.</p></div>
      <div className="vertical-label">AERION / A-01 / 2026</div>
    </section>
    <section className="engineering-scroll" aria-label="Drone engineering view"><div className="engineering-stage" /></section>
    <section id="technology" className="technology section">
      <p className="eyebrow">03 — PRECISION ENGINEERED</p>
      <h2>EVERY DETAIL,<br /><em>IN ITS PLACE.</em></h2>
      <div className="highlights">{highlights.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>
    <section id="specs" className="specifications section">
      <p className="eyebrow">04 — CONCEPT SPECIFICATIONS</p><h2>ENGINEERED<br />TO <em>ENDURE.</em></h2>
      <div className="spec-grid"><p><span>FLIGHT TIME</span><b>42 MIN</b></p><p><span>MAX SPEED</span><b>68 KM/H</b></p><p><span>TRANSMISSION</span><b>15 KM</b></p><p><span>CAMERA</span><b>4K / 60 FPS</b></p><p><span>WEIGHT</span><b>895 G</b></p></div>
    </section>
    <section className="final section">
      <p className="eyebrow">READY WHEN YOU ARE</p><h2>SEE THE WORLD<br />FROM <em>ELSEWHERE.</em></h2>
      <div className="actions"><a className="button primary" href="#top">EXPLORE THE DRONE <b>↗</b></a><a className="button" href="#technology">SPECIFICATIONS <b>↓</b></a></div>
      <footer>© 2026 AERION SYSTEMS <span>MADE FOR THE UNDISCOVERED</span></footer>
    </section>
  </main>
}
