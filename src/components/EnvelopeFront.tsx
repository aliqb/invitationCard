import type { ReactNode } from 'react'
import { EASE } from '../config'

type Props = {
  /** The card tucked inside; rendered between the back paper and the pocket. */
  children: ReactNode
  opened: boolean
  faded: boolean
}

/* Layering: paper (auto) -> card (10) -> pocket (20) -> flap (30, drops to 5 once opened).
   The pocket and closed-flap clip-paths are complementary and must tile the whole face. */

/** The front of the envelope. Permanently rotateY(180deg) to cancel the flip container's rotation. */
export function EnvelopeFront({ children, opened, faded }: Props) {
  const fade = faded ? 'opacity-0' : 'opacity-100'
  return (
    <div
      className="absolute inset-0"
      style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
    >
      {/* paper behind the card */}
      <div
        className={`absolute inset-0 rounded-[14px] bg-[linear-gradient(160deg,#f6ecdb,#e3d2b8)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] transition-opacity duration-700 ${fade}`}
      />

      {children}

      {/* front pocket, overlapping the card while it is tucked away */}
      <div
        className={`absolute inset-0 rounded-[14px] bg-[linear-gradient(190deg,#efe2cb,#d9c5a6)] transition-opacity duration-700 ${fade}`}
        style={{ zIndex: 20, clipPath: 'polygon(0% 34%, 50% 0%, 100% 34%, 100% 100%, 0% 100%)' }}
      />

      <Flap opened={opened} fade={fade} />
    </div>
  )
}

/** The top flap, hinged on the envelope's top edge. */
function Flap({ opened, fade }: { opened: boolean; fade: string }) {
  return (
    <div
      className={`absolute inset-x-0 top-0 h-full transition-[transform,opacity] duration-900 ${fade}`}
      style={{
        zIndex: opened ? 5 : 30,
        transformOrigin: '50% 0%',
        transformStyle: 'preserve-3d',
        transitionTimingFunction: EASE,
        transform: opened ? 'rotateX(-172deg)' : 'rotateX(0deg)',
      }}
    >
      <div
        className="h-full w-full rounded-t-[14px] bg-[linear-gradient(175deg,#f8efe0,#e0cdae)] shadow-[0_6px_14px_-8px_rgba(0,0,0,0.45)]"
        style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 34%, 50% 70%, 0% 34%)' }}
      />
    </div>
  )
}
