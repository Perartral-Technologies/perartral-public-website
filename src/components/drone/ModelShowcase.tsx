import { useState } from 'react'
import { AirframeViewer } from './AirframeViewer'
import { useInView } from '../../hooks/useInView'

type ModelSpec = {
  id: string
  name: string
  category: string
  tagline: string
  description: string
  source?: string
  specs: Record<string, string>
  status: 'ready' | 'coming'
}

const models: ModelSpec[] = [
  {
    id: 'atva-2',
    name: 'ATVA 2.0',
    category: 'VTOL FIXED-WING ISR',
    tagline: 'Range, Reimagined.',
    description:
      'The ATVA 2.0 is a hybrid VTOL fixed-wing that lifts vertically like a multirotor and transitions to efficient forward cruise. Four lift rotors for departure, one pusher for the journey. Built for persistent coastal and maritime surveillance with 4-hour endurance and 100 km range.',
    source: '/models/drone-vtol.glb',
    specs: {
      Endurance: '240 MIN',
      Range: '100 KM',
      'Cruise Speed': '108 KM/H',
      Payload: 'UP TO 5 KG',
      'Service Altitude': '4,500 M',
      Configuration: 'VTOL FIXED-WING',
    },
    status: 'ready',
  },
  {
    id: 'atva-1',
    name: 'ATVA 1.0',
    category: 'FIXED-WING CARGO',
    tagline: 'India\'s First.',
    description:
      'The original ATVA platform, India\'s first DGCA-certified fixed-wing cargo drone. Day and night operations with autonomous waypoint navigation. The foundation of the ATVA family, proven in field trials with the Indian Army and India Post.',
    specs: {
      Endurance: '90 MIN',
      Range: '50 KM',
      'Cruise Speed': '80 KM/H',
      Payload: 'UP TO 3 KG',
      'Service Altitude': '3,000 M',
      Configuration: 'FIXED-WING',
    },
    status: 'coming',
  },
  {
    id: 'atva-1.5',
    name: 'ATVA 1.5',
    category: 'LONG-ENDURANCE ISR',
    tagline: '4 Hours On Station.',
    description:
      'A long-endurance fixed-wing ISR platform designed for coastal and maritime surveillance. Four hours on a single charge, one aircraft covers a full patrol window that would take six multirotor sorties. Designed for gusty winds and high-altitude operations.',
    specs: {
      Endurance: '240 MIN',
      Range: '100 KM',
      'Cruise Speed': '108 KM/H',
      Payload: 'UP TO 5 KG',
      'Service Altitude': '4,500 M',
      Weight: '16-20 KG',
    },
    status: 'coming',
  },
  {
    id: 'anvik',
    name: 'ANVIK',
    category: 'ISR QUADCOPTER',
    tagline: 'Property Intelligence.',
    description:
      'A portable, ruggedised quadcopter carrying Perartral\'s AI analytics for property intelligence. One operator carries and launches it in minutes. AI-driven encroachment detection, boundary survey, and tracking of illegal activity on government-owned property.',
    source: '/models/drone.glb',
    specs: {
      Endurance: 'UP TO 100 MIN',
      Range: 'UP TO 10 KM',
      'Wind Resistance': '30 KNOTS',
      Payload: 'UP TO 1 KG',
      'Max Speed': '40 KM/H',
      Battery: 'LI-ION',
    },
    status: 'ready',
  },
  {
    id: 'edgehawk',
    name: 'EDGEHAWK',
    category: 'TACTICAL SURVEILLANCE',
    tagline: 'Edge-Deployed AI.',
    description:
      'A compact tactical surveillance platform with on-edge AI processing. Designed for rapid deployment in urban and wilderness environments, delivering real-time intelligence without cloud dependency. Built for the modern battlefield.',
    specs: {
      Endurance: '60 MIN',
      Range: '15 KM',
      'AI Processing': 'ON-EDGE',
      Payload: 'UP TO 0.8 KG',
      'Max Speed': '55 KM/H',
      Weight: '2.1 KG',
    },
    status: 'coming',
  },
]

export function ModelShowcase() {
  const [active, setActive] = useState(0)
  const { ref, inView } = useInView({ threshold: 0.1 })
  const current = models[active]

  return (
    <section ref={ref} className="model-showcase">
      <div className="model-showcase-inner">
        <div className="model-showcase-header">
          <p className={`eyebrow anim-reveal ${inView ? 'visible' : ''}`}><span className="label-bracket">AERIAL PLATFORMS</span></p>
          <h2 className={`anim-reveal ${inView ? 'visible' : ''}`} style={{ transitionDelay: '.1s' }}>
            FIVE PLATFORMS,<br /><em>ONE MISSION.</em>
          </h2>
          <p className={`model-showcase-sub anim-reveal ${inView ? 'visible' : ''}`} style={{ transitionDelay: '.2s' }}>
            From long-endurance coastal ISR to tactical edge AI, the Perartral family covers every operational tempo.
          </p>
        </div>

        <div className="model-showcase-grid">
          <div className="model-tabs">
            {models.map((m, i) => (
              <button
                key={m.id}
                className={`model-tab ${i === active ? 'active' : ''} ${m.status === 'coming' ? 'coming' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="model-tab-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="model-tab-info">
                  <span className="model-tab-name">{m.name}</span>
                  <span className="model-tab-cat">{m.category}</span>
                </div>
                {m.status === 'coming' && <span className="model-tab-badge">SOON</span>}
              </button>
            ))}
          </div>

          <div className="model-viewer-panel">
            <div className="model-viewer-frame">
              {current.source ? (
                <AirframeViewer source={current.source} label={`${current.name} · INTERACTIVE 3D`} fov={34} turn={-0.5} />
              ) : (
                <div className="model-viewer-placeholder">
                  <div className="placeholder-glow" />
                  <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="placeholder-icon">
                    <circle cx="60" cy="60" r="56" stroke="var(--gold)" strokeWidth="1" opacity=".3" />
                    <path d="M60 30 L60 90 M30 60 L90 60" stroke="var(--gold)" strokeWidth="1" opacity=".5" />
                    <circle cx="60" cy="60" r="8" fill="var(--gold)" opacity=".15" />
                    <circle cx="60" cy="60" r="3" fill="var(--gold)" opacity=".4" />
                  </svg>
                  <span className="placeholder-label">[ 3D MODEL COMING SOON ]</span>
                </div>
              )}
              <div className="model-viewer-label">[ {current.name} ]</div>
              {current.source && (
                <div className="model-viewer-controls">
                  <span>[ DRAG TO ROTATE ]</span>
                  <span>[ SCROLL TO ZOOM ]</span>
                </div>
              )}
            </div>

            <div className="model-viewer-info">
              <div className="model-viewer-head">
                <p className="eyebrow"><span className="label-bracket">{current.category}</span></p>
                <h3>{current.name}</h3>
                <p className="model-tagline">{current.tagline}</p>
              </div>
              <p className="model-description">{current.description}</p>
              <div className="model-specs-grid">
                {Object.entries(current.specs).map(([key, val]) => (
                  <div key={key} className="model-spec-item">
                    <span className="model-spec-key">{key.toUpperCase()}</span>
                    <span className="model-spec-val">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
