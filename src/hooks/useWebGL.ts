import { useEffect, useState } from 'react'

/** True when the browser can actually create a WebGL context. */
export function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      setOk(!!(c.getContext('webgl2') || c.getContext('webgl')))
    } catch {
      setOk(false)
    }
  }, [])
  return ok
}
