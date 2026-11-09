import { Envelope } from './components/Envelope'
import { InvitationCard } from './components/InvitationCard'
import { ReplayButton } from './components/ReplayButton'
import { TapHint } from './components/TapHint'
import { EASE, IMAGE_SRC } from './config'
import { useInvitationSequence } from './hooks/useInvitationSequence'
import { THEME, themeVars } from './theme'

export default function App() {
  const { envelopeRef, cardRef, reveal, start, open, entered, flipped, ready, opened, risen, presented } =
    useInvitationSequence()

  return (
    <main
      className="fixed inset-0 overflow-hidden select-none bg-[radial-gradient(120%_120%_at_50%_0%,var(--bg-center)_0%,var(--bg-middle)_60%,var(--bg-edge)_100%)]"
      style={themeVars(THEME)}
    >
      {/* the scene: fills the viewport and centres the envelope (measureReveal relies on this) */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-1300"
        style={{ transitionTimingFunction: EASE, ...(reveal ?? {}) }}
      >
        <Envelope
          ref={envelopeRef}
          entered={entered}
          flipped={flipped}
          ready={ready}
          opened={opened}
          presented={presented}
          onOpen={open}
        >
          <InvitationCard ref={cardRef} src={IMAGE_SRC} risen={risen} />
        </Envelope>
      </div>

      {/* overlay chrome - stays at viewport scale */}
      <TapHint visible={ready} />
      <ReplayButton visible={presented} onClick={start} />
    </main>
  )
}
