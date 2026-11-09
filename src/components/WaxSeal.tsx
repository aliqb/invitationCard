/* The seal cracks in two along a jagged line: the top half rides away on the flap, the bottom
   half stays stuck to the envelope. The two clip-paths are complementary, so while the flap is
   closed they read as one unbroken seal. */
const CRACK = '100% 52%, 82% 45%, 66% 56%, 50% 46%, 34% 55%, 18% 47%, 0% 53%'
const CLIP = {
  top: `polygon(0% 0%, 100% 0%, ${CRACK})`,
  bottom: `polygon(${CRACK}, 0% 100%, 100% 100%)`,
}

type Props = {
  half: 'top' | 'bottom'
  /** Extra classes, e.g. the fade-out once the card is presented. */
  className?: string
  zIndex?: number
}

/** One half of the wax seal, centred on the flap's tip. Sized against the 3:2 envelope: 12% wide = 18% tall = a circle. */
export function WaxSeal({ half, className = '', zIndex }: Props) {
  return (
    <div
      className={`absolute left-1/2 top-[70%] flex h-[18%] w-[12%] min-w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--seal-from),var(--seal-to))] ${className}`}
      style={{
        zIndex,
        clipPath: CLIP[half],
        // Lifted off its plane (no z-fighting). The top half is hidden once the flap swings past
        // upright, since it is on the flap's outside face, which then points away from the viewer.
        transform: 'translateZ(1px)',
        backfaceVisibility: 'hidden',
      }}
    >
      <span className="font-display text-sm leading-none text-white/80">&amp;</span>
    </div>
  )
}
