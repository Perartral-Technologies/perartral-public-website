import { useEffect, useRef } from 'react'

export interface ScrollProgress { current: number; target: number }

export function useScrollProgress(): React.MutableRefObject<ScrollProgress> {
  const progress = useRef<ScrollProgress>({ current: 0, target: 0 })
  useEffect(() => {
    const update = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight
      progress.current.target = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0
    }
    update(); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return progress
}
