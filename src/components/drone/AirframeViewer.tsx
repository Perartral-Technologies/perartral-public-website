import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Suspense, useMemo, useRef, useState } from 'react'
import { Box3, Group, Mesh, Object3D, PerspectiveCamera as ThreePerspectiveCamera, Vector3 } from 'three'

const vtolPropellers = ['Propeller_FL', 'Propeller_FR', 'Propeller_RL', 'Propeller_RR']
const spinCandidates = new Set(vtolPropellers)

function Airframe({ source, turn }: { source: string; turn: number }) {
  const { scene } = useGLTF(source)
  const group = useRef<Group>(null)
  const props = useRef<Object3D[]>([])

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const found: Object3D[] = []
    clone.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
      if (spinCandidates.has(node.name)) found.push(node)
    })
    props.current = found

    const box = new Box3().setFromObject(clone)
    const size = box.getSize(new Vector3())
    const centre = box.getCenter(new Vector3())
    const maxSpan = Math.max(size.x, size.y, size.z) || 1

    const wrapper = new Group()
    wrapper.add(clone)
    clone.position.sub(centre)
    wrapper.scale.setScalar(2 / maxSpan)
    return wrapper
  }, [scene])

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = turn + Math.sin(state.clock.elapsedTime * 0.16) * 0.4
    }
    props.current.forEach((p, i) => {
      p.rotation.y += delta * (2.3 + (i % 2 ? 0.3 : 0))
    })
  })

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  )
}

function Aim({ fov }: { fov: number }) {
  const look = useRef(new Vector3(0, 0, 0))
  useFrame((state) => {
    const cam = state.camera as ThreePerspectiveCamera
    cam.lookAt(look.current)
  })
  return <PerspectiveCamera makeDefault fov={fov} position={[2.4, 1.3, 3.1]} near={0.1} far={100} />
}

function RimLight() {
  const light = useRef<any>(null)
  useFrame((state) => {
    if (light.current) {
      const t = state.clock.elapsedTime
      light.current.position.x = Math.sin(t * 0.5) * 3
      light.current.position.z = Math.cos(t * 0.5) * 3
    }
  })
  return <pointLight ref={light} color="#c9a227" intensity={3} distance={8} decay={2} position={[3, 2, 0]} />
}

export function AirframeViewer({
  source = '/models/drone-vtol.glb',
  label,
  fov = 34,
  turn = -0.5,
}: { source?: string; label?: string; fov?: number; turn?: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`af-viewer ${hovered ? 'af-viewer--hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="af-viewer-ring" />
      {label && <span className="af-viewer-label">{label}</span>}
      <Canvas
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ cursor: 'grab' }}
      >
        <Aim fov={fov} />
        <ambientLight intensity={1.15} />
        <directionalLight position={[3, 3.6, 2.6]} intensity={2.8} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-3.2, 1.6, -2.6]} intensity={1.05} color="#fff4e2" />
        <spotLight position={[0, 3, -4]} color="#c9a227" intensity={16} angle={0.7} penumbra={1} />
        <RimLight />
        <Suspense fallback={null}>
          <Airframe source={source} turn={turn} />
        </Suspense>
        <ContactShadows position={[0, -1.15, 0]} opacity={0.24} scale={6} blur={2.6} far={2.4} color="#1a1712" />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
