import { Html } from '@react-three/drei'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { BufferGeometry, Group, Object3D, Vector3 } from 'three'

type LabelName = 'FLIGHT CORE' | 'POWER MODULE' | 'VISION SYSTEM' | 'PROPULSION'
const labels: Array<{ name: LabelName; position: [number, number, number] }> = [
  { name: 'FLIGHT CORE', position: [0, 1.55, .3] },
  { name: 'POWER MODULE', position: [-1.7, .95, -.25] },
  { name: 'VISION SYSTEM', position: [1.45, -1.3, .95] },
  { name: 'PROPULSION', position: [1.95, .9, .9] },
]

export type EngineeringLabelsHandle = {
  setVisibility: (opacity: number) => void
  connect: (name: LabelName, component: Object3D, anchor: Vector3) => void
}

export const EngineeringLabels = forwardRef<EngineeringLabelsHandle>(function EngineeringLabels(_, ref) {
  const root = useRef<Group>(null)
  const geometries = useRef<Partial<Record<LabelName, BufferGeometry<any>>>>({})
  const anchors = useMemo(() => new Map(labels.map(({ name, position }) => [name, new Vector3(...position)])), [])
  useImperativeHandle(ref, () => ({
    setVisibility: (opacity) => { if (root.current) root.current.visible = opacity > .02 },
    connect: (name, component, anchor) => {
      const geometry = geometries.current[name]
      if (!geometry || !root.current) return
      const componentPosition = component.getWorldPosition(new Vector3())
      root.current.worldToLocal(componentPosition)
      geometry.setFromPoints([anchor, componentPosition])
      geometry.computeBoundingSphere()
    },
  }), [anchors])
  return <group ref={root} visible={false}>
    {labels.map(({ name, position }) => <group key={name} position={position}>
      <line><bufferGeometry ref={(geometry) => { if (geometry) geometries.current[name] = geometry }} /><lineBasicMaterial color="#d86b31" transparent opacity={.72} /></line>
      <Html transform distanceFactor={9} position={[0, .06, 0]} style={{ pointerEvents: 'none' }}><span className="engineering-label">{name}</span></Html>
    </group>)}
  </group>
})
