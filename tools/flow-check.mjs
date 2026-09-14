import { chromium } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'
import { homedir } from 'node:os'
mkdirSync('/tmp/flow', { recursive: true })
const FULL = `${homedir()}/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome`
const b = await chromium.launch({
  executablePath: existsSync(FULL) ? FULL : undefined,
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox'],
})
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('http://localhost:5174/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3500)
// warm scroll to bottom to trigger reveals, then capture sections
const h = await p.evaluate(() => document.documentElement.scrollHeight)
for (let y = 0; y < h; y += 800) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(120) }
for (const id of ['platforms', 'partnership', 'contact']) {
  const el = p.locator(`#${id}`)
  if (!(await el.count())) continue
  await el.screenshot({ path: `/tmp/flow/${id}.png` })
}
await b.close()
console.log('done')
