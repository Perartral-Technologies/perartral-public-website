import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Html } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import { Group } from 'three'
import { AnvikModel, type DroneRefs } from './AnvikModel'
import { damp } from '../../animations/droneMath'

/**
 * Hero canvas — the airframe floats in a dark studio, slowly rotating,
 * tilting toward the pointer, props spinning. Pure presentation.
 */
function Rig({ pointer }: { pointer: { x: number; y: number } }) {
  const drone = useRef<DroneRefs>(null)
  const root = useRef<Group>(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    // propellers
    drone.current?.props.forEach(({ pivot, axis }, i) => {
      pivot.rotateOnAxis(axis, delta * (22 + i))
    })
    if (root.current) {
      // continuous turntable + pointer tilt
      root.current.rotation.y = t * 0.22 + pointer.x * 0.35
      const targetX = 0.08 + pointer.y * 0.22
      root.current.rotation.x = damp(root.current.rotation.x, targetX, 4, delta)
      root.current.rotation.z = damp(root.current.rotation.z, pointer.x * -0.1, 4, delta)
    }
  })

  return (
    <Float speed={1.6} rotationIntensity={0.12} floatIntensity={1.1} floatingRange={[-0.08, 0.1]}>
      <group ref={root} position={[1.4, 0.15, 0]}>
        <AnvikModel ref={drone} />
      </group>
    </Float>
  )
}

export function DroneCanvas() {
  const pointer = useRef({ x: 0, y: 0 }).current
  return (
    <div
      className="drone-canvas"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1
        pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1
      }}
    >
      <Canvas
        camera={{ position: [0.8, 1.2, 9.6], fov: 30 }}
        dpr={[1, 1.75]}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#08080a']} />
        <fog attach="fog" args={['#08080a', 11, 20]} />

        <ambientLight intensity={0.18} />
        {/* warm key, cool rim — studio feel */}
        <directionalLight position={[5, 7, 4]} intensity={2.4} color="#fff4e2" castShadow />
        <spotLight position={[-6, 3.5, -5]} intensity={18} angle={0.55} penumbra={0.8} color="#9db4ff" />
        <pointLight position={[0, -1.6, 3]} intensity={2.2} color="#c8a25a" />

        <Suspense fallback={<Html center className="drone-loading">LOADING AIRFRAME…</Html>}>
          <Rig pointer={pointer} />
          <ContactShadows position={[0, -1.7, 0]} opacity={0.55} scale={14} blur={2.6} far={4} color="#000" />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
