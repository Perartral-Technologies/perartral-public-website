import { useGLTF } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { forwardRef, useImperativeHandle, useMemo } from 'react'
import { Group, Mesh, Object3D, Quaternion, Vector3 } from 'three'

export type TransformState = { position: Vector3; rotation: { x: number; y: number; z: number }; scale: Vector3 }

/** Groups we can address in the exploded view. */
export const animatedNodeNames = [
  'Body',
  'Battery_Pivot',
  'FlightController',
  'ESC',
  'CoolingSystem',
  'Camera_Pivot',
  'Gimbal',
  'FrontLeft_Pivot',
  'FrontRight_Pivot',
  'RearLeft_Pivot',
  'RearRight_Pivot',
  'LandingSupport_L',
  'LandingSupport_R',
] as const

const ARM_PIVOTS = ['FrontLeft_Pivot', 'FrontRight_Pivot', 'RearLeft_Pivot', 'RearRight_Pivot'] as const

export type PropSpin = { pivot: Group; axis: Vector3 }

export type DroneRefs = {
  nodes: Record<string, Object3D>
  originalTransforms: Map<string, TransformState>
  /** Pivots that carry the propeller blades+hub so they can spin, with a local spin axis. */
  props: PropSpin[]
  arms: Object3D[]
}

const capture = (node: Object3D): TransformState => ({
  position: node.position.clone(),
  rotation: { x: node.rotation.x, y: node.rotation.y, z: node.rotation.z },
  scale: node.scale.clone(),
})

export const AnvikModel = forwardRef<DroneRefs, ThreeElements['group']>(function AnvikModel(props, ref) {
  const { scene } = useGLTF('/models/anvik.glb')

  const { model, spinPivots } = useMemo(() => {
    const clone = scene.clone(true)
    const spin: PropSpin[] = []

    clone.traverse((node) => {
      if (node instanceof Mesh) {
        node.castShadow = true
        node.receiveShadow = true
      }
    })
    clone.updateMatrixWorld(true)

    // Re-parent propeller hub+blades into a pivot anchored at the hub so the
    // prop spins around its own axis instead of orbiting the blade centres.
    ARM_PIVOTS.forEach((armName) => {
      const arm = clone.getObjectByName(armName)
      if (!arm) return
      const propNodes: Object3D[] = []
      arm.traverse((n) => {
        if (n.name.includes('_Propeller_')) propNodes.push(n)
      })
      if (!propNodes.length) return
      const motor = arm.getObjectByName(`${armName.replace('_Pivot', '')}_Motor`) ?? arm
      const hub = propNodes.find((n) => n.name.endsWith('_Hub')) ?? propNodes[0]

      const pivot = new Group()
      pivot.name = `${armName}_PropSpin`
      pivot.position.copy(motor.worldToLocal(hub.getWorldPosition(new Vector3())))
      motor.add(pivot)
      propNodes.forEach((n) => pivot.attach(n))
      pivot.updateWorldMatrix(true, true)

      // World-up expressed in the pivot's local frame — the spin axis.
      const axis = new Vector3(0, 1, 0)
        .applyQuaternion(pivot.getWorldQuaternion(new Quaternion()).invert())
        .normalize()
      spin.push({ pivot, axis })
    })

    return { model: clone, spinPivots: spin }
  }, [scene])

  useImperativeHandle(ref, () => {
    const nodes: Record<string, Object3D> = {}
    animatedNodeNames.forEach((name) => {
      const node = model.getObjectByName(name)
      if (node) nodes[name] = node
    })
    return {
      nodes,
      originalTransforms: new Map(Object.entries(nodes).map(([name, node]) => [name, capture(node)])),
      props: spinPivots,
      arms: ARM_PIVOTS.map((n) => nodes[n]).filter(Boolean),
    }
  }, [model, spinPivots])

  return <primitive object={model} {...props} />
})

useGLTF.preload('/models/anvik.glb')
