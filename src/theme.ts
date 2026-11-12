import type { CSSProperties } from 'react'

/** A two-stop gradient: `from` is the lit side, `to` the shaded side. */
type Gradient = { from: string; to: string }

export type Theme = {
  /** Radial page background, glowing from the top centre outward. */
  background: { center: string; middle: string; edge: string }
  envelope: {
    /** Back face of the envelope. */
    back: Gradient
    /** Inside of the envelope: the wall behind the card and the flap's underside. */
    inside: Gradient
    /** Front of the envelope: the pocket that covers the tucked-in card. */
    front: Gradient
    /** Outside of the top flap. */
    flap: Gradient
  }
  /** "Tap to open" hint: must read clearly against `background`. */
  hint: { text: string; line: string }
}

/** Edit these to restyle the page. */
export const THEME: Theme = {
  background: { center: '#e6d3a8', middle: '#cfb27c', edge: '#b38f5a' },
  envelope: {
    back: { from: '#f0e2c2', to: '#d9c191' },
    inside: { from: '#1f2a6b', to: '#121a4a' },
    front: { from: '#f8eed8', to: '#e8d6ae' },
    flap: { from: '#f0e2c2', to: '#d9c191' },
  },
  hint: { text: '#1a2366', line: '#2aa3b8' },
}

/* Exposes the theme as CSS custom properties, set once on the root element.
   Components reference them in Tailwind arbitrary values, e.g.
   bg-[linear-gradient(160deg,var(--back-from),var(--back-to))]. */
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
