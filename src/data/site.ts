/**
 * Single source of copy and figures for the Perartral Defence microsite.
 * Every number and claim is taken from Perartral's Defence Vertical concept
 * note (September 2026) and the Amber Wings corporate deck (Jul 26).
 */

export const meta = {
  company: 'Perartral Technologies',
  vertical: 'Defence Vertical',
  product: 'Anvik',
  headline: ['Autonomy for India’s', 'internal security.'],
  accentWord: 'Autonomy',
  tagline:
    'A deep-tech start-up building AI-driven autonomy for defence and civil security · incubated at V-Nest, VIT Chennai.',
  submission:
    'Concept note to the Ministry of Home Affairs / CRPF Communication Directorate, QR Cell · Ref. B.V-7-C/2026-27-C (UAV Demo) · September 2026.',
  eoi: 'EOI registered · CRPF No-Cost-No-Commitment field demonstration, Kashmir Valley / Uttarakhand, Aug 2026',
}

/** At-a-glance figures from the concept note's opening spread. */
export const glance: { value: string; unit: string; label: string }[] = [
  { value: '03', unit: '', label: 'MHA problem statements addressed · logistics, coastal, property ISR' },
  { value: '43', unit: 'kg', label: 'Payload on the M50 offered against the 40 kg QR' },
  { value: '240', unit: 'min', label: 'Endurance on the ATVA 1.5 fixed-wing for coastal ISR' },
  { value: '100', unit: 'min', label: 'Endurance on Anvik, the portable ISR quadcopter' },
  { value: '130', unit: '+', label: 'Engineers at Amber Wings, the IIT-Madras manufacturing partner' },
  { value: '27-28', unit: '', label: 'Target window for Perartral’s own manufacturing unit' },
]

export const whoWeAre = {
  eyebrow: 'Who we are',
  heading: ['Aerospace mentorship,', 'an AI core, one manufacturer.'],
  lede: 'Perartral’s Defence Vertical brings together aerospace mentorship, an AI/robotics engineering core, and an IIT Madras-incubated UAV manufacturer to deliver mission-ready aerial systems to India’s Central Armed Police Forces.',
  pillars: [
    {
      k: 'Dedicated Defence Vertical',
      v: 'Separate business unit focused on CAPF, coastal and internal-security requirements.',
    },
    {
      k: 'Six-member core team + interns',
      v: 'AI, embedded systems, autonomy, GCS software and integration engineers.',
    },
    {
      k: 'ISRO-calibre mentorship',
      v: 'R. R. Elangovan · former ISRO scientist, GSLV Mk-I core team. Prof. Praveen Joe, faculty coordinator.',
    },
    {
      k: 'Manufacturing partnership',
      v: 'Amber Wings (IIT Madras) manufactures to our specification; full product ownership and OEM certification transfer to Perartral.',
    },
  ],
}

/** The three problem statements from the MHA compendium, each mapped to a platform. */
export const missions = {
  eyebrow: 'Mission set',
  heading: ['Three problem statements,', 'three platforms.'],
  lede: 'Mapped to the MHA Problem Statement Compendium 2026 and the CRPF Communication & IT Directorate draft QRs/TDs, March 2026.',
  items: [
    {
      ps: 'PS 01',
      title: 'Medium Logistic Drone · 40 kg payload',
      problem:
        'Autonomous resupply of forward posts, casualty-support and stores movement in LWE and high-altitude terrain where roads are absent or unsafe.',
      detail:
        'Forward posts in LWE-affected districts, J&K and the North-East depend on road convoys and porters on IED-prone, weather-dependent routes. Helicopter lift is scarce; commercial drones under 10 kg cannot sustain a post.',
      platform: 'M50 Heavy-Lift Multirotor',
      img: '/img/m50-card.jpg',
      position: '50% 45%',
      spec: 'Up to 43 kg · 10 km one-way · winch release',
    },
    {
      ps: 'PS 02',
      title: 'Coastal & Maritime Surveillance',
      problem:
        'Persistent monitoring of the 11,098 km coastline and creek networks for infiltration, smuggling and illegal fishing.',
      detail:
        'Mangrove deltas such as the Sundarbans and thousands of fishing craft create a porous boundary patrol boats and fixed cameras cannot watch continuously. A sector needs hours of endurance and stability in gusty onshore winds.',
      platform: 'ATVA 1.5 Long-Endurance Fixed-Wing',
      img: '/img/atva-river.jpg',
      position: '50% 45%',
      spec: '240 min on station · 100 km radius · EO/IR',
    },
    {
      ps: 'PS 03',
      title: 'Property ISR & AI-based Detection',
      problem:
        'Encroachment detection, boundary survey and tracking of illegal activity on government-owned property · for CEPI and force headquarters.',
      detail:
        'Central forces and CEPI hold thousands of acres of camps, firing ranges and acquired land · much of it remote, unfenced and visited infrequently. Manual surveys are slow, subjective and hard to compare year on year.',
      platform: 'Anvik Quadcopter + Perartral AI',
      img: '/img/anvik-port.jpg',
      position: '50% 62%',
      spec: '100 min · 10 km · evidence-grade reports',
    },
  ],
}

