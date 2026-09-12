import { useEffect } from 'react'
import { Logo } from '../components/ui/Logo'
import { AirframeViewer } from '../components/drone/AirframeViewer'
import './defence.css'

/**
 * Defence vertical concept note for MHA / CRPF.
 *
 * This is an UNLISTED route — it is not linked from the public landing page.
 * The note is marked confidential and includes unfilled compliance items, so it
 * is explicitly marked noindex rather than relying on obscurity alone, and
 * public/robots.txt disallows both paths that reach it.
 */

const glance = [
  ['43 kg', 'PAYLOAD CAPACITY OF THE M50 PLATFORM OFFERED AGAINST THE 40 kg QR'],
  ['240 min', 'ENDURANCE FIXED-WING ISR PLATFORM FOR COASTAL SURVEILLANCE'],
  ['2027–28', "TARGET FOR PERARTRAL'S OWN UAV MANUFACTURING UNIT"],
]

const pillars = [
  ['DEDICATED DEFENCE VERTICAL', 'Separate business unit focused on CAPF, coastal and internal-security requirements.'],
  ['SIX-MEMBER CORE TEAM + INTERNS', 'AI, embedded systems, autonomy, GCS software and integration engineers.'],
  ['ISRO-CALIBRE MENTORSHIP', 'Mentor R. R. Elangovan, former ISRO scientist and GSLV Mk-I core team member; Prof. Praveen Joe, faculty coordinator.'],
  ['MANUFACTURING PARTNERSHIP', 'Amber Wings (IIT Madras) manufactures to our specification with full product ownership and OEM certification transferred to Perartral.'],
]

const programmes = [
  ['PS 1', 'Medium Logistic Drone · 40 kg payload', 'Autonomous resupply of forward posts, casualty-support and stores movement in LWE and high-altitude terrain where roads are absent or unsafe.', 'M50 HEAVY-LIFT MULTIROTOR'],
  ['PS 2', 'Coastal & Maritime Surveillance', 'Persistent monitoring of the 11,098 km coastline and creek networks for infiltration, smuggling and illegal fishing.', 'ATVA LONG-ENDURANCE FIXED-WING'],
  ['PS 3', 'Property ISR & AI-based Detection (CEPI)', 'Encroachment detection, boundary survey and tracking of illegal activity on government-owned property.', 'ANVIK PORTABLE ISR QUADCOPTER + PERARTRAL AI'],
]

const logisticParams: [string, string][] = [
  ['Payload', '40 kg ± 5%, gyro-stabilised, winch release'],
  ['Launch / recovery', 'VTOL within 15 m × 15 m'],
  ['Endurance', '45 ± 5 min at 1,000 m AMSL with max payload'],
  ['Mission range', '10 km one-way minimum'],
  ['Altitude', 'Launch up to 4,000 m AMSL; 500 m AGL operating'],
  ['Speed / wind', '40 km/h cruise; 40 km/h wind tolerance'],
  ['Autonomy', 'Autonomous, waypoint, 360° obstacle avoidance, failsafes'],
  ['Sensors', 'Day 1080p/10x + night 640×512/4x gimbal, live downlink'],
  ['Comms', 'AES-256 encrypted, S/C-band with FHSS'],
  ['Support', '1,000 landings, 2-yr warranty, 5-yr support, MRLS'],
]

const m50Specs: [string, string][] = [
  ['Payload', 'Up to 43 kg'],
  ['Range', 'Up to 10 km'],
  ['Endurance', 'Up to 30 min'],
  ['Wind resistance', '20 knots'],
  ['Max speed', '40 km/h'],
  ['Operating altitude', '1,000 m'],
  ['Propulsion', 'Electric, Li-ion'],
  ['Launch / recovery', 'VTOL'],
  ['Payload release', 'Winch-based'],
]

