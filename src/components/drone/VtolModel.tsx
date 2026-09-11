import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { Mesh, Object3D } from 'three'

export const vtolPropellerNames = [
  'Propeller_FL', 'Propeller_FR', 'Propeller_RL', 'Propeller_RR',
] as const

export type VtolRefs = {
  nodes: Record<string, Object3D>
  props: Object3D[]
}

/**
 * The second airframe — a VTOL fixed-wing craft extracted from
 * DroneHangar_scene.blend. Unlike the quadcopter it has no folding arms or
 * exploded sub-assemblies, so it exposes only its four lift rotors for
 * scroll-driven spin. Rotors are separate objects whose origins sit on their
 * own hub axis (verified: local bbox centre offset 0.0000 on X/Z), so a plain
 * `rotation.y` produces a clean spin with no wobble.
 */
export const VtolModel = forwardRef<VtolRefs, ThreeElements['group']>(function VtolModel(props, ref) {
  const { scene } = useGLTF('/models/drone-vtol.glb')
  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    return clone
  }, [scene])

  useImperativeHandle(ref, () => {
    const nodes: Record<string, Object3D> = {}
    vtolPropellerNames.forEach((name) => {
      const node = model.getObjectByName(name)
      if (node) nodes[name] = node
    })
    return { nodes, props: vtolPropellerNames.map((n) => nodes[n]).filter(Boolean) }
  }, [model])

  return <primitive object={model} {...props} />
})

useGLTF.preload('/models/drone-vtol.glb')
