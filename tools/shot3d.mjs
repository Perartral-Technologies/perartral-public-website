import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
const OUT = process.argv[2] || '/tmp/shots-3d'
const PORT = process.argv[3] || 5174
mkdirSync(OUT, { recursive: true })
const FULL = `${homedir()}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`
const b = await chromium.launch({
  executablePath: existsSync(FULL) ? FULL : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
})
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
p.on('console', (m) => console.log('[con]', m.type(), m.text().slice(0, 200)))
p.on('pageerror', (e) => console.log('[err]', String(e).slice(0, 300)))
await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(4000)
await p.screenshot({ path: `${OUT}/hero3d.png` })
// scroll into the engineering track and capture mid-explode
const eng = await p.evaluate(() => {
  const el = document.querySelector('.eng-track')
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top + window.scrollY, h: r.height, vh: window.innerHeight }
})
if (eng) {
  for (const frac of [0.2, 0.5, 0.62, 0.75]) {
    await p.evaluate((y) => window.scrollTo(0, y), eng.top + eng.h * frac - eng.vh * 0.5)
    await p.waitForTimeout(1200)
    await p.screenshot({ path: `${OUT}/eng-${Math.round(frac * 100)}.png` })
  }
}
await b.close()
console.log('done')