const compliance: Array<{ state: 'ok' | 'mid' | 'todo'; title: string; items: string[] }> = [
  {
    state: 'ok', title: 'COMPLIANT TODAY', items: [
      'Payload 40 kg ± 5% with gyro stabilisation and winch release',
      'VTOL launch/recovery within 15 m × 15 m; all-up kit ≤ 250 kg',
      'Fully electric; autonomous / assisted / hover / manual modes',
      'Dynamic waypoint navigation; comms-loss and low-battery failsafes; multi-GNSS',
      'Day 1080p/10x and night 640×512/4x gimbal, live downlink',
      'Rugged 10" IP65 GCS, 2D/3D mapping, 90 min backup',
      'AES-256 link, S/C-band FHSS; 2-yr warranty, 5-yr support, MRLS',
    ],
  },
  {
    state: 'mid', title: 'BEING UPGRADED (CRPF VARIANT)', items: [
      'Endurance: 30 min → 45 ± 5 min at 1,000 m AMSL (higher-capacity battery pack)',
      'Range: 8 km → 10 km one-way (link + battery upgrade)',
      'Cruise / wind: 28 km/h → 40 km/h (motor-propeller re-sizing)',
      'Obstacle avoidance: uni-directional → 360° proximity sensing',
    ],
  },
  {
    state: 'todo', title: 'TO BE TESTED & CERTIFIED', items: [
      'Launch altitude 4,000 m AMSL, high-altitude trials proposed at the Aug 2026 demo sites',
      'Aural signature ≤ 50 dBA at 400 m AGL, NABL lab test',
      'JSS 55555 temperature / damp-heat, IP54 airframe, MIL-STD-810G GCS',
      'GNSS and RF anti-jamming (optional QR items), evaluation with mentor guidance',
    ],
  },
]

const coastalNeeds: [string, string][] = [
  ['Endurance', '3–4 hours on station per sortie'],
  ['Reach', '100 km operational radius from launch point'],
  ['Weather', 'Stable in gusty coastal winds; day and night'],
  ['Payload', 'Stabilised EO/IR gimbal, live encrypted video'],
  ['Analytics', 'Automatic vessel and landing detection, geo-tagged alerts'],
  ['Deployment', 'VTOL or short-field launch from beach outposts'],
]

const atvaSpecs: [string, string][] = [
  ['Endurance', '240 min'],
  ['Operational range', '100 km'],
  ['Cruise speed', '108 km/h'],
  ['Payload', 'Up to 5 kg'],
  ['Service altitude', '4,500 m'],
  ['Overall weight', '16–20 kg'],
  ['Dimensions', '3.0 × 2.5 m'],
  ['Launch / recovery', 'VTOL'],
  ['Propulsion', 'Electric'],
]

const propertyNeeds: [string, string][] = [
  ['Land encroachment', 'Boundary overlay from revenue records; new structures and fences flagged automatically'],
  ['Survey & mapping', 'Orthomosaic and 3D terrain of the property; area and change reports per visit'],
  ['Illegal activity tracking', 'Detection of mining, dumping, vehicles and gatherings; movement tracked across frames'],
  ['Perimeter & camp security', 'Scheduled patrol flights with intrusion alerts to the guard room'],
  ['Evidence generation', 'Time-stamped, geo-tagged imagery packaged for legal and administrative action'],
  ['Face & object recognition', 'Person of interest matching and vehicle identification at the edge'],
]

const anvikSpecs: [string, string][] = [
  ['Endurance', 'Up to 100 min'],
  ['Range', 'Up to 10 km'],
  ['Wind resistance', '30 knots'],
  ['Payload', 'Up to 1 kg'],
  ['Max speed', '40 km/h'],
  ['Battery', 'Li-ion'],
]

const aiSteps = [
  ['Capture', 'Anvik flies scheduled survey and patrol routes; EO/IR frames geo-tagged'],
  ['Map', 'Orthomosaic stitched and aligned to survey boundaries from revenue / cadastral records'],
  ['Detect', 'Vision models find structures, vehicles, persons, excavation and dumping; change detection vs baseline'],
  ['Track', 'Objects followed across frames and sorties; movement patterns and repeat offenders logged'],
  ['Report', 'Alerts to a web dashboard; evidence pack with imagery, coordinates and timestamps'],
]

const perartralRole = [
  'Requirement analysis, mission design and QR compliance engineering',
  'AI models, autonomy software, ground control station and dashboards',
  'System integration, acceptance testing, field trials with the force',
  'Training, MRLS spares, 2-year warranty and 5-year lifecycle support',
  'Holds full product ownership and OEM certification for every airframe built for us',
]

const amberRole = [
  'IIT Madras incubated; wholly owned subsidiary of Ubifly Technologies (The ePlane Co.), founded 2019 by Prof. Satya Chakravarthy',
  '130+ engineers; DGCA type-certified agri and cargo drones; Synergistic Lift patent with 40+ in pipeline',
  'Q20 trialled with the Indian Army (munition drop) and India Post (9.8 kg over 15 km)',
  "Manufactures M50, ATVA and Anvik airframes to Perartral's specification",
  'Transfers ownership of manufactured product; OEM certificate issued within 3 working days',
]

