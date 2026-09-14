import { Hero } from './sections/Hero'
import { Glance } from './sections/Glance'
import { Missions } from './sections/Missions'
import { PerartralAI } from './sections/PerartralAI'
import { Platform } from './sections/Platform'
import { Engineering } from './sections/Engineering'
import { Fleet } from './sections/Fleet'
import { Partnership } from './sections/Partnership'
import { Roadmap } from './sections/Roadmap'
import { Team } from './sections/Team'
import { Contact } from './sections/Contact'
import { SpecSheet } from './sections/SpecSheet'

function TopBar() {
  return (
    <div className="topbar">
      <div className="wide">
        <a className="wordmark" href="#top">
          <img src="/favicon.png" alt="" className="wm-mark" />
          Perartral <span>/ Defence</span>
        </a>
        <nav>
          <a href="#missions">Mission set</a>
          <a href="#perartral-ai">Perartral AI</a>
          <a href="#anvik">Anvik</a>
          <a href="#platforms">Platforms</a>
          <a href="#partnership">Partnership</a>
          <a href="#contact">Briefing</a>
        </nav>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <Glance />
        <Missions />
        <PerartralAI />
        <Platform />
        <Engineering />
        <Fleet />
        <Partnership />
        <Roadmap />
        <Team />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="wide">
          <span>Perartral Technologies · Defence Vertical</span>
          <span>V-Nest, VIT Chennai · Incubated deep-tech start-up</span>
          <span>In technology partnership with Amber Wings Pvt. Ltd. (IIT Madras incubated)</span>
        </div>
      </footer>
      <SpecSheet />
    </>
  )
}
