import { eases } from 'animejs'

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
export const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start))
export const smooth = (value: number) => value * value * (3 - 2 * value)
export const easedRange = (progress: number, start: number, end: number) => smooth(range(progress, start, end))
export const engineeredEase = (progress: number) => eases.inOutCubic(clamp(progress))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