const commercial = [
  ['Single point of accountability', 'MHA/CRPF contracts with Perartral; OEM authorisation and product ownership documents submitted with the formal bid.'],
  ['Build-to-spec, then scale', 'Prototype and trial units manufactured by Amber Wings; production batches follow the same certified process.'],
  ['Own manufacturing by 2027–28', "Perartral's manufacturing unit planned by end-2027 / 2028 to bring airframe assembly in-house."],
  ['Software & AI as the differentiator', 'Autonomy, analytics and GCS remain Perartral IP across all three platforms.'],
]

const people = [
  ['VISHNU PAANDIAN', 'Founder & CEO, Perartral Technologies', 'Leads product strategy and the defence vertical; named contact for MHA / CRPF correspondence.'],
  ['R. R. ELANGOVAN', 'Mentor · Aerospace & Systems', 'Former ISRO scientist and core team member of the GSLV Mk-I project. Guides airworthiness, propulsion sizing and test methodology.'],
  ['PROF. PRAVEEN JOE', 'Campus Faculty Coordinator, VIT Chennai', 'Institutional interface for the project; coordinates the student engineering pool, lab access and academic oversight.'],
]

const roadmap: Array<{ quarter: string; title: string; items: string[] }> = [
  {
    quarter: 'Q3–Q4 2026', title: 'Engage & demonstrate', items: [
      'Concept note and team details to MHA / CRPF',
      'OEM authorisation and compliance matrix submitted',
      'NCNC field demonstration of M50, ATVA and Anvik',
      'Perartral Defence website live',
    ],
  },
  {
    quarter: 'Q1–Q2 2027', title: 'Certify the CRPF variant', items: [
      'M50-C upgrades: 45 min endurance, 10 km range, 40 km/h cruise, 360° obstacle avoidance',
      'NABL / JSS 55555 / MIL-STD tests',
      'AI detection model trained on Indian terrain data',
    ],
  },
  {
    quarter: 'Q3–Q4 2027', title: 'Trial & first supply', items: [
      'User trials with CRPF units and CEPI properties',
      'First production batch through Amber Wings under Perartral OEM',
      'Operator training and support desk established',
    ],
  },
  {
    quarter: '2027 END – 2028', title: 'In-house manufacturing', items: [
      'Perartral manufacturing and integration unit commissioned',
      'Airframe assembly, payload integration and MRO in-house',
      'Scale to state police and other CAPFs',
    ],
  },
]

const asks = [
  'Slot in the NCNC field demonstration for M50 (logistics), ATVA (coastal ISR) and Anvik (property ISR)',
  'Access to a CEPI property for a pilot AI-based survey and encroachment audit',
  'Guidance on QR finalisation so the CRPF variant is certified to the final specification',
]

