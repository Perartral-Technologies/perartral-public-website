import { useFrame } from '@react-three/fiber'
import { MutableRefObject, ReactNode, useMemo, useRef } from 'react'
import { Group, PointLight, Vector3 } from 'three'
import { DroneRefs, TransformState } from './DroneModel'
import { easedRange, engineeredEase, interpolateCurvedTransform, interpolateTransform } from '../../animations/droneAnimations'
import { ScrollProgress } from '../../hooks/useScrollProgress'
import { EngineeringLabels, EngineeringLabelsHandle } from './EngineeringLabels'

type ExplosionSpec = { offset: Vector3; rotation?: Vector3; scale?: number; start: number; end: number; curve?: Vector3 }
const v = (x: number, y: number, z: number) => new Vector3(x, y, z)
// These are global-progress sub-ranges, not independent timelines.
const explosionSpecs: Record<string, ExplosionSpec> = {
  Body: { offset: v(0, .04, 0), rotation: v(0, .11, 0), start: .30, end: .54 },
  FrontLeftArm: { offset: v(-.85, .14, -.52), rotation: v(0, -.12, 0), start: .30, end: .50 },
  FrontRightArm: { offset: v(.85, .14, .52), rotation: v(0, .12, 0), start: .30, end: .50 },
  RearLeftArm: { offset: v(-.72, .06, -.64), rotation: v(0, -.1, 0), start: .32, end: .52 },
  RearRightArm: { offset: v(.72, .06, .64), rotation: v(0, .1, 0), start: .32, end: .52 },
  Battery: { offset: v(0, .62, .42), rotation: v(.05, 0, 0), scale: 1.04, curve: v(0, -.22, .30), start: .38, end: .58 },
  CameraGimbal: { offset: v(0, -.74, .24), rotation: v(-.12, 0, 0), scale: 1.04, start: .42, end: .62 },
  CameraLens: { offset: v(0, -.14, .23), scale: 1.08, start: .42, end: .62 },
  FlightController: { offset: v(0, .48, .18), scale: 1.07, start: .46, end: .66 },
}
const explodedTransform = (original: TransformState, spec: ExplosionSpec): TransformState => ({
  position: original.position.clone().add(spec.offset),
  rotation: original.rotation.clone().set(original.rotation.x + (spec.rotation?.x ?? 0), original.rotation.y + (spec.rotation?.y ?? 0), original.rotation.z + (spec.rotation?.z ?? 0)),
  scale: original.scale.clone().multiplyScalar(spec.scale ?? 1),
})
const componentProgress = (progress: number, spec: ExplosionSpec) => engineeredEase((progress - spec.start) / (spec.end - spec.start))

export function DroneController({ drone, scroll, children }: { drone: MutableRefObject<DroneRefs | null>; scroll: React.MutableRefObject<ScrollProgress>; children: ReactNode }) {
  const group = useRef<Group>(null)
  const labels = useRef<EngineeringLabelsHandle>(null)
  const inspectionLight = useRef<PointLight>(null)
  const explodedTransforms = useRef<Map<string, TransformState>>(new Map())
  const curveControls = useRef<Map<string, Vector3>>(new Map())
  const scratchPosition = useRef(new Vector3())
  const labelAnchors = useMemo(() => ({ FlightController: v(0, 1.55, .3), Battery: v(-1.7, .95, -.25), CameraGimbal: v(1.45, -1.3, .95), FrontRightArm: v(1.95, .9, .9) }), [])

  useFrame((state, delta) => {
    // useFrame is requestAnimationFrame-driven. Exponential smoothing keeps this
    // responsive at every frame rate while making raw wheel movement fluid.
    scroll.current.current += (scroll.current.target - scroll.current.current) * (1 - Math.exp(-delta * 10))
    const p = scroll.current.current
    const open = easedRange(p, .12, .30)
    const showcase = engineeredEase((p - .30) / .70)
    const d = drone.current
    if (group.current) {
      group.current.rotation.y = -.22 + showcase * .62
      group.current.rotation.x = .08 - showcase * .04
      group.current.position.y = -.02 + showcase * .13
      group.current.scale.setScalar(1 + showcase * .12)
    }
    if (!d) return

    if (!explodedTransforms.current.size) Object.entries(explosionSpecs).forEach(([name, spec]) => {
      const original = d.originalTransforms.get(name)
      if (!original) return
      explodedTransforms.current.set(name, explodedTransform(original, spec))
      if (spec.curve) curveControls.current.set(name, original.position.clone().add(spec.curve))
    })
    Object.entries(d.nodes).forEach(([name, node]) => {
      const original = d.originalTransforms.get(name), spec = explosionSpecs[name], exploded = explodedTransforms.current.get(name)
      if (!original) return
      // Motors and propellers are reset to their authored local transforms, so
      // their arm's parent transform carries them through the complete path.
      if (!spec || !exploded) interpolateTransform(original, original, 0, node)
      else if (spec.curve) interpolateCurvedTransform(original, exploded, curveControls.current.get(name)!, componentProgress(p, spec), node)
      else interpolateTransform(original, exploded, componentProgress(p, spec), node)
    })

    const flightAngles = [-.8, .8, -.8, .8]
    const foldedAngles = [-.08, .08, -.08, .08]
    d.arms.forEach((arm, index) => {
      if (p < .30) {
        arm.rotation.y = foldedAngles[index] + (flightAngles[index] - foldedAngles[index]) * open
        arm.rotation.z = (index < 2 ? .08 : -.06) * (1 - open)
      }
    })
    if (p < .30) d.nodes.CameraGimbal.rotation.x = -.32 + open * .55
    d.props.forEach((prop, index) => { prop.rotation.y += delta * (.45 + showcase * 3 + (index % 2 ? 0 : .15)) })

    const labelProgress = Math.min(easedRange(p, .65, .70), 1 - easedRange(p, .85, .91))
    if (inspectionLight.current && group.current) {
      d.nodes.FlightController.getWorldPosition(scratchPosition.current)
      group.current.worldToLocal(scratchPosition.current)
      inspectionLight.current.position.copy(scratchPosition.current)
      inspectionLight.current.intensity = 4.5 * componentProgress(p, explosionSpecs.FlightController)
    }
    labels.current?.setVisibility(labelProgress)
    labels.current?.connect('FLIGHT CORE', d.nodes.FlightController, labelAnchors.FlightController)
    labels.current?.connect('POWER MODULE', d.nodes.Battery, labelAnchors.Battery)
    labels.current?.connect('VISION SYSTEM', d.nodes.CameraGimbal, labelAnchors.CameraGimbal)
    labels.current?.connect('PROPULSION', d.nodes.FrontRightArm, labelAnchors.FrontRightArm)
  })
  return <group ref={group}>{children}<pointLight ref={inspectionLight} color="#b0832c" distance={3.5} decay={2} intensity={0} /><EngineeringLabels ref={labels} /></group>
}