/** PS1 key QR parameters (draft) · CRPF Communication & IT Directorate, March 2026. */
export const qrParams = [
  { k: 'Payload', v: '40 kg ± 5%, gyro-stabilised, winch release' },
  { k: 'Launch / recovery', v: 'VTOL within 15 m × 15 m' },
  { k: 'Endurance', v: '45 ± 5 min at 1,000 m AMSL, max payload' },
  { k: 'Mission range', v: '10 km one-way minimum' },
  { k: 'Altitude', v: 'Launch to 4,000 m AMSL · 500 m AGL operating' },
  { k: 'Speed / wind', v: '40 km/h cruise · 40 km/h wind tolerance' },
  { k: 'Autonomy', v: 'Autonomous, waypoint, 360° obstacle avoidance, failsafes' },
  { k: 'Sensors', v: 'Day 1080p/10x + night 640×512/4x gimbal, live downlink' },
  { k: 'Comms', v: 'AES-256 encrypted, S/C-band with FHSS' },
  { k: 'Support', v: '1,000 landings · 2-yr warranty · 5-yr support · MRLS' },
]

/** PS2 · what the force needs for coastal surveillance. */
export const coastalNeeds = [
  { k: 'Endurance', v: '3-4 hours on station per sortie' },
  { k: 'Weather', v: 'Stable in gusty coastal winds; day and night' },
  { k: 'Reach', v: '100 km operational radius from launch point' },
  { k: 'Payload', v: 'Stabilised EO/IR gimbal, live encrypted video' },
  { k: 'Analytics', v: 'Automatic vessel and landing detection, geo-tagged alerts' },
  { k: 'Deployment', v: 'VTOL or short-field launch from beach outposts' },
]

/** PS3 · what the property-ISR solution must produce. */
export const propertyNeeds = [
  { k: 'Land encroachment', v: 'Boundary overlay from revenue records; new structures and fences flagged automatically' },
  { k: 'Illegal activity tracking', v: 'Mining, dumping, vehicles and gatherings detected; movement tracked across frames' },
  { k: 'Evidence generation', v: 'Time-stamped, geo-tagged imagery packaged for legal and administrative action' },
  { k: 'Survey & mapping', v: 'Orthomosaic and 3D terrain of the property; area and change reports per visit' },
  { k: 'Perimeter & camp security', v: 'Scheduled patrol flights with intrusion alerts to the guard room' },
  { k: 'Face & object recognition', v: 'Person-of-interest matching and vehicle identification at the edge' },
]