export function DefencePage() {
  // Belt-and-braces with robots.txt: a noindex tag in the document itself, so
  // the page stays out of indexes even if it is linked from somewhere.
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow, noarchive'
    document.head.appendChild(meta)
    const previousTitle = document.title
    document.title = 'Defence Vertical · Concept Note | Perartral Technologies'
    return () => {
      meta.remove()
      document.title = previousTitle
    }
  }, [])

  return <div className="dossier">
    <header className="ds-topbar">
      <Logo />
      <span className="ds-topbar-tag">DEFENCE VERTICAL</span>
      <span className="ds-confidential">CONFIDENTIAL · NOT FOR PUBLIC DISTRIBUTION</span>
    </header>

    {/* ------------------------------------------------ cover */}
    <section className="ds-cover">
      <div className="ds-wrap">
        <p className="ds-kicker">DEFENCE VERTICAL · CONCEPT NOTE</p>
        <h1>Unmanned Aerial Systems for <em>Internal Security</em> Operations</h1>
        <p className="ds-cover-sub">
          Concept Note • Medium Logistic Drone (40 kg) • Coastal Surveillance • Property ISR with AI Detection
        </p>
        <dl className="ds-cover-meta">
          <div>
            <dt>SUBMITTED TO</dt>
            <dd><b>Ministry of Home Affairs / CRPF</b><br />Communication Directorate, QR Cell</dd>
          </div>
          <div>
            <dt>REFERENCE</dt>
            <dd>B.V-7-C/2026-27-C (UAV Demo)-QR Cell<br />Draft QRs/TDs, Medium Category Logistic Drone, March 2026</dd>
          </div>
          <div>
            <dt>PREPARED BY</dt>
            <dd><b>Perartral Technologies</b><br />V-Nest, VIT Chennai • September 2026</dd>
          </div>
          <div>
            <dt>TECHNOLOGY PARTNERSHIP</dt>
            <dd>Amber Wings Pvt. Ltd.<br />IIT Madras incubated, a subsidiary of Ubifly Technologies / The ePlane Co.</dd>
          </div>
        </dl>
      </div>
    </section>

    {/* ------------------------------------------------ 01 who we are */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">01</span><h2>Who We Are</h2></div>
        <p className="ds-lede">
          A deep-tech start-up building AI-driven autonomy for defence and civil security. Perartral Technologies is
          incubated at V-Nest, VIT Chennai. Our Defence Vertical brings together aerospace mentorship, an AI/robotics
          engineering core, and an IIT Madras-incubated UAV manufacturer to deliver mission-ready aerial systems to
          India's Central Armed Police Forces.
        </p>
        <div className="ds-grid">
          {pillars.map(([title, body]) => <article className="ds-card" key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>)}
        </div>
        <p className="ds-label" style={{ marginTop: 'clamp(38px, 4.5vw, 56px)' }}>PERARTRAL AT A GLANCE</p>
        <div className="ds-stats">
          {glance.map(([figure, caption]) => <div className="ds-stat" key={figure}>
            <b>{figure}</b><span>{caption}</span>
          </div>)}
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 02 programmes */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">02</span><h2>Three Problem Statements, Three Platforms</h2></div>
        <p className="ds-lede">Mapped to the MHA Problem Statement Compendium 2026 and CRPF draft QRs.</p>
        <div className="ds-ps">
          {programmes.map(([num, title, body, platform]) => <article key={num}>
            <span className="ds-ps-num">{num}</span>
            <h3>{title}</h3>
            <p>{body}</p>
            <span className="ds-ps-platform">{platform}</span>
          </article>)}
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 03 PS1 */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">03</span><h2>PS 1: Medium Logistic Drone (40 kg)</h2></div>
        <p className="ds-lede">CRPF Communication &amp; IT Directorate · Draft QRs/TDs, 40 kg payload category, March 2026.</p>

        <div className="ds-split" style={{ marginTop: 'clamp(34px, 4vw, 50px)' }}>
          <div>
            <p className="ds-label">THE OPERATIONAL GAP</p>
            <ul className="ds-list">
              <li>Forward posts in LWE-affected districts, J&amp;K and the North-East depend on road convoys and porters for rations, medical stores, batteries and ammunition, routes that are <b>IED-prone and weather-dependent</b>.</li>
              <li>Helicopter lift is scarce and expensive; small commercial drones carry under 10 kg and cannot sustain a post.</li>
              <li>CRPF has therefore framed a 40 kg-class VTOL logistic drone that a 4-person team can deploy from a 15 m × 15 m clearing, fly 10 km one-way, and recover autonomously.</li>
            </ul>
            <div className="ds-commit" style={{ marginTop: 'clamp(24px, 3vw, 34px)' }}>
              <p className="ds-label" style={{ marginBottom: '10px' }}>FIELD DEMONSTRATION</p>
              <b>No-Cost-No-Commitment field demo</b> called by CRPF QR Cell (Aug 2026) at Kashmir Valley / Uttarakhand —
              Perartral has registered an Expression of Interest.
            </div>
          </div>
          <div>
            <p className="ds-label">KEY QR PARAMETERS (DRAFT)</p>
            <dl className="ds-specs">
              {logisticParams.map(([k, v]) => <div key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 04 M50 */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">04</span><h2>Solution: M50 Heavy-Lift Logistic Drone</h2></div>
        <p className="ds-lede">
          Manufactured by Amber Wings to Perartral specification; ownership and OEM certification held by Perartral.
        </p>
        <div className="ds-split" style={{ marginTop: 'clamp(34px, 4vw, 50px)' }}>
          <div className="platform-pending">
            <div className="platform-pending-glow" />
            <span>M50 HEAVY-LIFT PLATFORM<br />3D MODEL TO FOLLOW</span>
          </div>
          <div>
            <ul className="ds-list">
              <li>Fully electric, <b>VTOL from a 10 m × 10 m clearing</b>, no runway, no launcher.</li>
              <li><b>Winch-based slung-load delivery:</b> drops stores without landing at the post.</li>
              <li>Fully autonomous waypoint missions with assisted, hover and manual modes; RTH on link loss or low battery.</li>
              <li>Day/night gimbal camera with live video to a rugged, sunlight-readable GCS.</li>
              <li>Same airframe family as the Q20 already trialled with the Indian Army and India Post.</li>
            </ul>
            <p className="ds-label" style={{ marginTop: '34px' }}>PLATFORM SPECIFICATIONS</p>
            <dl className="ds-specs">
              {m50Specs.map(([k, v]) => <div key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
        <div className="ds-commit">
          <b>Positioning for CRPF.</b> The M50 carries 43 kg, exceeding the 40 kg requirement and giving margin for the
          40 kg ± 5% payload with gyro-stabilisation and winch hardware. Perartral supplies the mission software, GCS,
          AI payloads, training and 5-year lifecycle support; Amber Wings supplies airframe manufacturing under
          Perartral's OEM certification.
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 05 compliance */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">05</span><h2>M50 vs CRPF Draft QR: Compliance &amp; Upgrade Path</h2></div>
        <p className="ds-lede">
          Transparent self-assessment against the 43-parameter QR, full compliance matrix supplied with formal submission.
        </p>
        <div className="ds-compliance">
          {compliance.map(({ state, title, items }) => <div className="ds-panel" key={title}>
            <div className="ds-panel-head">
              <span className={`ds-dot ${state}`} aria-hidden="true" />
              <h3>{title}</h3>
            </div>
            <ul className="ds-list">
              {items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          </div>)}
        </div>
        <div className="ds-commit">
          <b>Our commitment:</b> every parameter marked 'being upgraded' will be demonstrated in the CRPF field trial;
          parameters marked 'to be tested' will carry Government/NABL-lab certificates before supply.
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 06 PS2 */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">06</span><h2>PS 2: Coastal &amp; Maritime Surveillance</h2></div>
        <p className="ds-lede">Persistent aerial watch over India's coastline, creeks and island territories.</p>
        <div className="ds-split" style={{ marginTop: 'clamp(34px, 4vw, 50px)' }}>
          <div>
            <p className="ds-label">THE OPERATIONAL GAP</p>
            <ul className="ds-list">
              <li>India's <b>11,098 km coastline</b>, mangrove deltas such as the Sundarbans, and thousands of fishing craft create a porous boundary that patrol boats and fixed cameras cannot watch continuously.</li>
              <li>Threats include sea-borne infiltration, narcotics and arms smuggling, illegal fishing, encroachment on coastal property and vessels switching off transponders.</li>
              <li>Multirotor drones give 30–60 minutes of watch; a single coastal sector needs hours of endurance, 100 km reach and stability in gusty onshore winds.</li>
            </ul>
            <div className="ds-commit" style={{ marginTop: 'clamp(24px, 3vw, 34px)' }}>
              <p className="ds-label" style={{ marginBottom: '10px' }}>WHAT THE FORCE NEEDS</p>
              A long-endurance, hand-recoverable fixed-wing UAV with EO/IR payload and an AI layer that flags vessels,
              landings and movement automatically, reducing operator fatigue and response time.
            </div>
          </div>
          <div>
            <p className="ds-label">REQUIREMENTS</p>
            <dl className="ds-specs">
              {coastalNeeds.map(([k, v]) => <div key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 07 ATVA */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">07</span><h2>Solution: ATVA Long-Endurance ISR</h2></div>
        <p className="ds-lede">
          Autonomous electric fixed-wing VTOL designed for ultra-long ISR missions in gusty, high-altitude conditions.
        </p>
        <div className="ds-split" style={{ marginTop: 'clamp(34px, 4vw, 50px)' }}>
          <AirframeViewer label="ATVA 2.0 · AIRFRAME" />
          <div>
            <ul className="ds-list">
              <li><b>Four hours on a single charge</b>, one aircraft covers a full patrol window that would take six multirotor sorties.</li>
              <li><b>100 km operational range</b> with 108 km/h cruise; designed for gusty winds and 4,500 m altitude.</li>
              <li><b>5 kg payload bay:</b> EO/IR gimbal, plus optional AIS receiver or radio relay.</li>
              <li>Same ATVA family as India's first DGCA-certified fixed-wing cargo drone (day/night operations).</li>
            </ul>
            <p className="ds-label" style={{ marginTop: '34px' }}>PLATFORM SPECIFICATIONS</p>
            <dl className="ds-specs">
              {atvaSpecs.map(([k, v]) => <div key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
        <div className="ds-commit">
          <b>Perartral coastal mission package.</b> Pre-planned sector patrol routes, AI vessel/landing detection running
          on the ground station, geo-tagged alert feed to the sector control room, and multi-aircraft scheduling so one
          team keeps a sector under continuous watch.
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 08 PS3 */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">08</span><h2>PS 3: Property ISR &amp; AI-based Detection</h2></div>
        <p className="ds-lede">For CEPI and force headquarters managing dispersed land, camps and installations.</p>
        <div className="ds-split" style={{ marginTop: 'clamp(34px, 4vw, 50px)' }}>
          <div>
            <p className="ds-label">THE OPERATIONAL GAP</p>
            <ul className="ds-list">
              <li>Central forces and CEPI hold <b>thousands of acres</b> of camps, firing ranges, training grounds and acquired land, much of it remote, unfenced and visited infrequently.</li>
              <li>Encroachment, unauthorised construction, illegal mining or dumping, trespass and theft are discovered late, when eviction and legal action become costly.</li>
              <li>Manual surveys are slow, subjective and hard to compare year on year; static CCTV covers only built-up perimeters.</li>
            </ul>
            <div className="ds-commit" style={{ marginTop: 'clamp(24px, 3vw, 34px)' }}>
              <p className="ds-label" style={{ marginBottom: '10px' }}>WHAT IS NEEDED</p>
              A portable ISR drone paired with an AI model that surveys property boundaries, detects change against a
              baseline map, and tracks people, vehicles and activity, producing evidence-grade reports, not just video.
            </div>
          </div>
          <div>
            <p className="ds-label">CAPABILITIES</p>
            <dl className="ds-specs">
              {propertyNeeds.map(([k, v]) => <div key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></div>)}
            </dl>
          </div>
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 09 Anvik */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">09</span><h2>Solution: Anvik ISR Drone + Perartral AI</h2></div>
        <p className="ds-lede">Portable, ruggedised quadcopter carrying Perartral's AI analytics for property intelligence.</p>
        <div className="ds-split" style={{ marginTop: 'clamp(34px, 4vw, 50px)' }}>
          <div className="platform-pending">
            <div className="platform-pending-glow" />
            <span>ANVIK ISR PLATFORM<br />3D MODEL TO FOLLOW</span>
          </div>
          <div>
            <p className="ds-label">ANVIK PLATFORM</p>
            <dl className="ds-specs">
              {anvikSpecs.map(([k, v]) => <div key={k}><dt>{k.toUpperCase()}</dt><dd>{v}</dd></div>)}
            </dl>
            <div className="ds-commit">
              Extremely low footprint, ruggedised, high modularity, one operator carries and launches it in minutes.
            </div>
          </div>
        </div>

        <p className="ds-label" style={{ marginTop: 'clamp(40px, 5vw, 60px)' }}>PERARTRAL AI DETECTION MODEL</p>
        <ol className="ds-steps">
          {aiSteps.map(([title, body]) => <li key={title}>
            <h4>{title}</h4><p>{body}</p>
          </li>)}
        </ol>
        <div className="ds-deliverables">
          <p className="ds-label">DELIVERABLES TO CEPI / CRPF</p>
          <b>Anvik</b> aircraft with EO/IR gimbal and spares • <b>Perartral AI software</b> (on-premise, no cloud
          dependency) • Property baseline survey and boundary digitisation • Operator training and 5-year software
          support • Integrable with existing CCTV and command-centre feeds.
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 10 business model */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">10</span><h2>Business Model &amp; Manufacturing Partnership</h2></div>
        <p className="ds-lede">Perartral owns the product, the customer relationship and the technology; Amber Wings manufactures.</p>
        <div className="ds-grid">
          <article className="ds-card">
            <span className="ds-card-tag">PERARTRAL TECHNOLOGIES</span>
            <h3>Prime contractor &amp; product owner</h3>
            <ul className="ds-list" style={{ marginTop: '14px' }}>
              {perartralRole.map((it) => <li key={it} style={{ fontSize: '12.5px' }}>{it}</li>)}
            </ul>
          </article>
          <article className="ds-card">
            <span className="ds-card-tag">AMBER WINGS PVT. LTD.</span>
            <h3>Manufacturing &amp; airframe partner</h3>
            <ul className="ds-list" style={{ marginTop: '14px' }}>
              {amberRole.map((it) => <li key={it} style={{ fontSize: '12.5px' }}>{it}</li>)}
            </ul>
          </article>
        </div>
        <p className="ds-label" style={{ marginTop: 'clamp(38px, 4.5vw, 56px)' }}>COMMERCIAL MODEL</p>
        <div className="ds-grid" style={{ marginTop: 0 }}>
          {commercial.map(([title, body]) => <article className="ds-card" key={title}>
            <h3>{title}</h3><p>{body}</p>
          </article>)}
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 11 team */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">11</span><h2>Team, Mentors &amp; Institution</h2></div>
        <p className="ds-lede">
          Detailed profiles are provided in the accompanying 'Team &amp; Institution Details' document.
        </p>
        <div className="ds-commit" style={{ marginTop: 'clamp(28px, 3.5vw, 40px)' }}>
          <b>Institution.</b> Perartral Technologies is a deep-tech start-up incubated at V-Nest, the incubator of
          Vellore Institute of Technology, Chennai Campus. Faculty coordinator: Prof. Praveen Joe.
        </div>
        <div className="ds-grid">
          {people.map(([name, role, body]) => <article className="ds-card" key={name}>
            <span className="ds-card-tag">{role.toUpperCase()}</span>
            <h3>{name}</h3>
            <p>{body}</p>
          </article>)}
        </div>
        <div className="ds-deliverables">
          <b>Core engineering team:</b> six members plus interns. AI/computer vision, embedded systems and flight
          software, autonomy and GCS, systems integration and test, operations and support. Names, roles and
          qualifications are listed in the team document.
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ 12 roadmap */}
    <section className="ds-section">
      <div className="ds-wrap">
        <div className="ds-head"><span className="ds-num">12</span><h2>Execution Roadmap</h2></div>
        <p className="ds-lede">From concept note to certified supply and in-house manufacturing.</p>
        <div className="ds-road">
          {roadmap.map(({ quarter, title, items }) => <article key={quarter}>
            <span className="ds-quarter">{quarter}</span>
            <h3>{title}</h3>
            <ul className="ds-list">
              {items.map((it) => <li key={it} style={{ fontSize: '12.5px' }}>{it}</li>)}
            </ul>
          </article>)}
        </div>
      </div>
    </section>

    {/* ------------------------------------------------ closing */}
    <section className="ds-close">
      <div className="ds-wrap">
        <h2>Ready to demonstrate. <em>Ready to deliver.</em></h2>
        <p className="ds-cover-sub" style={{ color: 'rgba(251,249,245,.78)' }}>
          We request the opportunity to present these three platforms to the CRPF QR Cell and CEPI, and to participate
          in the field demonstration under Ref. B.V-7-C/2026-27-C (UAV Demo)-QR Cell.
        </p>
        <p className="ds-label">WHAT WE SEEK FROM MHA / CRPF</p>
        <ul className="ds-list">
          {asks.map((a) => <li key={a}>{a}</li>)}
        </ul>
        <dl className="ds-contact">
          <div>
            <dt>CONTACT</dt>
            <dd><b>Vishnu Paandian</b><br />Founder &amp; CEO, Perartral Technologies</dd>
          </div>
          <div>
            <dt>PHONE</dt>
            <dd><a href="tel:+919345905757">+91 93459 05757</a></dd>
          </div>
          <div>
            <dt>EMAIL</dt>
            <dd><a href="mailto:perartraltechnologies@gmail.com">perartraltechnologies@gmail.com</a></dd>
          </div>
          <div>
            <dt>ADDRESS</dt>
            <dd>V-Nest, VIT Chennai Campus, Tamil Nadu</dd>
          </div>
        </dl>
      </div>
    </section>

    <footer className="ds-foot">
      <div className="ds-wrap" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '16px', flexWrap: 'wrap' }}>
        <span>Perartral Technologies | Defence Vertical | Concept Note for MHA / CRPF</span>
        <span>Confidential</span>
      </div>
    </footer>
  </div>
}
