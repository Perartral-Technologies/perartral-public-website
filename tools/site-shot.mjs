// Headless screenshots of the live dev site for visual review.
// Usage: node tools/site-shot.mjs <outDir> [width]
import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'

const OUT = process.argv[2] || '/tmp/site-shots'
const W = Number(process.argv[3] || 1440)
mkdirSync(OUT, { recursive: true })
const FULL = `${homedir()}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`

const b = await chromium.launch({
  executablePath: existsSync(FULL) ? FULL : undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
})
const p = await b.newPage({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 })
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await p.waitForTimeout(1200)

// full page
await p.screenshot({ path: `${OUT}/full.png`, fullPage: true })
console.log('wrote full.png')

for (const id of ['top', 'problem', 'perartral-ai', 'platform', 'deliverables', 'team', 'contact']) {
  const el = p.locator(`#${id}`)
  if (!(await el.count())) continue
  await el.scrollIntoViewIfNeeded()
  await p.waitForTimeout(900)
  await el.screenshot({ path: `${OUT}/${id}.png` })
  console.log('wrote', `${id}.png`)
}
await b.close()
