import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { Euler, Mesh, Object3D, Vector3 } from 'three'

export type TransformState = { position: Vector3; rotation: Euler; scale: Vector3 }
export const animatedNodeNames = [
  'Body', 'Battery', 'FlightController', 'CameraGimbal', 'CameraLens',
  'FrontLeftArm', 'FrontRightArm', 'RearLeftArm', 'RearRightArm',
  'FrontLeftArm_Motor', 'FrontRightArm_Motor', 'RearLeftArm_Motor', 'RearRightArm_Motor',
  'FrontLeftArm_Propeller', 'FrontRightArm_Propeller', 'RearLeftArm_Propeller', 'RearRightArm_Propeller',
] as const
export type DroneRefs = {
  nodes: Record<string, Object3D>
  originalTransforms: Map<string, TransformState>
  arms: Object3D[]
  props: Object3D[]
}
const armNames = ['FrontLeftArm', 'FrontRightArm', 'RearLeftArm', 'RearRightArm'] as const
const captureTransform = (node: Object3D): TransformState => ({
  position: node.position.clone(), rotation: node.rotation.clone(), scale: node.scale.clone(),
})

export const DroneModel = forwardRef<DroneRefs, ThreeElements['group']>(function DroneModel(props, ref) {
  const { scene } = useGLTF('/models/drone.glb')
  const model = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((node) => { if (node instanceof Mesh) { node.castShadow = true; node.receiveShadow = true } })
    return clone
  }, [scene])
  useImperativeHandle(ref, () => {
    const nodes: Record<string, Object3D> = {}
    animatedNodeNames.forEach((name) => {
      const node = model.getObjectByName(name)
      if (!node) throw new Error(`Drone GLB is missing required node: ${name}`)
      nodes[name] = node
    })
    return {
      nodes,
      originalTransforms: new Map(Object.entries(nodes).map(([name, node]) => [name, captureTransform(node)])),
      arms: armNames.map((name) => nodes[name]),
      props: armNames.map((name) => nodes[`${name}_Propeller`]),
    }
  }, [model])
  return <primitive object={model} {...props} />
})

useGLTF.preload('/models/drone.glb')
