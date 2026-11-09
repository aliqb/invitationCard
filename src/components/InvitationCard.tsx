import type { Ref } from 'react'
import { CARD_INSET_PCT, CARD_SCALE_IN, CARD_WIDTH_PCT, EASE, RISE_PCT } from '../config'

type Props = {
  ref: Ref<HTMLDivElement>
  src: string
  alt?: string
  risen: boolean
}

/** The invitation itself: tucked inside the envelope until `risen`, then pulled out above it. */
export function InvitationCard({ ref, src, alt = 'Invitation', risen }: Props) {
  return (
    <div
      ref={ref}
      className="absolute top-1/2 aspect-3/4 rounded-[10px] bg-white p-[3.5%] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.6)] transition-transform duration-1300 will-change-transform"
      style={{
        left: `${CARD_INSET_PCT}%`,
        width: `${CARD_WIDTH_PCT}%`,
        zIndex: 10,
        transitionTimingFunction: EASE,
        transform: risen ? `translateY(${RISE_PCT}%) scale(1)` : `translateY(-50%) scale(${CARD_SCALE_IN})`,
      }}
    >
      <img src={src} alt={alt} draggable={false} className="h-full w-full rounded-md object-contain" />
    </div>
  )
}
