import { Euler, Vector3 } from 'three'
import { eases } from 'animejs'
import type { TransformState } from '../components/drone/DroneModel'

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
export const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start))
export const smooth = (value: number) => value * value * (3 - 2 * value)
export const easedRange = (progress: number, start: number, end: number) => smooth(range(progress, start, end))
// Anime.js v4's cubic easing gives the engineering sequence a deliberate
// acceleration/deceleration without creating a second timeline.
export const engineeredEase = (progress: number) => eases.inOutCubic(clamp(progress))

export const interpolateTransform = (
  original: TransformState,
  exploded: TransformState,
  progress: number,
  target: { position: Vector3; rotation: Euler; scale: Vector3 },
) => {
  target.position.lerpVectors(original.position, exploded.position, progress)
  target.rotation.set(
    original.rotation.x + (exploded.rotation.x - original.rotation.x) * progress,
    original.rotation.y + (exploded.rotation.y - original.rotation.y) * progress,
    original.rotation.z + (exploded.rotation.z - original.rotation.z) * progress,
  )
  target.scale.lerpVectors(original.scale, exploded.scale, progress)
}

// A quadratic path keeps the battery's service movement physical: it clears
// the compartment before travelling to its final exploded location.
export const interpolateCurvedTransform = (
  original: TransformState,
  exploded: TransformState,
  control: Vector3,
  progress: number,
  target: { position: Vector3; rotation: Euler; scale: Vector3 },
) => {
  interpolateTransform(original, exploded, progress, target)
  target.position.copy(original.position).multiplyScalar((1 - progress) * (1 - progress))
  target.position.addScaledVector(control, 2 * (1 - progress) * progress)
  target.position.addScaledVector(exploded.position, progress * progress)
}
