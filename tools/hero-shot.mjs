// Screenshot the hero (with the 3D Anvik) for visual review.
// Usage: node tools/hero-shot.mjs <outPath> [port] [width]
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import { homedir } from 'node:os'

const OUT = process.argv[2] || '/tmp/hero.png'
const PORT = process.argv[3] || 5173
const W = Number(process.argv[4] || 1440)
const FULL = `${homedir()}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`

const b = await chromium.launch({
  executablePath: existsSync(FULL) ? FULL : undefined,
  args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
})
const p = await b.newPage({ viewport: { width: W, height: 860 }, deviceScaleFactor: 1 })
await p.goto(`http://localhost:${PORT}/?static`, { waitUntil: 'networkidle' })
await p.waitForTimeout(3500) // let the GLB load + first frames render under swiftshader
await p.locator('#top').screenshot({ path: OUT })
console.log('wrote', OUT)
await b.close()
