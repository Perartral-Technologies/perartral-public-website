/**
 * §3 illustration. `step` (0..4) progressively reveals overlays:
 *   0 Capture  – flight path + geo-tagged frames
 *   1 Map      – cadastral boundary + orthomosaic tiles
 *   2 Detect   – detection boxes on structures / vehicles
 *   3 Track    – tracking lines across frames
 *   4 Report   – findings highlighted
 * Entirely illustrative; locations are invented.
 */
const GREY = '#6d6e73'
const GOLD = '#e4e4e7' // near-white accent (kept name to limit churn)

export function TerrainMap({ step }: { step: number }) {
  const on = (s: number) => (step >= s ? 1 : 0)
  const layer = (s: number): React.CSSProperties => ({
    opacity: on(s),
    transition: 'opacity 0.6s cubic-bezier(0.16,1,0.3,1)',
  })

  return (
    <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* ---- base terrain (always visible) ---- */}
      <g stroke={GREY} fill="none" strokeWidth="1" strokeOpacity="0.5">
        {/* contour lines */}
        <path d="M40 120 C 180 80, 320 170, 470 120 S 720 60, 770 140" />
        <path d="M40 210 C 200 170, 300 260, 480 210 S 700 150, 770 240" />
        <path d="M40 470 C 180 430, 340 520, 500 470 S 720 410, 770 500" />
        {/* roads */}
        <path d="M0 360 L 320 360 L 430 300 L 800 300" strokeOpacity="0.7" />
        <path d="M300 600 L 300 360" strokeOpacity="0.7" />
      </g>
      {/* structures + vehicles */}
      <g fill={GREY} fillOpacity="0.28" stroke={GREY} strokeOpacity="0.6">
        <rect x="150" y="250" width="70" height="52" />
        <rect x="380" y="180" width="56" height="44" />
        <rect x="560" y="360" width="92" height="64" />
        <rect x="470" y="430" width="30" height="18" rx="3" /> {/* vehicle */}
        <rect x="250" y="410" width="30" height="18" rx="3" /> {/* vehicle */}
      </g>
      {/* trees */}
      <g fill={GREY} fillOpacity="0.2">
        {[
          [90, 150],
          [120, 175],
          [660, 180],
          [690, 210],
          [640, 220],
          [200, 520],
          [230, 540],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" />
        ))}
      </g>

      {/* ---- 0 Capture: flight path + frames ---- */}
      <g style={layer(0)}>
        <path
          d="M60 540 L 740 520 M 740 470 L 60 480 M 60 430 L 740 420 M 740 370 L 60 360 M 60 310 L 740 300 M 740 250 L 60 240 M 60 190 L 740 180"
          fill="none"
          stroke={GOLD}
          strokeOpacity="0.55"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        {[
          [180, 480],
          [420, 420],
          [300, 300],
          [560, 240],
          [650, 180],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="2.6" fill={GOLD} />
            <rect x={x - 9} y={y - 9} width="18" height="18" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="0.8" />
          </g>
        ))}
      </g>

      {/* ---- 1 Map: cadastral boundary + orthomosaic tiles ---- */}
      <g style={layer(1)}>
        <path
          d="M70 90 L 730 70 L 750 300 L 700 520 L 120 540 L 60 300 Z"
          fill={GOLD}
          fillOpacity="0.04"
          stroke={GOLD}
          strokeOpacity="0.8"
          strokeWidth="1.4"
          strokeDasharray="7 5"
        />
        <g stroke={GOLD} strokeOpacity="0.2" strokeWidth="0.8">
          {[150, 260, 370, 480].map((y) => (
            <line key={y} x1="60" y1={y} x2="750" y2={y} />
          ))}
          {[190, 320, 450, 580, 640].map((x) => (
            <line key={x} x1={x} y1="80" x2={x} y2="535" />
          ))}
        </g>
      </g>

      {/* ---- 2 Detect: detection boxes ---- */}
      <g style={layer(2)}>
        {[
          { x: 144, y: 244, w: 82, h: 64, t: 'STRUCTURE' },
          { x: 374, y: 174, w: 68, h: 56, t: 'STRUCTURE' },
          { x: 554, y: 354, w: 104, h: 76, t: 'STRUCTURE' },
          { x: 464, y: 424, w: 42, h: 30, t: 'VEHICLE' },
          { x: 244, y: 404, w: 42, h: 30, t: 'VEHICLE' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill="none" stroke={GOLD} strokeWidth="1.4" />
            <rect x={b.x} y={b.y - 13} width={b.t.length * 6.4 + 8} height="12" fill={GOLD} />
            <text x={b.x + 4} y={b.y - 4} fontFamily="'DM Mono', monospace" fontSize="8" fill="#08090a">
              {b.t}
            </text>
          </g>
        ))}
      </g>

      {/* ---- 3 Track: tracking lines ---- */}
      <g style={layer(3)}>
        <path d="M259 419 L 330 400 L 405 410 L 479 439" fill="none" stroke={GOLD} strokeWidth="1.4" />
        {[
          [330, 400],
          [405, 410],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill={GOLD} />
        ))}
        <path d="M479 439 l -8 -3 m 8 3 l -3 -8" stroke={GOLD} strokeWidth="1.4" fill="none" />
        <text x="300" y="380" fontFamily="'DM Mono', monospace" fontSize="8" fill={GOLD} opacity="0.85">
          TRACK · 3 SORTIES
        </text>
      </g>

      {/* ---- 4 Report: emphasise the flagged structure ---- */}
      <g style={layer(4)}>
        <rect x="554" y="354" width="104" height="76" fill={GOLD} fillOpacity="0.12" stroke={GOLD} strokeWidth="2" />
        <circle cx="606" cy="392" r="30" fill="none" stroke={GOLD} strokeOpacity="0.5" strokeWidth="1" />
      </g>
    </svg>
  )
}
