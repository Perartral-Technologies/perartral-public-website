import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ==================================================================
 * Stage — one persistent full-viewport canvas for the whole page
 * ================================================================== */
const stage = document.getElementById('stage');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
  stencil: false,          // unused, and saves a buffer on every render target
});
/* Cap the pixel ratio. On a HiDPI laptop, ratio 2 renders 4x the pixels of
   ratio 1 — the single biggest memory and fill-rate cost on a modest machine.
   1.5 keeps it crisp while cutting framebuffer memory by roughly 44%. */
const MAX_DPR = 1.5;
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, MAX_DPR));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const FOV = 40;
const CAM_D = 2.7;
const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.01, 100);
camera.position.set(0, 0, CAM_D);
camera.lookAt(0, 0, 0);

const halfH = CAM_D * Math.tan(THREE.MathUtils.degToRad(FOV / 2));
let halfW = halfH * (innerWidth / innerHeight);

/* Lights. White airframe against a dark sea-blue page: restrained, or the
   white clips out and the panel detail disappears. */
scene.add(new THREE.HemisphereLight(0xffffff, 0x24435a, 0.85));
const key = new THREE.DirectionalLight(0xffffff, 1.05);
key.position.set(2.6, 4.2, 3.4);
scene.add(key);
const fill = new THREE.DirectionalLight(0x8fc4e8, 0.40);
fill.position.set(-3.6, 1.2, -2.2);
scene.add(fill);
const rim = new THREE.DirectionalLight(0xffffff, 0.30);
rim.position.set(0.4, -2.0, -3.4);
scene.add(rim);

/* ==================================================================
 * Drone
 * ================================================================== */
const rig = new THREE.Group();    // scroll-driven placement
const spin = new THREE.Group();   // idle hover
const manual = new THREE.Group(); // user drag
spin.add(manual);
rig.add(spin);
scene.add(rig);

const rotors = [];
let ready = false;

/* Spin axes come from the GLB — they genuinely differ per rotor. The two
   forward-facing props turn about Z so that, seen from the nose, the blades
   sweep a circle; the lift rotors turn about Y. */
let rotorAxes = {};

const BASE_SPAN = 2.15;

new GLTFLoader().load('./assets/drone.glb?v=6', (gltf) => {
  const model = gltf.scene;
  rotorAxes = gltf.parser?.json?.extras?.rotorAxes || {};

  model.traverse((o) => {
    if (!o.isMesh) return;
    if (!o.geometry.attributes.normal) o.geometry.computeVertexNormals();
    const label = `${o.name || ''} ${o.parent?.name || ''}`;
    const m = label.match(/(Rotor_\d+)/i);
    const isRotor = !!m;
    o.material = new THREE.MeshStandardMaterial({
      color: 0xffffff,                        // colours are baked per-vertex
      vertexColors: !!o.geometry.attributes.color,
      metalness: isRotor ? 0.34 : 0.14,
      roughness: isRotor ? 0.42 : 0.58,
      side: THREE.DoubleSide,
    });
    if (isRotor) {
      rotors.push({ obj: o, node: m[1], axis: rotorAxes[m[1]] || 'y', phase: rotors.length * 1.7 });
    }
  });

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const mid = box.getCenter(new THREE.Vector3());
  model.position.sub(mid);

  const s = BASE_SPAN / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(s);
  manual.add(model);

  ready = true;
  document.body.dataset.droneReady = '1';
}, (e) => {
  if (e.total) {
    const pct = document.getElementById('loadPct');
    if (pct) pct.textContent = String(Math.round((e.loaded / e.total) * 100));
  }
}, (err) => {
  console.error('drone load failed', err);
  document.body.dataset.droneReady = 'err';
});

/* ==================================================================
 * Drag to rotate. Orbit is applied on top of the scroll pose, so the user can
 * inspect the model without fighting the choreography. Vertical drags are
 * ignored so the page keeps scrolling normally.
 * ================================================================== */
let dragging = false;
let dragX = 0, dragY = 0;
let yawOffset = 0, pitchOffset = 0;
let yawTarget = 0, pitchTarget = 0;

