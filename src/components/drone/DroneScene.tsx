import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Group, PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three'
import { DroneModel, DroneRefs } from './DroneModel'
import { DroneController } from './DroneController'
import { ScrollProgress } from '../../hooks/useScrollProgress'
import { engineeredEase, range } from '../../animations/droneAnimations'

function CameraRig({ scroll }: { scroll: React.MutableRefObject<ScrollProgress> }) {
  const lookAt = useRef(new Vector3())
  useFrame((state, delta) => {
    const camera = state.camera as ThreePerspectiveCamera
    const p = scroll.current.current
    const deployed = engineeredEase(range(p, 0, .30))
    const exploded = engineeredEase(range(p, .30, .65))
    const showcase = engineeredEase(range(p, .85, 1))
    const targetX = .15 + deployed * .08 + exploded * 1.1 + showcase * .45
    const targetY = 1.05 - deployed * .12 + exploded * .67 - showcase * .18
    const targetZ = 7.1 - deployed * .55 + exploded * 2.15 - showcase * .35
    const targetFov = 34 + exploded * 3 - showcase * 1.2
    const factor = 1 - Math.exp(-delta * 8)
    camera.position.x += (targetX - camera.position.x) * factor
    camera.position.y += (targetY - camera.position.y) * factor
    camera.position.z += (targetZ - camera.position.z) * factor
    camera.fov += (targetFov - camera.fov) * factor
    camera.updateProjectionMatrix()
    lookAt.current.set(.02 + exploded * .04, .02 + exploded * .15, 0)
    camera.lookAt(lookAt.current)
  })
  return <PerspectiveCamera makeDefault position={[.15, 1.05, 7.1]} fov={34} />
}

/**
 * The hero headline occupies the left half of the opening frame, so the whole
 * airframe is shifted right while the headline is on screen and eased back to
 * centre before the arm deployment begins. Translating the subject is far more
 * predictable than trying to frame around the type with camera aim alone.
 */
function TypeClearanceGroup({ scroll, children }: { scroll: React.MutableRefObject<ScrollProgress>; children: React.ReactNode }) {
  const group = useRef<Group>(null)
  useFrame(() => {
    if (!group.current) return
    const clear = 1 - engineeredEase(range(scroll.current.current, 0, .26))
    group.current.position.x = clear * 1.95
  })
  return <group ref={group}>{children}</group>
}

export function DroneScene({ scroll }: { scroll: React.MutableRefObject<ScrollProgress> }) {
  const drone = useRef<DroneRefs>(null)
  // The canvas is transparent so the warm ivory backdrop lives in CSS and the
  // 3D subject sits on the same surface as the typography.
  return <Canvas shadows dpr={[1, 1.7]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <CameraRig scroll={scroll} />
    <ambientLight intensity={.95} />
    <directionalLight position={[4, 6, 4]} intensity={3.2} castShadow shadow-mapSize={[1024, 1024]} />
    <directionalLight position={[-5, 2, -3]} intensity={1.15} color="#fff4e2" />
    <spotLight position={[0, 3.4, -6]} color="#c9a227" intensity={26} angle={.62} penumbra={1} />
    <Suspense fallback={null}>
      <TypeClearanceGroup scroll={scroll}><DroneController drone={drone} scroll={scroll}><DroneModel ref={drone} position={[0, 0, 0]} /></DroneController></TypeClearanceGroup>
    </Suspense>
    <ContactShadows position={[0, -1.15, 0]} opacity={.3} scale={11} blur={2.6} far={4} color="#1a1712" />
    <Environment preset="studio" />
  </Canvas>
}