/** The Perartral AI detection model · five steps, flight to evidence pack. */
export const pipeline = [
  { n: '01', title: 'Capture', body: 'Anvik flies scheduled survey and patrol routes; EO/IR frames are geo-tagged.' },
  { n: '02', title: 'Map', body: 'Orthomosaic stitched and aligned to survey boundaries from revenue / cadastral records.' },
  { n: '03', title: 'Detect', body: 'Vision models find structures, vehicles, persons, excavation and dumping; change detection vs baseline.' },
  { n: '04', title: 'Track', body: 'Objects followed across frames and sorties; movement patterns and repeat offenders logged.' },
  { n: '05', title: 'Report', body: 'Alerts to a web dashboard; evidence pack with imagery, coordinates and timestamps.' },
]

export const illustrativeAlert = {
  label: 'Illustrative',
  parcel: 'PARCEL 214-B · NORTH RANGE',
  finding: 'New structure · 84 m² · not on baseline',
  coords: '12.9184° N · 79.1325° E',
  timestamp: '2026-09-10 06:42 IST',
}

/** Field evidence · GCS frames from Amber Wings' Indian Army munition-drop trials. */
export const fieldFeed = {
  eyebrow: 'The stack in the field',
  heading: ['Flight software,', 'proven in trials.'],
  lede: 'The ground control station, mission planning and payload integration that ship with Perartral’s platforms come from a line already flown in Indian Army munition-drop trials and India Post delivery sorties.',
  frames: [
    {
      img: '/img/gcs-plan.jpg',
      tag: 'Mission plan',
      cap: 'Waypoint route with drop point plotted on the GCS map · the same planning layer used for survey grids.',
    },
    {
      img: '/img/gcs-flight.jpg',
      tag: 'Live telemetry',
      cap: 'In-flight GCS view · HUD telemetry, payload state and video downlink to a rugged sunlight-readable console.',
    },
    {
      img: '/img/target-400.jpg',
      tag: 'Target @ 400 m AGL',
      cap: 'Gimbal sight picture at operating altitude · Indian Army munition-drop trial, Q20 airframe.',
    },
    {
      img: '/img/target-20.jpg',
      tag: 'Target @ 20 m AGL',
      cap: 'Terminal-phase view at 20 m · the imaging chain that becomes encroachment evidence on Anvik sorties.',
    },
  ],
  footnote: 'Q20 delivered 9.8 kg over 15+ km in under 15 minutes for India Post, Karjat-Matheran, Maharashtra.',
}

/** Anvik platform specification. */
export const anvik = {
  eyebrow: 'The platform · PS 03',
  heading: ['Anvik.', 'Precision. Persistence. Perception.'],
  lede: 'Portable, ruggedised quadcopter carrying Perartral’s AI analytics for property intelligence. Extremely low footprint · one operator carries and launches it in minutes.',
  img: '/img/anvik-port.jpg',
  specs: [
    { label: 'Endurance', value: '100', unit: 'min' },
    { label: 'Range', value: '10', unit: 'km' },
    { label: 'Wind resistance', value: '30', unit: 'knots' },
    { label: 'Max speed', value: '40', unit: 'km/h' },
    { label: 'Payload', value: '1', unit: 'kg' },
    { label: 'Battery', value: 'Li-ion', unit: '' },
  ],
  traits: [
    'Extremely low footprint · portable',
    'Very high endurance platform for its class',
    'Ruggedised design',
    'Higher payload',
    'High modularity & flexibility',
    'AI-ready payload integration',
  ],
  secondary: [
    { label: 'Airframe', value: 'Quadcopter, VTOL · no runway, no launcher' },
    { label: 'Deployment', value: 'One operator, hand-launched in minutes' },
    { label: 'Payload bay', value: 'EO/IR gimbal, live encrypted video' },
    { label: 'Software', value: 'Perartral AI, on-premise · no cloud dependency' },
  ],
  hotspots: [
    { x: 51, y: 62, title: 'EO/IR gimbal', body: 'Stabilised day/night payload; geo-tagged frames to the AI stack.' },
    { x: 19, y: 37, title: 'Folding arms', body: 'Ruggedised, tool-free fold · carried and launched by one operator.' },
    { x: 82, y: 39, title: 'Payload bay', body: 'Swappable payload and comms modules for mission fit.' },
  ],
}

