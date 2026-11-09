import type { CSSProperties } from 'react'
import { CARD_INSET_PCT, RISE_PCT } from './config'

export type Reveal = Pick<CSSProperties, 'transform' | 'transformOrigin'>

/* Where the card ends up: centred in the viewport and scaled to fit it whole.
   Everything here is layout geometry (offsetWidth / offsetHeight), so it stays
   correct even while the scene already carries a transform. */
export function measureReveal(card: HTMLElement, envelope: HTMLElement): Reveal {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const cw = card.offsetWidth
  const ch = card.offsetHeight

  // The scene fills the viewport and centres the envelope, so the envelope's
  // untransformed centre is always the viewport centre.
  const left = vw / 2 - envelope.offsetWidth / 2 + (CARD_INSET_PCT / 100) * envelope.offsetWidth
  const top = vh / 2 + (RISE_PCT / 100) * ch
  const originX = left + cw / 2
  const originY = top + ch / 2

  const pad = Math.min(20, vw * 0.04)
  const scale = Math.min((vw - pad * 2) / cw, (vh - pad * 2) / ch)

  return {
    transform: `translate(${vw / 2 - originX}px, ${vh / 2 - originY}px) scale(${scale})`,
    transformOrigin: `${originX}px ${originY}px`,
  }
}
