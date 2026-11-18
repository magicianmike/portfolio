import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

/**
 * WCAG 2.2 AA contrast for every pair the design uses, in both themes, read from the tokens themselves so a change of
 * value can't slip past. Text needs 4.5:1; the pen's blue marks links and focus, so it's held to text's 4.5:1 too.
 */
const css = readFileSync(new URL('./global.css', import.meta.url), 'utf8')

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector)
  assert.ok(start >= 0, `no ${selector} block`)
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start))
  return Object.fromEntries(
    [...body.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, name, value]) => [name, value]),
  )
}

const themes = { light: block(':root {'), dark: block(":root[data-theme='dark']") }

function channel(hex: string, at: number) {
  const c = parseInt(hex.slice(at, at + 2), 16) / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex: string) {
  return 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5)
}

function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)]
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

function token(tokens: Record<string, string>, name: string) {
  const value = tokens[name]
  assert.ok(value, `no --${name}`)
  return value
}

/** Each set of text colours and the surfaces it sits on: the notebook's, and the resume sheet's. */
const PAIRS = [
  { text: ['text', 'text-muted', 'pen'], surfaces: ['paper', 'card'] },
  { text: ['sheet-ink', 'sheet-body', 'sheet-muted', 'sheet-faint'], surfaces: ['sheet', 'sheet-alt'] },
]

test('the dark theme under the system setting matches the dark theme chosen with the toggle', () => {
  assert.deepEqual(block(":root:not([data-theme='light'])"), themes.dark)
})

for (const [theme, tokens] of Object.entries(themes)) {
  for (const { text, surfaces } of PAIRS) {
    for (const fg of text) {
      for (const bg of surfaces) {
        test(`${fg} on ${bg} is at least 4.5:1, ${theme}`, () => {
          const [a, b] = [token(tokens, fg), token(tokens, bg)]
          const ratio = contrast(a, b)
          assert.ok(ratio >= 4.5, `${fg} ${a} on ${bg} ${b} is ${ratio.toFixed(2)}:1`)
        })
      }
    }
  }
}
