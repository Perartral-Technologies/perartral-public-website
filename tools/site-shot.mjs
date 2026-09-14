// Headless screenshots of the live dev site for visual review.
// Usage: node tools/site-shot.mjs <outDir> [width] [port]
import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'

const OUT = process.argv[2] || '/tmp/site-shots'
const W = Number(process.argv[3] || 1440)
const PORT = process.argv[4] || 5173
mkdirSync(OUT, { recursive: true })
const FULL = `${homedir()}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`

const b = await chromium.launch({
  executablePath: existsSync(FULL) ? FULL : undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
})
const p = await b.newPage({ viewport: { width: W, height: 900 }, deviceScaleFactor: 1 })
await p.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' })
await p.waitForTimeout(1400)

// Warm-up pass: scroll to the bottom slowly so every IntersectionObserver
// reveal fires, then return to the top before capturing.
const height = await p.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < height; y += 700) {
  await p.evaluate((v) => window.scrollTo(0, v), y)
  await p.waitForTimeout(140)
}
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(900)

// full page
await p.screenshot({ path: `${OUT}/full.png`, fullPage: true })
console.log('wrote full.png')

for (const id of ['top', 'company', 'missions', 'perartral-ai', 'anvik', 'platforms', 'partnership', 'roadmap', 'team', 'contact']) {
  const el = p.locator(`#${id}`)
  if (!(await el.count())) continue
  await el.screenshot({ path: `${OUT}/${id}.png` })
  console.log('wrote', `${id}.png`)
}
await b.close()
