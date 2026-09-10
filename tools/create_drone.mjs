import { mkdir, writeFile } from 'node:fs/promises'
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'

// Node polyfill required by GLTFExporter while it serializes binary GLB data.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) { blob.arrayBuffer().then((result) => { this.result = result; this.onloadend?.() }) }
}

const root = new THREE.Group(); root.name = 'Drone'
const materials = {
  body: new THREE.MeshStandardMaterial({ color: 0x1a2024, metalness: .82, roughness: .26 }),
  carbon: new THREE.MeshStandardMaterial({ color: 0x080a0b, metalness: .48, roughness: .35 }),
  alloy: new THREE.MeshStandardMaterial({ color: 0x9ca7aa, metalness: .92, roughness: .17 }),
  glass: new THREE.MeshStandardMaterial({ color: 0x0b171b, metalness: .8, roughness: .08 }),
  accent: new THREE.MeshStandardMaterial({ color: 0xbd5228, emissive: 0x4b1405, emissiveIntensity: 1 })
}
const mesh = (geometry, material, name, position = [0, 0, 0], rotation = [0, 0, 0]) => {
  const object = new THREE.Mesh(geometry, material); object.name = name; object.position.set(...position); object.rotation.set(...rotation); return object
}

const body = new THREE.Group(); body.name = 'Body'; root.add(body)
body.add(mesh(new THREE.SphereGeometry(1, 48, 24), materials.body, 'AerodynamicShell')); body.children[0].scale.set(1.54, .34, 1.08)
body.add(mesh(new THREE.BoxGeometry(1.7, .25, 1.18, 4, 2, 3), materials.carbon, 'BatteryCompartment', [0, .17, .03]))
body.add(mesh(new THREE.BoxGeometry(.65, .045, .07), materials.accent, 'StatusLight', [0, .38, -.34]))
for (const x of [-.66, .66]) body.add(mesh(new THREE.BoxGeometry(.22, .07, .5), materials.carbon, 'Vent', [x, .11, -.18]))

// Major serviceable systems remain independent groups so the product viewer can
// address them directly during the engineering exploded-view sequence.
const battery = new THREE.Group(); battery.name = 'Battery'; battery.position.set(0, .14, .03); root.add(battery)
battery.add(mesh(new THREE.BoxGeometry(1.15, .18, .68, 5, 2, 3), materials.carbon, 'PowerCell'))
battery.add(mesh(new THREE.BoxGeometry(.83, .025, .42), materials.body, 'BatteryCover', [0, .105, 0]))

const flightController = new THREE.Group(); flightController.name = 'FlightController'; flightController.position.set(0, .36, .03); root.add(flightController)
flightController.add(mesh(new THREE.BoxGeometry(.54, .07, .42), materials.alloy, 'FlightCoreHousing'))
flightController.add(mesh(new THREE.BoxGeometry(.36, .018, .24), materials.accent, 'FlightCoreIndicator', [0, .05, 0]))

const arms = [
  ['FrontLeftArm', -.58, -.42, -.46, .80], ['FrontRightArm', .58, -.42, .46, .80],
  ['RearLeftArm', -.58, .42, -.46, -.80], ['RearRightArm', .58, .42, .46, -.80]
]
for (const [name, x, z, direction, baseAngle] of arms) {
  const arm = new THREE.Group(); arm.name = name; arm.position.set(x, .04, z); arm.rotation.y = baseAngle; root.add(arm)
  arm.add(mesh(new THREE.BoxGeometry(1.48, .16, .24), materials.body, `${name}_CarbonArm`, [.72, 0, 0]))
  const motor = new THREE.Group(); motor.name = `${name}_Motor`; motor.position.set(1.47, .02, 0); arm.add(motor)
  motor.add(mesh(new THREE.CylinderGeometry(.22, .22, .19, 32), materials.alloy, 'MotorHousing'))
  const propeller = new THREE.Group(); propeller.name = `${name}_Propeller`; propeller.position.set(0, .17, 0); motor.add(propeller)
  propeller.add(mesh(new THREE.CylinderGeometry(.08, .08, .12, 20), materials.alloy, 'Hub'))
  for (const angle of [0, Math.PI / 2]) propeller.add(mesh(new THREE.BoxGeometry(.56, .025, .10), materials.carbon, 'Blade', [.18, 0, 0], [0, angle, 0]))
}

const gimbal = new THREE.Group(); gimbal.name = 'CameraGimbal'; gimbal.position.set(0, -.32, .7); root.add(gimbal)
gimbal.rotation.x = .23
gimbal.add(mesh(new THREE.TorusGeometry(.3, .05, 10, 28), materials.alloy, 'GimbalRing', [0, 0, 0], [Math.PI / 2, 0, 0]))
const lens = new THREE.Group(); lens.name = 'CameraLens'; lens.position.set(0, -.09, .13); gimbal.add(lens)
lens.add(mesh(new THREE.SphereGeometry(.27, 28, 18), materials.glass, 'OpticalElement'))
gimbal.add(mesh(new THREE.CircleGeometry(.1, 24), materials.accent, 'LensReflection', [0, -.09, .39]))
const gear = new THREE.Group(); gear.name = 'LandingGear'; root.add(gear)
for (const x of [-.68, .68]) gear.add(mesh(new THREE.BoxGeometry(.08, .48, .08), materials.carbon, 'Leg', [x, -.46, .23], [.18, 0, 0]))

await mkdir(new URL('../public/models/', import.meta.url), { recursive: true })
const exporter = new GLTFExporter()
const glb = await exporter.parseAsync(root, { binary: true, onlyVisible: true })
await writeFile(new URL('../public/models/drone.glb', import.meta.url), new Uint8Array(glb))
console.log('Created public/models/drone.glb')
