import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Group, Vector3, type Object3D } from 'three'
import { AnvikModel, type DroneRefs } from './AnvikModel'
import { clamp, damp, easedRange, range, smooth } from '../../animations/droneMath'

/**
 * Engineering canvas — the airframe explodes into serviceable systems as the
 * viewer scrolls through the track. Engineering labels are DOM elements
 * projected from the exploded parts, with SVG leader lines.
 */

type Explode = { node: Object3D; from: Vector3; to: Vector3 }

// Explode vectors in the model's local space (drone is ~5.5 units wide).
const EXPLODE_TARGETS: Record<string, [number, number, number]> = {
  Battery_Pivot: [0, 0.9, -1.5],
  FlightController: [0, 0.5, 0.95],
  ESC: [0.95, 0.3, 0.1],
  CoolingSystem: [-0.95, 0.3, 0.1],
  Camera_Pivot: [0, -0.8, 1.5],
  FrontLeft_Pivot: [-1.15, 0.45, 0.8],
  FrontRight_Pivot: [1.15, 0.45, 0.8],
  RearLeft_Pivot: [-1.15, 0.45, -0.8],
  RearRight_Pivot: [1.15, 0.45, -0.8],
  LandingSupport_L: [-0.5, -1.05, 0],
  LandingSupport_R: [0.5, -1.05, 0],
}

type Side = 'l' | 'r' | 't'

export type LabelSpec = {
  key: string
  node: string
  title: string
  body: string
  /** px offset from the projected anchor to the card's connecting edge */
  dx: number
  dy: number
  /** which card edge the leader line connects to */
  side: Side
}

export const LABELS: LabelSpec[] = [
  { key: 'frame', node: 'Body', title: 'Airframe', body: 'Modular shell + internal frame', dx: -110, dy: -150, side: 'r' },
  { key: 'power', node: 'Battery_Pivot', title: 'Power module', body: 'Li-ion pack · hot-swap rail', dx: -150, dy: -50, side: 'r' },
  { key: 'core', node: 'FlightController', title: 'Flight core', body: 'Autopilot + mission computer', dx: 140, dy: -80, side: 'l' },
  { key: 'vision', node: 'Gimbal', title: 'Vision system', body: 'EO/IR stabilised gimbal', dx: 150, dy: 30, side: 'l' },
  { key: 'prop', node: 'FrontRight_Pivot', title: 'Propulsion ×4', body: 'BLDC motors · 30 kt wind', dx: 120, dy: -110, side: 'l' },
  { key: 'gear', node: 'LandingSupport_R', title: 'Landing gear', body: 'Quick-release ski struts', dx: 110, dy: 110, side: 'l' },
]

/** CSS translate that puts the card's connecting edge on the point. */
const edgeShift = (side: Side) => (side === 'r' ? 'translate(-100%, -50%)' : side === 'l' ? 'translate(0, -50%)' : 'translate(-50%, -100%)')

type LabelEls = Record<string, { card?: HTMLDivElement; line?: SVGLineElement; dot?: SVGCircleElement }>