const canvas = renderer.domElement;

canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  dragX = e.clientX;
  dragY = e.clientY;
  stage.classList.add('grabbing');
  canvas.setPointerCapture?.(e.pointerId);
});

canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - dragX;
  const dy = e.clientY - dragY;
  dragX = e.clientX;
  dragY = e.clientY;
  yawTarget += dx * 0.008;
  pitchTarget = Math.max(-0.9, Math.min(0.9, pitchTarget + dy * 0.004));
});

function endDrag() {
  if (!dragging) return;
  dragging = false;
  stage.classList.remove('grabbing');
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('pointerleave', endDrag);

/* ==================================================================
 * Poses
 *   x, y : fraction of the half-viewport; y positive is up
 *   z    : +toward camera
 *   face : yaw radians. 0 = nose at the camera, +PI/2 = broadside
 * ================================================================== */
function P(x, y, z, face, pitch, roll, scale, box) {
  return { x, y, z, face, pitch, roll, scale, box: box || null };
}

const POSES = {
  /* Opens facing the viewer, centred and level. */
  hero:    P(0.00, -0.03, 0.05, 0.02, 0.06, 0.00, 1.02),
  /* Turns broadside and settles into the intro's right-hand column. */
  intro:   P(0.30, 0.00, 0.02, 0.78, 0.07, 0.03, 0.62, '#intro-section .right'),
  gear:    P(0.22, -0.01, 0.03, 1.20, 0.08, 0.00, 0.80),
  /* Pinned stats. */
  lock:    P(0.00, 0.04, 0.06, 1.55, 0.10, 0.00, 0.94),
  solutions: P(0.24, -0.01, 0.03, 1.90, 0.07, 0.03, 0.80),
  /* Capability beats. */
  cap0:    P(0.00, -0.03, 0.06, 2.25, 0.08, 0.00, 0.96),
  cap1:    P(0.00, -0.03, 0.07, 2.60, 0.42, 0.00, 0.88),
  cap2:    P(0.00, -0.03, 0.06, 2.95, 0.06, 0.10, 0.96),
  software: P(0.26, 0.01, 0.03, 3.30, 0.07, -0.03, 0.78),
  /* Landed and resting low. */
  land:    P(0.00, -0.34, 0.02, 3.65, 0.02, 0.00, 0.90),
};

/* ==================================================================
 * Anchors — reference section structure.
 * ================================================================== */
let anchors = [];
const el = (id) => document.getElementById(id);

function boxAt(selector, scrollAt) {
  const e = document.querySelector(selector);
  if (!e) return null;
  const r = e.getBoundingClientRect();
  const docTop = r.top + (window.scrollY || 0);
  const cx = (r.left + r.width / 2) / innerWidth;
  const cy = (docTop - scrollAt + r.height / 2) / innerHeight;
  return { x: (cx - 0.5) * 2, y: (0.5 - cy) * 2 };
}

function buildAnchors() {
  const hero = el('hero'), intro = el('intro-section'), gear = el('gear');
  const lock = el('drone-lock'), sol = el('solutions'), cap = el('capabilities');
  const sw = el('software'), land = el('landing-section');
  if (!cap) return;

  const vh = innerHeight;
  const raw = [];
  const push = (at, p) => raw.push({ at: Math.max(0, at), p });

  /* hero — held while the curtain lifts */
  push(0, POSES.hero);
  push(hero.offsetHeight * 0.62, POSES.hero);

  /* intro — turns into the panel */
  const introAt = intro.offsetTop + vh * 0.05;
  const introPose = { ...POSES.intro };
  const ib = boxAt(POSES.intro.box, introAt);
  if (ib) { introPose.x = ib.x; introPose.y = ib.y; }
  push(introAt, introPose);
  push(intro.offsetTop + intro.offsetHeight - vh * 0.20, introPose);

  push(gear.offsetTop + vh * 0.10, POSES.gear);

  /* pinned stats — the one long hold, because the page itself pins here */
  push(lock.offsetTop, POSES.lock);
  push(lock.offsetTop + (lock.offsetHeight - vh) * 0.88, POSES.lock);

  push(sol.offsetTop + vh * 0.12, POSES.solutions);

  /* capability beats */
  const capTop = cap.offsetTop;
  const capSpan = Math.max(1, cap.offsetHeight - vh);
  push(capTop, POSES.cap0);
  push(capTop + capSpan * 0.40, POSES.cap1);
  push(capTop + capSpan * 0.78, POSES.cap2);

  push(sw.offsetTop + vh * 0.12, POSES.software);

  /* landing — settles low and stays */
  push(land.offsetTop - vh * 0.30, POSES.land);
  push(Math.max(1, document.body.scrollHeight - vh), POSES.land);

  raw.sort((a, b) => a.at - b.at);
  const MIN = 80;
  anchors = [];
  for (const a of raw) {
    const prev = anchors[anchors.length - 1];
    if (!prev) { anchors.push(a); continue; }
    if (a.at - prev.at < MIN) continue;
    anchors.push(a);
  }
  if (anchors.length < 2) anchors = [{ at: 0, p: POSES.hero }, { at: 1, p: POSES.hero }];
  buildTangents();
}

/* ==================================================================
 * C1-continuous interpolation: velocity carries through every anchor, so the
 * turn never stalls the way a per-segment ease would.
 * ================================================================== */
const FIELDS = ['x', 'y', 'z', 'face', 'pitch', 'roll', 'scale'];
let tangents = [];

function buildTangents() {
  const n = anchors.length;
  tangents = FIELDS.map(() => new Float64Array(n));
  if (n < 2) return;

  FIELDS.forEach((f, fi) => {
    const m = tangents[fi];
    const val = (i) => anchors[i].p[f];
    const pos = (i) => anchors[i].at;

    for (let i = 0; i < n; i++) {
      if (i === 0) m[i] = (val(1) - val(0)) / Math.max(1e-6, pos(1) - pos(0));
      else if (i === n - 1) m[i] = (val(n - 1) - val(n - 2)) / Math.max(1e-6, pos(n - 1) - pos(n - 2));
      else m[i] = (val(i + 1) - val(i - 1)) / Math.max(1e-6, pos(i + 1) - pos(i - 1));
    }

    const flat = (i) => Math.abs(val(i + 1) - val(i)) < 1e-9;
    for (let i = 0; i < n; i++) {
      if ((i > 0 && flat(i - 1)) || (i < n - 1 && flat(i))) m[i] = 0;
    }
  });
}

const cubic = (h00, h10, h01, h11, f0, f1, m0, m1, h) =>
  h00 * f0 + h10 * h * m0 + h01 * f1 + h11 * h * m1;

function poseAt(scroll) {
  const n = anchors.length;
  if (!n) return POSES.hero;
  if (scroll <= anchors[0].at) return anchors[0].p;
  if (scroll >= anchors[n - 1].at) return anchors[n - 1].p;

  let i = 0;
  while (i < n - 2 && anchors[i + 1].at <= scroll) i++;
  const a = anchors[i], b = anchors[i + 1];
  const h = Math.max(1e-6, b.at - a.at);
  const t = Math.min(1, Math.max(0, (scroll - a.at) / h));

  const t2 = t * t, t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  const out = {};
  FIELDS.forEach((f, fi) => {
    const m = tangents[fi];
    out[f] = cubic(h00, h10, h01, h11, a.p[f], b.p[f], m[i], m[i + 1], h);
  });
  return out;
}

buildAnchors();

/* ==================================================================
 * Loop
 * ================================================================== */
let scrollY = 0;
const readScroll = () => { scrollY = window.scrollY || document.documentElement.scrollTop || 0; };
readScroll();
addEventListener('scroll', readScroll, { passive: true });

const clock = new THREE.Clock();
let prevScroll = scrollY;
let velSmooth = 0;

/* ---- adaptive quality state ---- */
let dprScale = 1;        // multiplier on MAX_DPR, user/auto adjusted
let qualityLocked = false;
let frames = 0;
let fpsSince = 0;
let paused = false;

/* On a machine that reports very little RAM, start at reduced resolution rather
   than waiting for the frame rate to prove it. */
if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) {
  dprScale = 0.75;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, MAX_DPR) * dprScale);
  renderer.setSize(innerWidth, innerHeight, false);
}