/** M50 · PS 01 solution · platform specification. */
export const m50 = {
  name: 'M50',
  title: 'Precision. Payload. Power.',
  role: 'Heavy-lift logistic multirotor · manufactured by Amber Wings to Perartral specification; ownership and OEM certification held by Perartral.',
  img: '/img/m50-slung.jpg',
  caption: 'M50 delivering a slung load in cross-country terrain · flight-test footage available on request.',
  specs: [
    { k: 'Payload', v: 'Up to 43 kg' },
    { k: 'Range', v: 'Up to 10 km' },
    { k: 'Endurance', v: 'Up to 30 min' },
    { k: 'Wind resistance', v: '20 knots' },
    { k: 'Max speed', v: '40 km/h' },
    { k: 'Operating altitude', v: '1,000 m' },
    { k: 'Propulsion', v: 'Electric, Li-ion' },
    { k: 'Launch / recovery', v: 'VTOL · 10 m × 10 m clearing' },
    { k: 'Payload release', v: 'Winch-based slung load' },
  ],
  bullets: [
    'Fully electric VTOL · no runway, no launcher; a 4-person team deploys from a small clearing.',
    'Winch-based slung-load delivery: drops stores without landing at the post.',
    'Fully autonomous waypoint missions with assisted, hover and manual modes; RTH on link loss or low battery.',
    'Day/night gimbal camera with live video to a rugged, sunlight-readable GCS.',
    'Same airframe family as the Q20 already trialled with the Indian Army and India Post.',
  ],
  positioning:
    'The M50 carries 43 kg, exceeding the 40 kg requirement and giving margin for the 40 kg ± 5% payload with gyro-stabilisation and winch hardware. Perartral supplies the mission software, GCS, AI payloads, training and 5-year lifecycle support; Amber Wings supplies airframe manufacturing under Perartral’s OEM certification.',
}

