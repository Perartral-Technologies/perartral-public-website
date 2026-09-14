import { eases } from 'animejs'

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))
export const range = (p: number, start: number, end: number) => clamp((p - start) / (end - start))
export const smooth = (v: number) => v * v * (3 - 2 * v)
export const easedRange = (p: number, start: number, end: number) => smooth(range(p, start, end))

/** anime.js inOutCubic — deliberate acceleration/deceleration for the engineering sequence. */
export const engineeredEase = (p: number) => eases.inOutCubic(clamp(p))

/** Frame-rate independent exponential damping. */
export const damp = (current: number, target: number, lambda: number, delta: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta))
