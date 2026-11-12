import type { ReactNode, Ref } from 'react'
import { CONFIG } from '../config'
import { EnvelopeBack } from './EnvelopeBack'
import { EnvelopeFront } from './EnvelopeFront'

type Props = {
  ref: Ref<HTMLDivElement>
  /** What is tucked inside the envelope (the invitation card). */
  children: ReactNode
  entered: boolean
  flipped: boolean
  ready: boolean
  unsealed: boolean
  opened: boolean
  presented: boolean
  onOpen: () => void
}

/** The clickable envelope: drifts in, flips from back to front, then opens on click. */
export function Envelope({ ref, children, entered, flipped, ready, unsealed, opened, presented, onOpen }: Props) {
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={ready ? 0 : -1}
      aria-label="Open the invitation"
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
      className={[
        'relative aspect-3/2 w-[min(86vw,600px)] outline-none transition-[opacity,transform] duration-900',
        entered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-90 opacity-0',
        ready ? 'cursor-pointer' : 'cursor-default',
      ].join(' ')}
      style={{ perspective: '1600px', transitionTimingFunction: CONFIG.timing.ease.default }}
    >
      {/* flip container: its rotateY(180deg) composes with EnvelopeFront's to the identity */}
      <div
        className="relative h-full w-full transition-transform duration-(--t-flip)"
        style={{
          transformStyle: 'preserve-3d',
          transitionTimingFunction: CONFIG.timing.ease.default,
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <EnvelopeBack faded={presented} />
        <EnvelopeFront unsealed={unsealed} opened={opened} faded={presented}>
          {children}
        </EnvelopeFront>
      </div>
    </div>
  )
}
