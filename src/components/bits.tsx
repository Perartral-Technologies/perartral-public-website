import type { ReactNode } from 'react'

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

/** Section heading; pass a string[] for a two-line treatment with a soft 2nd line. */
export function SectionHeading({ lines }: { lines: string[] }) {
  return (
    <h2 className="section-heading">
      {lines.map((l, i) => (i === 0 ? <span key={i}>{l} </span> : <span key={i} className="soft">{l}</span>))}
    </h2>
  )
}
