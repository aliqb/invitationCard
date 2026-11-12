import { CONFIG } from '../config'

type Props = {
  /** Extra classes, e.g. the fade-out once the card is presented. */
  className?: string
}

/** The wax seal, centred on the flap's tip and carried by the flap. Width is % of the envelope width; height follows the image. */
export function WaxSeal({ className = '' }: Props) {
  return (
    <div
      className={`absolute left-1/2 top-[70%] aspect-[1290/1219] w-[15%] min-w-12 -translate-x-1/2 -translate-y-1/2 ${className}`}
      style={{
        // Lifted off the flap's plane (no z-fighting), and hidden once the flap swings past
        // upright, since it is on the flap's outside face, which then points away from the viewer.
        transform: 'translateZ(1px)',
        backfaceVisibility: 'hidden',
      }}
    >
      <img
        src={CONFIG.seal}
        alt=""
        draggable={false}
        className="h-full w-full drop-shadow-[0_3px_4px_rgba(0,0,0,0.35)]"
      />
    </div>
  )
}
