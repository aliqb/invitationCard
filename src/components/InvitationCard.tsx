import type { Ref } from 'react'
import {
  CARD_INSET_PCT,
  CARD_RISE_MS,
  CARD_SCALE_IN,
  CARD_TUCKED_DEG,
  CARD_TURN_EASE,
  CARD_TURN_MS,
  CARD_WIDTH_PCT,
  EASE,
  RISE_FLAT_PCT,
  RISE_PCT,
} from '../config'

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
  const [y, deg, scale] = turned
    ? [RISE_PCT, 0, 1]
    : risen
      ? [RISE_FLAT_PCT, CARD_TUCKED_DEG, 1]
      : [-50, CARD_TUCKED_DEG, CARD_SCALE_IN]
  const [duration, ease] = turned ? [CARD_TURN_MS, CARD_TURN_EASE] : [CARD_RISE_MS, EASE]

  return (
    <div
      ref={ref}
      className="absolute top-1/2 aspect-3/4 rounded-[10px] bg-white p-[3.5%] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.6)] transition-transform will-change-transform"
      style={{
        left: `${CARD_INSET_PCT}%`,
        width: `${CARD_WIDTH_PCT}%`,
        zIndex: 10,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: ease,
        transform: `translateY(${y}%) rotate(${deg}deg) scale(${scale})`,
      }}
    >
      <img src={src} alt={alt} draggable={false} className="h-full w-full rounded-md object-contain" />
    </div>
  )
}