/** M50 vs the CRPF draft QR · the honest compliance self-assessment. */
export const compliance = {
  heading: 'M50 vs the CRPF draft QR',
  lede: 'Transparent self-assessment against the 43-parameter QR · the full compliance matrix is supplied with the formal submission.',
  columns: [
    {
      state: 'Compliant today',
      mark: 'A',
      items: [
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
      state: 'Being upgraded · CRPF variant',
      mark: 'B',
      items: [
        'Endurance: 30 min → 45 ± 5 min at 1,000 m AMSL (higher-capacity battery pack)',
        'Range: 8 km → 10 km one-way (link + battery upgrade)',
        'Cruise / wind: 28 km/h → 40 km/h (motor-propeller re-sizing)',
        'Obstacle avoidance: uni-directional → 360° proximity sensing',
      ],
    },
    {
      state: 'To be tested & certified',
      mark: 'C',
      items: [
        'Launch altitude 4,000 m AMSL · high-altitude trials proposed at the Aug 2026 demo sites',
        'Aural signature ≤ 50 dBA at 400 m AGL · NABL lab test',
        'JSS 55555 temperature / damp-heat, IP54 airframe, MIL-STD-810G GCS',
        'GNSS and RF anti-jamming (optional QR items) · evaluation with mentor guidance',
      ],
    },
  ],
  commitment:
    'Every parameter marked “being upgraded” will be demonstrated in the CRPF field trial; parameters marked “to be tested” will carry Government/NABL-lab certificates before supply.',
}

/** ATVA 1.5 · PS 02 solution. */
export const atva = {
  name: 'ATVA 1.5',
  title: 'Ultimate ISR endurance.',
  role: 'Autonomous electric fixed-wing VTOL designed for ultra-long ISR missions in gusty, high-altitude conditions.',
  img: '/img/atva-river.jpg',
  darkImg: '/img/atva-vtol-dark.jpg',
  caption: 'ATVA 1.5 · hybrid VTOL fixed-wing: lifts vertically like a multirotor, cruises like an aircraft.',
  specs: [
    { k: 'Endurance', v: '240 min' },
    { k: 'Operational range', v: '100 km' },
    { k: 'Cruise speed', v: '108 km/h' },
    { k: 'Payload', v: 'Up to 5 kg' },
    { k: 'Service altitude', v: '4,500 m' },
    { k: 'Overall weight', v: '16-20 kg' },
    { k: 'Dimensions', v: '3.0 × 2.5 m' },
    { k: 'Launch / recovery', v: 'VTOL or short-field' },
    { k: 'Propulsion', v: 'Electric' },
  ],
  bullets: [
    'Four hours on a single charge · one aircraft covers a patrol window that would take six multirotor sorties.',
    '100 km operational range at 108 km/h cruise; designed for gusty winds and 4,500 m altitude.',
    '5 kg payload bay: EO/IR gimbal, plus optional AIS receiver or radio relay.',
    'Same ATVA family as India’s first DGCA-certified fixed-wing cargo drone (day/night operations).',
  ],
  missionPackage:
    'Pre-planned sector patrol routes, AI vessel/landing detection running on the ground station, geo-tagged alert feed to the sector control room, and multi-aircraft scheduling so one team keeps a sector under continuous watch.',
}

/** Q20 · the provenance airframe. */
export const q20 = {
  name: 'Q20',
  title: 'Medium-lift logistics, already proven.',
  img: '/img/q20-ridge.jpg',
  spec: 'Up to 20 kg payload · 54 km/h · 20 km range · 25 min endurance',
  bullets: [
    'Trialled with the Indian Army · munition drop at 400 m / 20 m AGL target views.',
    'India Post: 9.8 kg payload delivered in under 15 minutes across 15+ km, Karjat & Matheran, Maharashtra.',
    'Payload and logistics drone built for challenging terrain and rapid disaster response.',
  ],
}

/** Business model & manufacturing partnership. */
export const partnership = {
  eyebrow: 'Business model & manufacturing',
  heading: ['Perartral owns the product.', 'Amber Wings builds it.'],
  perartral: {
    name: 'Perartral Technologies',
    role: 'Prime contractor & product owner',
    points: [
      'Requirement analysis, mission design and QR compliance engineering',
      'AI models, autonomy software, ground control station and dashboards',
      'System integration, acceptance testing, field trials with the force',
      'Training, MRLS spares, 2-year warranty and 5-year lifecycle support',
      'Holds full product ownership and OEM certification for every airframe built for us',
    ],
  },
  amberWings: {
    name: 'Amber Wings Pvt. Ltd.',
    role: 'Manufacturing & airframe partner',
    logo: '/img/amberwings-logo.jpg',
    points: [
      'IIT Madras incubated; wholly owned subsidiary of Ubifly Technologies (The ePlane Co.), founded 2019 by Prof. Satya Chakravarthy',
      '130+ engineers; DGCA type-certified agri and cargo drones; Synergistic Lift patent with 40+ in pipeline',
      'Q20 trialled with the Indian Army (munition drop) and India Post (9.8 kg over 15 km)',
      'Manufactures M50, ATVA 1.5 and Anvik to Perartral’s specification',
      'Transfers ownership of manufactured product; OEM certificate issued within 3 working days',
    ],
  },
  commercial: [
    { k: 'Single point of accountability', v: 'MHA/CRPF contracts with Perartral; OEM authorisation and product ownership documents submitted with the formal bid.' },
    { k: 'Build-to-spec, then scale', v: 'Prototype and trial units manufactured by Amber Wings; production batches follow the same certified process.' },
    { k: 'Own manufacturing by 2027-28', v: 'Perartral’s manufacturing unit planned by end-2027 / 2028 to bring airframe assembly in-house.' },
    { k: 'Software & AI as the differentiator', v: 'Autonomy, analytics and GCS remain Perartral IP across all three platforms.' },
  ],
  photos: [
    { img: '/img/build-floor.jpg', cap: 'Airframe assembly floor' },
    { img: '/img/build-lab.jpg', cap: 'Controlled build environment' },
    { img: '/img/build-bench.jpg', cap: 'Systems integration bench' },
    { img: '/img/field-carry.jpg', cap: 'Field deployment drills' },
    { img: '/img/dev-booth.jpg', cap: 'Mission software team' },
    { img: '/img/field-ops.jpg', cap: 'Flight operations' },
  ],
}

/** Execution roadmap from the concept note. */
export const roadmap = {
  eyebrow: 'Execution roadmap',
  heading: ['Concept note to', 'certified supply.'],
  phases: [
    {
      when: 'Q3-Q4 2026',
      title: 'Engage & demonstrate',
      items: [
        'Concept note and team details to MHA / CRPF',
        'OEM authorisation and compliance matrix submitted',
        'NCNC field demonstration of M50, ATVA 1.5, Anvik',
      ],
    },
    {
      when: 'Q1-Q2 2027',
      title: 'Certify the CRPF variant',
      items: [
        'M50-C upgrades: 45 min endurance, 10 km range, 40 km/h cruise, 360° obstacle avoidance',
        'NABL / JSS 55555 / MIL-STD tests',
        'AI detection model trained on Indian terrain data',
        'Perartral Defence website live',
      ],
    },
    {
      when: 'Q3-Q4 2027',
      title: 'Trial & first supply',
      items: [
        'User trials with CRPF units and CEPI properties',
        'First production batch through Amber Wings under Perartral OEM',
        'Operator training and support desk established',
      ],
    },
    {
      when: '2027 end - 2028',
      title: 'In-house manufacturing',
      items: [
        'Perartral manufacturing and integration unit commissioned',
        'Airframe assembly, payload integration and MRO in-house',
        'Scale to state police and other CAPFs',
      ],
    },
  ],
}

export const team = {
  eyebrow: 'Team & institution',
  members: [
    {
      name: 'Vishnu Paandian',
      role: 'Founder & CEO, Perartral Technologies',
      note: 'Leads product strategy and the defence vertical; named contact for MHA / CRPF correspondence.',
    },
    {
      name: 'R. R. Elangovan',
      role: 'Mentor · Aerospace & Systems',
      note: 'Former ISRO scientist and core team member of the GSLV Mk-I project. Guides airworthiness, propulsion sizing and test methodology.',
    },
    {
      name: 'Prof. Praveen Joe',
      role: 'Campus Faculty Coordinator, VIT Chennai',
      note: 'Institutional interface for the project; coordinates the student engineering pool, lab access and academic oversight.',
    },
  ],
  coreTeam:
    'Core engineering team: six members plus interns · AI/computer vision, embedded systems and flight software, autonomy and GCS, systems integration and test, operations and support.',
  institution:
    'Perartral Technologies is a deep-tech start-up incubated at V-Nest, the incubator of Vellore Institute of Technology, Chennai Campus.',
  photo: '/img/team-hangar.jpg',
}

export const deliverables = {
  eyebrow: 'Deliverables to CEPI / CRPF',
  heading: ['Aircraft, software,', 'and the survey to start from.'],
  items: [
    'Anvik aircraft with EO/IR gimbal and spares',
    'Perartral AI software · on-premise, no cloud dependency',
    'Property baseline survey and boundary digitisation',
    'Operator training and 5-year software support',
    'Integrable with existing CCTV and command-centre feeds',
  ],
}

export const ask = {
  heading: 'What we seek from MHA / CRPF',
  items: [
    'Slot in the NCNC field demonstration for M50 (logistics), ATVA 1.5 (coastal ISR) and Anvik (property ISR)',
    'Access to a CEPI property for a pilot AI-based survey and encroachment audit',
    'Guidance on QR finalisation so the CRPF variant is certified to the final specification',
  ],
}

export const contact = {
  eyebrow: 'Request a briefing',
  heading: ['Ready to demonstrate.', 'Ready to deliver.'],
  name: 'Vishnu Paandian',
  roleLine: 'Founder & CEO, Perartral Technologies',
  email: 'perartraltechnologies@gmail.com',
  phone: '+91 93459 05757',
  address: 'V-Nest, VIT Chennai Campus, Tamil Nadu',
}
