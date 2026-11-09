import type { CSSProperties } from 'react'

/** A two-stop gradient: `from` is the lit side, `to` the shaded side. */
type Gradient = { from: string; to: string }

export type Theme = {
  /** Radial page background, glowing from the top centre outward. */
  background: { center: string; middle: string; edge: string }
  envelope: {
    /** Back face and the paper behind the card. */
    paper: Gradient
    /** Front pocket that covers the tucked-in card. */
    pocket: Gradient
    /** Top flap, on both the back and the front. */
    flap: Gradient
    /** Wax seal on the back. */
    seal: Gradient
  }
  /** "Tap to open" hint: must read clearly against `background`. */
  hint: { text: string; line: string }
}

/** Edit these to restyle the page. */
export const THEME: Theme = {
  background: { center: '#ecfff9', middle: '#a9ffe4', edge: '#5eecc0' },
  envelope: {
    paper: { from: '#f7e6b0', to: '#ecd08a' },
    pocket: { from: '#f2dc9c', to: '#dfc073' },
    flap: { from: '#faecc0', to: '#e9cf8c' },
    seal: { from: '#c5453f', to: '#7e1f1f' },
  },
  hint: { text: '#0b5545', line: '#128a6b' },
}

/* Exposes the theme as CSS custom properties, set once on the root element.
   Components reference them in Tailwind arbitrary values, e.g.
   bg-[linear-gradient(160deg,var(--paper-from),var(--paper-to))]. */
export function themeVars({ background, envelope, hint }: Theme): CSSProperties {
  const vars: Record<string, string> = {
    '--bg-center': background.center,
    '--bg-middle': background.middle,
    '--bg-edge': background.edge,
    '--hint-text': hint.text,
    '--hint-line': hint.line,
  }
  for (const [part, { from, to }] of Object.entries(envelope)) {
    vars[`--${part}-from`] = from
    vars[`--${part}-to`] = to
  }
  return vars as CSSProperties
}
