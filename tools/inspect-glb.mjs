import { NodeIO } from '@gltf-transform/core'
const io = new NodeIO()
const doc = await io.read('public/models/anvik.glb')
const scene = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0]
const walk = (n, d = 0) => {
  const mesh = n.getMesh() ? ` MESH(${n.getMesh().listPrimitives()[0].getAttribute('POSITION').getCount()}v)` : ''
  console.log('  '.repeat(d) + n.getName() + mesh)
  n.listChildren().forEach((c) => walk(c, d + 1))
}
scene.listChildren().forEach((c) => walk(c))