/* Stop rendering while the tab is hidden — a backgrounded 3D loop wastes
   battery and keeps memory pressure up on a low-RAM machine. */
document.addEventListener('visibilitychange', () => {
  paused = document.hidden;
  if (!paused) { clock.getDelta(); fpsSince = clock.getElapsedTime(); frames = 0; }
});

function tick() {
  if (paused) { requestAnimationFrame(tick); return; }
  requestAnimationFrame(tick);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.getElapsedTime();

  const p = poseAt(scrollY);

  const instV = (scrollY - prevScroll) / Math.max(dt, 1 / 240);
  prevScroll = scrollY;
  velSmooth += (instV - velSmooth) * (1 - Math.exp(-9 * dt));

  rig.position.set(p.x * halfW, p.y * halfH, -p.z * 0.6);
  rig.scale.setScalar(p.scale);

  /* Idle hover keeps it airborne. Scroll influence on attitude is deliberately
     small — the pose change should read as turning, not as lurching. */
  const bob = Math.sin(t * 1.10) * 0.024 + Math.sin(t * 2.35 + 0.9) * 0.008;
  const drift = Math.cos(t * 0.48) * 0.014;

  const vn = Math.max(-1, Math.min(1, velSmooth / 2600));
  const bank = -vn * 0.10;
  const pitchReact = vn * 0.045;

  spin.position.set(drift, bob, 0);
  spin.rotation.set(
    p.pitch + pitchReact + Math.sin(t * 1.0) * 0.006,
    p.face + Math.sin(t * 0.34) * 0.014,
    p.roll + bank + Math.cos(t * 0.80) * 0.008
  );

  /* User drag, eased back toward the target and layered on top of the pose. */
  yawOffset += (yawTarget - yawOffset) * Math.min(1, dt * 8);
  pitchOffset += (pitchTarget - pitchOffset) * Math.min(1, dt * 8);
  manual.rotation.set(pitchOffset, yawOffset, 0);

  /* Rotors, each on its own axis. */
  for (const r of rotors) {
    const w = (17 + Math.sin(t * 3 + r.phase) * 1.5) * dt;
    if (r.axis === 'z') r.obj.rotation.z += w;
    else if (r.axis === 'x') r.obj.rotation.x += w;
    else r.obj.rotation.y += w;
  }

  renderer.render(scene, camera);
  frames++;

  /* ---- adaptive quality ----
     Watch the real frame rate and drop resolution if the machine cannot keep
     up. Cheap laptops stay responsive instead of stuttering; capable machines
     are untouched. */
  if (!qualityLocked && t - fpsSince > 1.5) {
    const fps = frames / (t - fpsSince);
    frames = 0;
    fpsSince = t;
    if (fps < 45 && dprScale > 0.6) {
      dprScale = Math.max(0.6, dprScale - 0.25);
      applyQuality();
    } else if (fps > 58 && dprScale < 1) {
      dprScale = Math.min(1, dprScale + 0.25);
      applyQuality();
    } else if (fps >= 45) {
      qualityLocked = true;   // settled; stop fiddling
    }
  }
}
tick();
fpsSince = clock.getElapsedTime();

