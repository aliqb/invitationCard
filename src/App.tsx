import { Envelope } from './components/Envelope'
import { InvitationCard } from './components/InvitationCard'
import { Footer } from './components/Footer'
import { MuteButton } from './components/MuteButton'
import { ReplayButton } from './components/ReplayButton'
import { TapHint } from './components/TapHint'
import { CONFIG, timingVars } from './config'
import { useInvitationSequence } from './hooks/useInvitationSequence'
import { THEME, themeVars } from './theme'

export default function App() {
  const { envelopeRef, cardRef, reveal, start, open, muted, toggleMute, entered, flipped, ready, unsealed, opened, risen, turned, presented } =
    useInvitationSequence()

  return (
    <main
      className="fixed inset-0 overflow-hidden select-none bg-[radial-gradient(120%_120%_at_50%_0%,var(--bg-center)_0%,var(--bg-middle)_60%,var(--bg-edge)_100%)]"
      style={{ ...themeVars(THEME), ...timingVars() }}
    >
      {/* the scene: fills the viewport and centres the envelope (measureReveal relies on this) */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-(--t-zoom)"
        style={{ transitionTimingFunction: CONFIG.timing.ease.default, ...(reveal ?? {}) }}
      >
        <Envelope
          ref={envelopeRef}
          entered={entered}
          flipped={flipped}
          ready={ready}
          unsealed={unsealed}
          opened={opened}
          presented={presented}
          onOpen={open}
        >
          <InvitationCard ref={cardRef} src={CONFIG.image} risen={risen} turned={turned} />
        </Envelope>
      </div>

      {/* overlay chrome - stays at viewport scale */}
      <TapHint visible={ready} />
      <MuteButton visible={unsealed} muted={muted} onClick={toggleMute} />
      <ReplayButton visible={presented} onClick={start} />
      <Footer visible={presented} />
    </main>
  )
}