function Scene({ progress, labels }: { progress: { v: number }; labels: LabelEls }) {
  const drone = useRef<DroneRefs>(null)
  const root = useRef<Group>(null)
  const explodes = useRef<Explode[]>([])
  const { camera, size } = useThree()
  const v = useRef(new Vector3())

  const ready = (refs: DroneRefs | null) => {
    if (!refs || explodes.current.length) return
    explodes.current = Object.entries(EXPLODE_TARGETS)
      .map(([name, to]) => {
        const node = refs.nodes[name]
        const base = refs.originalTransforms.get(name)
        if (!node || !base) return null
        return { node, from: base.position.clone(), to: new Vector3(...to) }
      })
      .filter((e): e is Explode => !!e)
  }

  useFrame((state, delta) => {
    const p = progress.v
    // 0.00–0.10 settle · 0.10–0.50 explode · 0.50–0.80 hold + turn · 0.82–1 reassemble
    const explodeT = easedRange(p, 0.1, 0.5) * (1 - easedRange(p, 0.82, 0.98))

    drone.current?.props.forEach(({ pivot, axis }, i) => {
      pivot.rotateOnAxis(axis, delta * (16 + i))
    })

    explodes.current.forEach(({ node, from, to }) => {
      node.position.lerpVectors(from, to, explodeT)
    })

    if (root.current) {
      root.current.rotation.y = -0.55 + p * 0.5 + smooth(range(p, 0.35, 1)) * Math.PI * 1.05
      root.current.rotation.x = damp(root.current.rotation.x, 0.1 + explodeT * 0.22, 5, delta)
      root.current.position.y = damp(root.current.position.y, -0.15 + explodeT * 0.3, 5, delta)
    }

    // project anchors → place labels + leader lines
    const vis = clamp(range(p, 0.42, 0.58) * (1 - range(p, 0.8, 0.88)))
    LABELS.forEach((l) => {
      const els = labels[l.key]
      const node = drone.current?.nodes[l.node]
      if (!els?.card || !els.line || !els.dot || !node) return
      node.getWorldPosition(v.current)
      v.current.project(camera)
      const ax = (v.current.x * 0.5 + 0.5) * size.width
      const ay = (-v.current.y * 0.5 + 0.5) * size.height
      const lx = ax + l.dx
      const ly = ay + l.dy
      els.card.style.opacity = String(vis)
      els.card.style.transform = `translate(${lx}px, ${ly}px) ${edgeShift(l.side)}`
      els.card.style.pointerEvents = vis > 0.5 ? 'auto' : 'none'
      els.line.setAttribute('x1', String(ax))
      els.line.setAttribute('y1', String(ay))
      els.line.setAttribute('x2', String(lx))
      els.line.setAttribute('y2', String(ly))
      els.line.style.opacity = String(vis * 0.75)
      els.dot.setAttribute('cx', String(ax))
      els.dot.setAttribute('cy', String(ay))
      els.dot.style.opacity = String(vis)
    })
  })

  return (
    <group ref={root}>
      <AnvikModel
        ref={(r) => {
          ;(drone as { current: DroneRefs | null }).current = r
          ready(r)
        }}
      />
    </group>
  )
}

export function ExplodeCanvas({ progress }: { progress: { v: number } }) {
  const labelEls = useRef<LabelEls>({})
  const svgRef = useRef<SVGSVGElement>(null)

  return (
    <div className="explode-stage">
      <Canvas camera={{ position: [0.5, 1.6, 10.8], fov: 30 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#08080a']} />
        <fog attach="fog" args={['#08080a', 13, 24]} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[6, 8, 5]} intensity={2.2} color="#fff4e2" />
        <spotLight position={[-7, 4, -6]} intensity={16} angle={0.55} penumbra={0.85} color="#9db4ff" />
        <pointLight position={[0, -2, 4]} intensity={2} color="#c8a25a" />
        <Suspense fallback={null}>
          <Scene progress={progress} labels={labelEls.current} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>

      <svg className="d3-svg" aria-hidden="true" ref={svgRef}>
        {LABELS.map((l) => (
          <g key={l.key}>
            <line
              ref={(el) => {
                if (el) (labelEls.current[l.key] ??= {}).line = el
              }}
            />
            <circle
              ref={(el) => {
                if (el) (labelEls.current[l.key] ??= {}).dot = el
              }}
              r={3}
            />
          </g>
        ))}
      </svg>
      {LABELS.map((l) => (
        <div
          key={l.key}
          className="d3-label"
          ref={(el) => {
            if (el) (labelEls.current[l.key] ??= {}).card = el
          }}
        >
          <b>{l.title}</b>
          <span>{l.body}</span>
        </div>
      ))}
    </div>
  )
}
