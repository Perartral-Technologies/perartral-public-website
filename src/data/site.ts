/**
 * Single source of copy and figures for the Anvik microsite.
 * Wording is taken from Perartral's Defence Vertical concept note and the
 * Amber Wings product deck. Only Perartral's own numbers are used.
 */

export const meta = {
  product: 'Anvik',
  tagline: 'Portable ISR quadcopter carrying Perartral’s AI analytics for property intelligence.',
  headline: ['Ready to demonstrate.', 'Ready to deliver.'],
  problemStatement: 'Property ISR & AI-based Detection',
  owner: 'Perartral Technologies',
}

/** Anvik platform specification. Rendered in §4 and in the print spec sheet. */
export const specs: { label: string; value: string; unit: string }[] = [
  { label: 'Endurance', value: '100', unit: 'min' },
  { label: 'Range', value: '10', unit: 'km' },
  { label: 'Wind resistance', value: '30', unit: 'knots' },
  { label: 'Max speed', value: '40', unit: 'km/h' },
  { label: 'Payload', value: '1', unit: 'kg' },
]

export const specSecondary: { label: string; value: string }[] = [
  { label: 'Airframe', value: 'Quadcopter, VTOL' },
  { label: 'Battery', value: 'Li-ion' },
  { label: 'Deployment', value: 'One operator, hand-launched in minutes' },
  { label: 'Payload bay', value: 'EO/IR gimbal, live encrypted video' },
]

export const platformTraits = [
  'Extremely low footprint — portable',
  'Ruggedised design',
  'High modularity and flexibility',
  'High-endurance platform for its class',
]

/** Hotspot callouts on the platform image. x/y are percentages of the frame. */
export const hotspots = [
  { x: 51, y: 62, title: 'EO/IR gimbal', body: 'Stabilised day/night payload; geo-tagged frames to the AI stack.' },
  { x: 19, y: 37, title: 'Folding arms', body: 'Ruggedised, tool-free fold — carried and launched by one operator.' },
  { x: 82, y: 39, title: 'Payload bay', body: 'Swappable payload and comms modules for mission fit.' },
]

/**
 * Sibling platforms in Perartral's wider programme, shown alongside Anvik for
 * context. Figures are Perartral's own where the platform is a Perartral
 * product (M50, ATVA 1.5); Q20 is Amber Wings' shared testbed airframe, cited
 * with Amber Wings' own trial figures.
 */
export const platformFamily = [
  {
    key: 'anvik',
    name: 'Anvik',
    role: 'This build — portable ISR quadcopter',
    spec: '100 min endurance · 10 km range · 1 kg payload',
    img: '/anvik-platform.jpg',
    position: '50% 42%',
  },
  {
    key: 'm50',
    name: 'M50',
    role: 'Heavy-lift logistics multirotor',
    spec: 'Up to 43 kg payload · 30 min endurance',
    img: '/family-m50.jpg',
    position: '50% 46%',
  },
  {
    key: 'atva',
    name: 'ATVA 1.5',
    role: 'Long-endurance fixed-wing ISR, VTOL',
    spec: '240 min endurance · 100 km range',
    img: '/family-atva.jpg',
    position: '50% 50%',
  },
  {
    key: 'q20',
    name: 'Q20',
    role: 'Amber Wings testbed — shared airframe, trialled with the Indian Army & India Post',
    spec: 'Up to 20 kg payload · 54 km/h',
    img: '/family-q20.jpg',
    position: '50% 28%',
  },
]

export const problem = {
  eyebrow: 'The operational gap',
  heading: ['Thousands of acres,', 'seen once a year.'],
  points: [
    'Central forces and CEPI hold thousands of acres of camps, firing ranges, training grounds and acquired land — much of it remote, unfenced and visited infrequently.',
    'Encroachment, unauthorised construction, illegal mining or dumping, trespass and theft are discovered late, when eviction and legal action become costly.',
    'Manual surveys are slow, subjective and hard to compare year on year; static CCTV covers only built-up perimeters.',
  ],
  need: 'A portable ISR drone paired with an AI model that surveys property boundaries, detects change against a baseline map, and tracks people, vehicles and activity — producing evidence-grade reports, not just video.',
}

export const pipeline = [
  {
    n: '01',
    title: 'Capture',
    body: 'Anvik flies scheduled survey and patrol routes; EO/IR frames are geo-tagged.',
  },
  {
    n: '02',
    title: 'Map',
    body: 'Orthomosaic stitched and aligned to survey boundaries from revenue / cadastral records.',
  },
  {
    n: '03',
    title: 'Detect',
    body: 'Vision models find structures, vehicles, persons, excavation and dumping; change detection vs baseline.',
  },
  {
    n: '04',
    title: 'Track',
    body: 'Objects followed across frames and sorties; movement patterns and repeat offenders logged.',
  },
  {
    n: '05',
    title: 'Report',
    body: 'Alerts to a web dashboard; evidence pack with imagery, coordinates and timestamps.',
  },
]

/** Invented location shown on the illustrative alert card in §3. */
export const illustrativeAlert = {
  label: 'Illustrative',
  parcel: 'PARCEL 214-B · NORTH RANGE',
  finding: 'New structure — 84 m² — not on baseline',
  coords: '12.9184° N · 79.1325° E',
  timestamp: '2026-09-10 06:42 IST',
}

export const deliverables = {
  eyebrow: 'Deliverables to CEPI / CRPF',
  heading: ['Aircraft, software,', 'and the survey to start from.'],
  items: [
    'Anvik aircraft with EO/IR gimbal and spares',
    'Perartral AI software — on-premise, no cloud dependency',
    'Property baseline survey and boundary digitisation',
    'Operator training and 5-year software support',
    'Integrable with existing CCTV and command-centre feeds',
  ],
}

export const team = {
  eyebrow: 'Team & partnership',
  members: [
    {
      name: 'Vishnu Paandian',
      role: 'Founder & CEO, Perartral Technologies',
      note: 'Leads product strategy and the defence vertical; named contact for MHA / CRPF correspondence.',
    },
    {
      name: 'R. R. Elangovan',
      role: 'Mentor — Aerospace & Systems',
      note: 'Former ISRO scientist and core team member of the GSLV Mk-I project. Guides airworthiness, propulsion sizing and test methodology.',
    },
    {
      name: 'Prof. Praveen Joe',
      role: 'Campus Faculty Coordinator, VIT Chennai',
      note: 'Institutional interface for the project; coordinates the student engineering pool, lab access and academic oversight.',
    },
  ],
  institution:
    'Perartral Technologies is a deep-tech start-up incubated at V-Nest, the incubator of Vellore Institute of Technology, Chennai Campus.',
  manufacturing:
    'Anvik is manufactured by Amber Wings Pvt. Ltd. (IIT Madras incubated) to Perartral’s specification, with full product ownership and OEM certification transferred to Perartral. Autonomy, analytics and the ground control station remain Perartral IP.',
}

export const contact = {
  eyebrow: 'Request a briefing',
  heading: ['See Anvik and Perartral AI', 'against your property.'],
  name: 'Vishnu Paandian',
  roleLine: 'Founder & CEO, Perartral Technologies',
  email: 'perartraltechnologies@gmail.com',
  phone: '+91 93459 05757',
  address: 'V-Nest, VIT Chennai Campus, Tamil Nadu',
}
