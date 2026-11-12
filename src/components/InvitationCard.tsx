import type { Ref } from 'react'
import { CARD_INSET_PCT, CONFIG } from '../config'

type Props = {
  ref: Ref<HTMLDivElement>
  src: string
  alt?: string
  /** Slid up out of the envelope, still lying sideways. */
  risen: boolean
  /** Turned upright into its final pose. */
  turned: boolean
}

/** The invitation itself: lies sideways in the envelope, slides out, then turns upright. */
export function InvitationCard({ ref, src, alt = 'Invitation', risen, turned }: Props) {
  // Every pose uses the same function list (translateY, rotate, scale) so the browser
  // interpolates each one independently. The layout box itself stays portrait; the
  // sideways look is purely the rotate.
  const { card, timing } = CONFIG
  const [y, deg, scale] = turned
    ? [card.risePct, 0, 1]
    : risen
      ? [card.riseFlatPct, card.tuckedDeg, 1]
      : [-50, card.tuckedDeg, card.scaleIn]
  const [duration, ease] = turned
    ? [timing.open.turn, timing.ease.cardTurn]
    : [timing.open.rise, timing.ease.default]

  return (
    <div
      ref={ref}
      className="absolute top-1/2 aspect-3/4 rounded-[10px] bg-white  shadow-[0_24px_50px_-18px_rgba(0,0,0,0.6)] transition-transform will-change-transform"
      style={{
        left: `${CARD_INSET_PCT}%`,
        width: `${card.widthPct}%`,
        zIndex: 10,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: ease,
        transform: `translateY(${y}%) rotate(${deg}deg) scale(${scale})`,
      }}
    >
      <img src={src} alt={alt} draggable={false} className="h-full w-full rounded-md object-cover" />
    </div>
  )
}
