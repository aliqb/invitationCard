import type { ReactNode } from 'react'
import { EASE, FLAP_OPEN_DEG, FLAP_OPEN_EASE, FLAP_OPEN_MS, FLAP_UNSEAL_DEG, FLAP_UNSEAL_MS } from '../config'
import { WaxSeal } from './WaxSeal'

type Props = {
  /** The card tucked inside; rendered between the back paper and the pocket. */
  children: ReactNode
  unsealed: boolean
  opened: boolean
  faded: boolean
}

/* Layering: inside wall (auto) -> card (10) -> pocket (20) -> seal's bottom half (25) ->
   flap (30, drops to 5 once opened). The pocket and closed-flap clip-paths are complementary
   and must tile the whole face. */

const FLAP_CLIP = 'polygon(0% 0%, 100% 0%, 100% 34%, 50% 70%, 0% 34%)'

/** The front of the envelope. Permanently rotateY(180deg) to cancel the flip container's rotation. */
export function EnvelopeFront({ children, unsealed, opened, faded }: Props) {
  const fade = `transition-opacity duration-700 ${faded ? 'opacity-0' : 'opacity-100'}`
  return (
    <div
      className="absolute inset-0"
      style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
    >
      {/* inside of the envelope, behind the card: only visible once the flap is open */}
      <div
        className={`absolute inset-0 rounded-[14px] bg-[linear-gradient(170deg,var(--inside-to),var(--inside-from))] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] ${fade}`}
      />

      {children}

      {/* front pocket, overlapping the card while it is tucked away */}
      <div
        className={`absolute inset-0 rounded-[14px] bg-[linear-gradient(190deg,var(--pocket-from),var(--pocket-to))] ${fade}`}
        style={{ zIndex: 20, clipPath: 'polygon(0% 34%, 100% 34%, 100% 100%, 0% 100%)' }}
      />

      {/* the half of the seal that stays stuck to the envelope when it cracks */}
      <WaxSeal half="bottom" className={fade} zIndex={25} />

      <Flap unsealed={unsealed} opened={opened} fade={fade} />
    </div>
  )
}

/** The top flap, hinged on the envelope's top edge: tugs loose, then swings up and over toward the viewer. */
function Flap({ unsealed, opened, fade }: { unsealed: boolean; opened: boolean; fade: string }) {
  const angle = opened ? FLAP_OPEN_DEG : unsealed ? FLAP_UNSEAL_DEG : 0
  const [duration, ease] = opened ? [FLAP_OPEN_MS, FLAP_OPEN_EASE] : [FLAP_UNSEAL_MS, EASE]
  const shadeTiming = { transitionDuration: `${duration}ms`, transitionTimingFunction: ease }

  return (
    // No opacity on this element: opacity < 1 would flatten its preserve-3d children, breaking the
    // two-sided faces below. The fade lives on each face instead.
    <div
      className="absolute inset-0 transition-transform"
      style={{
        zIndex: opened ? 5 : 30,
        transformOrigin: '50% 0%',
        transformStyle: 'preserve-3d',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: ease,
        transform: `rotateX(${angle}deg)`,
      }}
    >
      {/* outside face: darkens as it tilts away from the light, hidden past upright */}
      <div
        className={`absolute inset-0 overflow-hidden rounded-t-[14px] bg-[linear-gradient(175deg,var(--flap-from),var(--flap-to))] ${fade}`}
        style={{ clipPath: FLAP_CLIP, backfaceVisibility: 'hidden' }}
      >
        <div
          className="absolute inset-0 bg-black transition-opacity"
          style={{ ...shadeTiming, opacity: opened ? 0.3 : unsealed ? 0.06 : 0 }}
        />
      </div>

      {/* inside face: the same shape turned to face the other way (the shape is symmetric, so
          rotateY keeps it in place). Seen once the flap passes upright; starts in shadow and
          brightens as it lies back flat. */}
      <div
        className={`absolute inset-0 overflow-hidden rounded-t-[14px] bg-[linear-gradient(175deg,var(--inside-from),var(--inside-to))] ${fade}`}
        style={{ clipPath: FLAP_CLIP, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <div
          className="absolute inset-0 bg-black transition-opacity"
          style={{ ...shadeTiming, opacity: opened ? 0 : 0.4 }}
        />
      </div>

      {/* sibling of the clipped faces so the clip-path doesn't cut it; rides the flap's rotation */}
      <WaxSeal half="top" className={fade} />
    </div>
  )
}
