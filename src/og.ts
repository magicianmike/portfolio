import { Resvg } from '@resvg/resvg-js'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import satori from 'satori'

/**
 * A page's link preview (Open Graph) image, 1200 by 630, made at build time: a scrap of the site's ruled page, with
 * the red margin line, a Margin note, the page's title and a line about it. Its colours are the light theme's tokens.
 */
export type Card = { note: string; title: string; line: string }

// From the project's root: this module is bundled before it runs, so a path relative to it wouldn't hold.
const font = (pkg: string, file: string) =>
  readFile(join(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file))

const fonts = Promise.all([
  font('bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff'),
  font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff'),
  font('caveat', 'caveat-latin-700-normal.woff'),
])

const colour = {
  paper: '#fdfdfb',
  rule: '#dbe6f2',
  margin: '#e9a5a5',
  text: '#24272b',
  muted: '#5d6269',
  pen: '#2456a6',
}

type Node = { type: string; props: Record<string, unknown> }
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
})

export async function renderCard({ note, title, line }: Card): Promise<Buffer> {
  const [display, body, hand] = await fonts
  const tree = el(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      backgroundColor: colour.paper,
      backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 51px, ${colour.rule} 51px, ${colour.rule} 52px)`,
      fontFamily: 'Plex',
      color: colour.text,
    },
    [
      el('div', { display: 'flex', width: 240, justifyContent: 'flex-end', padding: '96px 28px 0 24px' }, [
        el(
          'div',
          { fontFamily: 'Caveat', fontSize: 38, color: colour.pen, transform: 'rotate(-2deg)', textAlign: 'right' },
          note,
        ),
      ]),
      el('div', { width: 4, height: 630, backgroundColor: colour.margin }),
      el('div', { display: 'flex', flexDirection: 'column', flex: 1, padding: '80px 72px 64px 40px' }, [
        el(
          'div',
          { fontFamily: 'Bricolage', fontSize: title.length > 40 ? 64 : 84, lineHeight: 1.02, letterSpacing: -2 },
          title,
        ),
        el('div', { marginTop: 28, fontSize: 32, lineHeight: 1.4, color: colour.muted }, line),
        el('div', { marginTop: 'auto', fontFamily: 'Bricolage', fontSize: 30 }, 'Mikel McCormick'),
      ]),
    ],
  )
  const svg = await satori(tree as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Bricolage', data: display, weight: 800, style: 'normal' },
      { name: 'Plex', data: body, weight: 400, style: 'normal' },
      { name: 'Caveat', data: hand, weight: 700, style: 'normal' },
    ],
  })
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
}
