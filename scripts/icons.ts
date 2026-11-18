/**
 * Renders `public/favicon.svg` to the PNG icons that can't be SVG: `apple-touch-icon.png` (180px) and
 * `favicon.ico` (32px, a PNG inside an ICO, which every browser reads). Run it again if the SVG changes.
 */
import { Resvg } from '@resvg/resvg-js'
import { readFile, writeFile } from 'node:fs/promises'

const publicDir = new URL('../public/', import.meta.url)
const svg = await readFile(new URL('favicon.svg', publicDir), 'utf8')

// The light colours: an icon on a home screen or a tab bar can't follow the system's theme.
const png = (size: number) => new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng()

await writeFile(new URL('apple-touch-icon.png', publicDir), png(180))

const image = png(32)
const header = Buffer.alloc(22)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // an icon
header.writeUInt16LE(1, 4) // one image
header.writeUInt8(32, 6) // width
header.writeUInt8(32, 7) // height
header.writeUInt8(0, 8) // no palette
header.writeUInt8(0, 9) // reserved
header.writeUInt16LE(1, 10) // colour planes
header.writeUInt16LE(32, 12) // bits per pixel
header.writeUInt32LE(image.length, 14)
header.writeUInt32LE(22, 18) // where the image starts
await writeFile(new URL('favicon.ico', publicDir), Buffer.concat([header, image]))
console.log('Wrote apple-touch-icon.png and favicon.ico')
