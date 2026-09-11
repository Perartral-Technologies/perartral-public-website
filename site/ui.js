/* ==================================================================
 * Loader — registered FIRST and deliberately self-contained.
 *
 * Every other section below depends on elements existing; if any of that threw
 * before this ran, the curtain would stay up and the page would look "not
 * loading". Running it first, with its own safety timeout, guarantees the page
 * always becomes usable.
 * ================================================================== */
(function loader() {
  const box = document.getElementById('loader');
  const pct = document.getElementById('loadPct');
  if (!box) return;
  const clear = () => box.classList.add('done');
  let shown = 0;
  const iv = setInterval(() => {
    shown = Math.min(100, shown + Math.random() * 12 + 4);
    if (pct) pct.textContent = String(Math.round(shown));
    if (shown >= 100) { clearInterval(iv); setTimeout(clear, 220); }
  }, 130);
  setTimeout(clear, 3500);                                  // hard safety
  addEventListener('load', () => setTimeout(clear, 400));   // once assets settle
})();

/* ==================================================================
 * Low-power / low-memory adaptations.
 *
 * On a machine with little RAM or few cores, the animated canvases and
 * backdrop blur are the expensive parts. Detect that once and simplify.
 * ================================================================== */
const LOW_POWER = (() => {
  const mem = navigator.deviceMemory;                  // undefined on Firefox/Safari
  const cores = navigator.hardwareConcurrency || 4;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = devicePixelRatio > 1.5 && innerWidth * innerHeight < 1600 * 900;
  return reduce || (typeof mem === 'number' && mem <= 4) || cores <= 4 || small;
})();
document.documentElement.classList.toggle('low-power', LOW_POWER);

/* ---------- clock ---------- */
function tickClock() {
  const c = $('#clock');
  if (!c) return;
  const d = new Date();
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  c.textContent = `GMT ${h12}:${m} ${ap}`;
}
tickClock();
setInterval(tickClock, 15000);

/* ---------- intro words ---------- */
const WORDS = [
  { t: 'Sea-borne' }, { t: 'infiltration,', muted: true }, { t: 'smuggling,', muted: true },
  { t: 'illegal' }, { t: 'fishing', muted: true }, { t: 'and' },
  { t: 'encroachment', muted: true }, { t: 'before' }, { t: 'they' }, { t: 'reach' }, { t: 'the shore.' },
];
$('#introWords').innerHTML = WORDS
  .map((w) => `<span class="${w.muted ? 'muted' : ''}">${w.t}</span>`)
  .join(' ');

/* ---------- sectors ---------- */
const SECTORS = [
  {
    lede: "India's 11,098 km coastline is too long for patrol boats and fixed cameras to watch continuously. A four-hour sortie covers a patrol window that would otherwise take six multirotor flights.",
    spec: [['Endurance', '240 min'], ['Operational range', '100 km'], ['Cruise speed', '108 km/h'],
           ['Payload', '5 kg'], ['Service altitude', '4,500 m'], ['Weight', '16–20 kg']],
  },
  {
    lede: 'Mangrove deltas such as the Sundarbans offer thousands of unmonitored creek mouths. The aircraft loiters above the canopy and pushes a geo-tagged alert the moment a hull moves under it.',
    spec: [['Endurance', '240 min'], ['Operational range', '100 km'], ['Cruise speed', '108 km/h'],
           ['Payload', 'EO/IR + AIS'], ['Service altitude', '4,500 m'], ['Launch', 'VTOL']],
  },
  {
    lede: 'Island territories and uninhabited outcrops are where landings go undetected. Persistent watch over a sector turns that into a timestamped record rather than a post-hoc report.',
    spec: [['Endurance', '240 min'], ['Operational range', '100 km'], ['Cruise speed', '108 km/h'],
           ['Payload', '5 kg'], ['Service altitude', '4,500 m'], ['Recovery', 'Hand / VTOL']],
  },
  {
    lede: 'Harbour approaches mix legitimate traffic with contacts that switch off transponders. AI vessel detection separates routine movement from the ones that need a second look.',
    spec: [['Endurance', '240 min'], ['Operational range', '100 km'], ['Cruise speed', '108 km/h'],
           ['Payload', 'EO/IR gimbal'], ['Service altitude', '4,500 m'], ['Analytics', 'On-board flagging']],
  },
];

function renderSector(i) {
  const s = SECTORS[i];
  $('#solLede').textContent = s.lede;
  $('#solSpec').innerHTML = s.spec
    .map(([k, v]) => `<tr><td class="k mono">${k}</td><td class="v">${v}</td></tr>`)
    .join('');
  $$('#solTabs .tab').forEach((b, n) => b.classList.toggle('active', n === i));
}
$$('#solTabs .tab').forEach((b, n) => b.addEventListener('click', () => renderSector(n)));
renderSector(0);

/* ---------- capabilities ---------- */
const CAPS = [
  { v: '240 min', d: 'Four hours on a single charge — one aircraft covers a full patrol window that would otherwise take six multirotor sorties.' },
  { v: '100 km', d: '100 km operational radius at 108 km/h cruise, designed for gusty onshore winds and operations up to 4,500 m altitude.' },
  { v: '5 kg', d: 'A 5 kg payload bay carries a stabilised EO/IR gimbal, with optional AIS receiver or radio relay for beyond-line-of-sight work.' },
];

function setCap(i) {
  $('#capVal').textContent = CAPS[i].v;
  $('#capDesc').textContent = CAPS[i].d;
  $$('.capbtn').forEach((b, n) => b.classList.toggle('active', n === i));
}
$$('.capbtn').forEach((b, n) => b.addEventListener('click', () => setCap(n)));
setCap(0);

