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

/** Numbered section marker shown at the top of each band. */
export function SectionIndex({ n, name }: { n: string; name: string }) {
  return (
    <div className="section-index">
      <span className="n">{n}</span>
      <span className="rule" />
      <span className="name">{name}</span>
    </div>
  )
}

/** Small mono key:value row used in requirement tables. */
export function KV({ k, v }: { k: string; v: string }) {
  return (
    <li>
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </li>
  )
}