/* quality plumbing */
function applyQuality() {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, MAX_DPR) * dprScale);
  renderer.setSize(innerWidth, innerHeight, false);
}
window.__quality = () => ({
  maxDpr: MAX_DPR, scale: dprScale, effective: renderer.getPixelRatio(),
  locked: qualityLocked, paused,
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  halfW = halfH * camera.aspect;
  buildAnchors();
});

addEventListener('load', () => { requestAnimationFrame(buildAnchors); });

/* ==================================================================
 * Hooks for verification
 * ================================================================== */
window.__drone = {
  setCapIndex: () => {},
  ready: () => ready,
  info: () => ({
    tris: renderer.info.render.triangles,
    calls: renderer.info.render.calls,
    rotors: rotors.length,
    axes: rotors.map((r) => `${r.node}:${r.axis}`),
    vertexColours: (() => {
      let has = false;
      rig.traverse((o) => { if (o.isMesh && o.geometry.attributes.color) has = true; });
      return has;
    })(),
    rigScale: +rig.scale.x.toFixed(3),
    yaw: +spin.rotation.y.toFixed(3),
  }),
  rotors: () => rotors.length,
  angles: () => rotors.map((r) => ({
    node: r.node, axis: r.axis,
    rot: [+r.obj.rotation.x.toFixed(2), +r.obj.rotation.y.toFixed(2), +r.obj.rotation.z.toFixed(2)],
  })),
  drag: (yaw, pitch) => { yawTarget = yaw; pitchTarget = pitch; },
  poseAt: (y) => poseAt(y),
  anchors: () => anchors.map((a) => ({ at: a.at, x: +a.p.x.toFixed(3), y: +a.p.y.toFixed(3), face: +a.p.face.toFixed(2), scale: +a.p.scale.toFixed(2) })),
  screenBox: () => {
    const bx = new THREE.Box3().setFromObject(rig);
    if (!isFinite(bx.min.x)) return null;
    const pts = [];
    for (const xs of [bx.min.x, bx.max.x])
      for (const ys of [bx.min.y, bx.max.y])
        for (const zs of [bx.min.z, bx.max.z]) pts.push(new THREE.Vector3(xs, ys, zs).project(camera));
    const xs = pts.map((q) => (q.x + 1) / 2);
    const ys = pts.map((q) => (1 - q.y) / 2);
    return {
      x0: +Math.min(...xs).toFixed(3), x1: +Math.max(...xs).toFixed(3),
      y0: +Math.min(...ys).toFixed(3), y1: +Math.max(...ys).toFixed(3),
      w: +(Math.max(...xs) - Math.min(...xs)).toFixed(3),
      h: +(Math.max(...ys) - Math.min(...ys)).toFixed(3),
    };
  },
  sweep: () => {
    const out = [];
    const end = Math.max(1, document.body.scrollHeight - innerHeight);
    const keepP = rig.position.clone(), keepS = rig.scale.x, keepR = spin.rotation.clone();
    for (let i = 0; i <= 60; i++) {
      const s = (end * i) / 60;
      const p = poseAt(s);
      rig.position.set(p.x * halfW, p.y * halfH, -p.z * 0.6);
      rig.scale.setScalar(p.scale);
      spin.rotation.set(p.pitch, p.face, p.roll);
      rig.updateMatrixWorld(true);
      out.push({ s: Math.round(s), ...window.__drone.screenBox() });
    }
    rig.position.copy(keepP); rig.scale.setScalar(keepS); spin.rotation.copy(keepR);
    return out;
  },
  smoothness: (from = 0, to = null, steps = 2400) => {
    const end = to === null ? Math.max(1, document.body.scrollHeight - innerHeight) : to;
    let prev = null, maxYaw = 0, maxPos = 0, maxJerk = 0, prevD = null;
    for (let i = 0; i <= steps; i++) {
      const q = poseAt(from + (end - from) * (i / steps));
      if (prev) {
        const dy = Math.abs(q.face - prev.face) * 180 / Math.PI;
        const dp = Math.hypot(q.x - prev.x, q.y - prev.y, q.z - prev.z) * 1000;
        maxYaw = Math.max(maxYaw, dy);
        maxPos = Math.max(maxPos, dp);
        if (prevD !== null) maxJerk = Math.max(maxJerk, Math.abs(dy - prevD));
        prevD = dy;
      }
      prev = q;
    }
    return { maxYawStepDeg: +maxYaw.toFixed(4), maxPosStepMilli: +maxPos.toFixed(4), maxYawAccel: +maxJerk.toFixed(4) };
  },
};
