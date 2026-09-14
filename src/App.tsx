import { Hero } from './sections/Hero'
import { Problem } from './sections/Problem'
import { PerartralAI } from './sections/PerartralAI'
import { Platform } from './sections/Platform'
import { Deliverables } from './sections/Deliverables'
import { Team } from './sections/Team'
import { Contact } from './sections/Contact'
import { SpecSheet } from './sections/SpecSheet'

function TopBar() {
  return (
    <div className="topbar">
      <div className="wide">
        <a className="wordmark" href="#top">
          Perartral / Defence
        </a>
        <nav>
          <a href="#problem">Problem</a>
          <a href="#perartral-ai">Perartral AI</a>
          <a href="#platform">Anvik</a>
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
        <Problem />
        <PerartralAI />
        <Platform />
        <Deliverables />
        <Team />
        <Contact />
      </main>
      <footer className="site-footer">
        <div className="wide">
          <span>Perartral Technologies · Defence Vertical</span>
          <span>V-Nest, VIT Chennai</span>
          <span>Concept demonstrator — figures from Perartral’s concept note</span>
        </div>
      </footer>
      <SpecSheet />
    </>
  )
}
