import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Group, PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three'
import { VtolModel, VtolRefs } from './VtolModel'

type Props = { progress: React.MutableRefObject<number> }

function Rig({ progress }: Props) {
  const drone = useRef<VtolRefs>(null)
  const group = useRef<Group>(null)
  const lookAt = useRef(new Vector3(0, 0, 0))

  useFrame((state, delta) => {
    const p = Math.min(1, Math.max(0, progress.current))
    const camera = state.camera as ThreePerspectiveCamera

    // gentle orbit as the section passes through the viewport
    const targetX = 1.55 - p * 1.15
    const targetY = 0.86 - p * 0.22
    const targetZ = 2.55 + p * 0.45
    const factor = 1 - Math.exp(-delta * 4)
    camera.position.x += (targetX - camera.position.x) * factor
    camera.position.y += (targetY - camera.position.y) * factor
    camera.position.z += (targetZ - camera.position.z) * factor
    camera.lookAt(lookAt.current)

    // rotors spin continuously; the second pair runs slightly out of phase
    const d = drone.current
    if (d) d.props.forEach((prop, i) => {
      prop.rotation.y += delta * (2.1 + p * 3.4 + (i % 2 ? 0.28 : 0))
    })

    if (group.current) {
      group.current.position.y = -0.04 + Math.sin(state.clock.elapsedTime * 0.7) * 0.012
      group.current.rotation.y = -0.12 + p * 0.34
    }
  })

  return <>
    <PerspectiveCamera makeDefault position={[1.55, 0.86, 2.55]} fov={38} />
    <group ref={group}>
      <Suspense fallback={null}>
        <VtolModel ref={drone} />
      </Suspense>
    </group>
  </>
}

export function VtolScene({ progress }: Props) {
  return <Canvas shadows dpr={[1, 1.6]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <Rig progress={progress} />
    <ambientLight intensity={1.05} />
    <directionalLight position={[2.4, 3.2, 2.6]} intensity={2.9} castShadow shadow-mapSize={[1024, 1024]} />
    <directionalLight position={[-3, 1.2, -2.2]} intensity={1.0} color="#fff4e2" />
    <spotLight position={[0, 2.4, -3.4]} color="#c9a227" intensity={14} angle={0.7} penumbra={1} />
    <ContactShadows position={[0, -0.42, 0]} opacity={0.26} scale={4.6} blur={2.6} far={1.6} color="#1a1712" />
    <Environment preset="studio" />
  </Canvas>
}