/* ---------- sticky scroll reactions ---------- */
const lockEl = $('#drone-lock');
const capEl = $('#capabilities');
const stats = $$('#drone-lock .stat');
const nav = $('#nav');
let lastCap = 0;

function onScroll() {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('bordered', y > 40);

  if (lockEl) {
    const seg = clamp01((y - lockEl.offsetTop) / Math.max(1, lockEl.offsetHeight - innerHeight));
    const active = seg < 0.33 ? 0 : seg < 0.66 ? 1 : 2;
    stats.forEach((s, i) => s.classList.toggle('dim', i !== active));
  }

  if (capEl) {
    const capSeg = clamp01((y - capEl.offsetTop) / Math.max(1, capEl.offsetHeight - innerHeight));
    const cap = capSeg < 0.38 ? 0 : capSeg < 0.76 ? 1 : 2;
    if (cap !== lastCap && capSeg > 0.02 && capSeg < 0.98) {
      lastCap = cap;
      setCap(cap);
    }
  }
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ---------- reveal ---------- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { rootMargin: '-8% 0px -8% 0px', threshold: 0.05 }
);
$$('.reveal').forEach((n) => io.observe(n));

$('#scrollDown')?.addEventListener('click', () => {
  window.scrollTo({ top: window.innerHeight * 1.2, behavior: 'smooth' });
});

/* ---------- alert feed canvas: procedural coastline ---------- */
(function feed() {
  const host = $('#topo');
  if (!host) return;
  const cv = document.createElement('canvas');
  cv.id = 'feedCv';
  host.prepend(cv);
  const ctx = cv.getContext('2d');
  let w = 0, h = 0;

  function resize() {
    const r = host.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio, 2);
    w = r.width; h = r.height;
    cv.width = Math.max(1, w * dpr);
    cv.height = Math.max(1, h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  /* A deterministic coastline: coast on the right, open sea to the left,
     mangroves as a dotted band along the shore. */
  function shoreY(x) {
    const u = x / Math.max(1, w);
    return h * (0.30 + 0.16 * Math.sin(u * 3.1) + 0.06 * Math.sin(u * 9.3 + 1.2) + 0.22 * u);
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // open sea
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#08202f');
    g.addColorStop(0.55, '#0b2a3d');
    g.addColorStop(1, '#0e3247');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // depth soundings
    ctx.fillStyle = 'rgba(79, 209, 224, 0.10)';
    for (let x = 0; x < w; x += 26) {
      for (let y = 0; y < h; y += 26) {
        const n = Math.sin(x * 0.021) + Math.cos(y * 0.017) + Math.sin((x + y) * 0.009);
        if (n > 1.15) ctx.fillRect(x, y, 2, 2);
      }
    }

    // land mass
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) ctx.lineTo(x, shoreY(x));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = '#123a4e';
    ctx.fill();
    ctx.strokeStyle = 'rgba(79, 209, 224, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) (x ? ctx.lineTo : ctx.moveTo).call(ctx, x, shoreY(x));
    ctx.stroke();

    // mangrove band
    ctx.fillStyle = 'rgba(79, 209, 224, 0.30)';
    for (let x = 0; x < w; x += 7) {
      const sy = shoreY(x);
      const t = Math.sin(x * 0.06) * 0.5 + 0.5;
      for (let k = 0; k < 4 * t; k++) {
        ctx.fillRect(x + (k % 2) * 3, sy + 4 + k * 7, 2, 2);
      }
    }

    // patrol track
    ctx.strokeStyle = 'rgba(240, 166, 60, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    for (let x = 0; x <= w; x += 6) {
      const y = shoreY(x) - 46 - 26 * Math.sin(x / Math.max(1, w) * 4.6);
      (x ? ctx.lineTo : ctx.moveTo).call(ctx, x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // contacts
    const dots = [[0.18, 0.24], [0.33, 0.72], [0.52, 0.44], [0.68, 0.36], [0.80, 0.62], [0.44, 0.20]];
    for (const [fx, fy] of dots) {
      const x = fx * w, y = fy * h;
      ctx.fillStyle = 'rgba(79, 209, 224, 0.9)';
      ctx.beginPath(); ctx.arc(x, y, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(79, 209, 224, 0.35)';
      ctx.beginPath(); ctx.arc(x, y, 7, 0, Math.PI * 2); ctx.stroke();
    }

    // sweep line
    const t = performance.now() * 0.00004;
    const sx = ((t % 1) * w);
    const sg = ctx.createLinearGradient(sx - 90, 0, sx, 0);
    sg.addColorStop(0, 'rgba(79, 209, 224, 0)');
    sg.addColorStop(1, 'rgba(79, 209, 224, 0.10)');
    ctx.fillStyle = sg;
    ctx.fillRect(sx - 90, 0, 90, h);
  }

  resize();
  addEventListener('resize', resize);

  /* Only animate the sweep on capable machines, and only while visible. */
  let raf = null;
  const loop = () => { draw(); raf = requestAnimationFrame(loop); };
  if (!LOW_POWER) {
    const vis = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { if (!raf) loop(); }
        else if (raf) { cancelAnimationFrame(raf); raf = null; }
      });
    }, { threshold: 0 });
    vis.observe(host);
  }
})();

/* ---------- alert markers ---------- */
$$('.marker').forEach((m) => {
  m.addEventListener('click', (e) => {
    if (e.target.closest('.tip')) return;
    const open = m.classList.contains('open');
    $$('.marker').forEach((o) => o.classList.remove('open'));
    if (!open) m.classList.add('open');
  });
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.marker')) $$('.marker').forEach((o) => o.classList.remove('open'));
});

/* ---------- loader is registered at the top of this file ---------- */
