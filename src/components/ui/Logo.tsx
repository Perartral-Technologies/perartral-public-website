type LogoProps = { className?: string }

/**
 * Perartral wordmark.
 *
 * The supplied artwork is a raster JPG in the original orange/blue brand
 * colours. This is the same lockup — three-node mark plus wordmark, colour
 * split after "Per" — rebuilt as vector geometry in the site palette so it
 * stays crisp at any size and inherits the theme through CSS variables.
 *
 * If the original vector (SVG/AI) turns up, swap the <text> for the real
 * outlines to match the letterforms exactly.
 */
export function Logo({ className = 'logo' }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 232 56"
      role="img"
      aria-label="Perartral"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <circle className="logo-mark" cx="11" cy="15" r="8.5" />
        <circle className="logo-mark" cx="11" cy="41" r="8.5" />
        <circle className="logo-mark-alt" cx="36" cy="28" r="8.5" />
      </g>
      <text x="58" y="39" className="logo-word" fontSize="34">
        <tspan className="logo-word-a">Per</tspan>
        <tspan className="logo-word-b">artral</tspan>
      </text>
    </svg>
  )
}
