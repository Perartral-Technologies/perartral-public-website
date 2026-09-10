import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three'
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

export function DroneScene({ scroll }: { scroll: React.MutableRefObject<ScrollProgress> }) {
  const drone = useRef<DroneRefs>(null)
  return <Canvas shadows dpr={[1, 1.7]} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <color attach="background" args={['#0b0d0e']} />
    <CameraRig scroll={scroll} />
    <ambientLight intensity={.65} />
    <directionalLight position={[4, 6, 4]} intensity={4} castShadow shadow-mapSize={[1024, 1024]} />
    <spotLight position={[-5, 2, -2]} color="#b8e0e5" intensity={50} angle={.5} penumbra={1} />
    <pointLight position={[0, -1, 4]} color="#d86b31" intensity={13} distance={8} />
    <Suspense fallback={null}><DroneController drone={drone} scroll={scroll}><DroneModel ref={drone} position={[0, 0, 0]} /></DroneController></Suspense>
    <ContactShadows position={[0, -1.15, 0]} opacity={.42} scale={11} blur={2.5} far={4} />
    <Environment preset="city" />
  </Canvas>
}
