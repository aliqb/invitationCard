import { useId, useState } from 'react'
import { CONFIG } from '../config'
import { NAV_APPS } from '../navigations'
import { NavApp } from './NavApp'

/** Bottom footer shown once the card is presented. Tapping "Navigation" reveals one NavApp tile
    per entry in NAV_APPS. Overlay chrome: lives outside the scene so the reveal does not scale it. */
export function Footer({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false)
  const tilesId = useId()

  // Collapse the tiles whenever the footer hides (e.g. Replay), so it comes back closed.
  // Adjusting state during render on a prop change, per React's guidance, instead of an effect.
  const [wasVisible, setWasVisible] = useState(visible)
  if (visible !== wasVisible) {
    setWasVisible(visible)
    if (!visible) setOpen(false)
  }

  const expanded = visible && open

  return (
    <footer
      className={[
        'absolute inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-3 px-4 transition-[opacity,translate] duration-(--t-footer) ease-out',
        // wait for the zoom onto the card to mostly finish before sliding in
        visible ? 'translate-y-0 opacity-100 delay-(--t-footer-delay)' : 'pointer-events-none translate-y-4 opacity-0',
      ].join(' ')}
    >
      <div
        id={tilesId}
        inert={!expanded}
        className={['flex flex-wrap justify-center gap-3', expanded ? '' : 'pointer-events-none'].join(' ')}
      >
        {NAV_APPS.map((app, i) => (
          <NavApp
            key={app.id}
            app={app}
            href={app.resolver(CONFIG.venue.lat, CONFIG.venue.long)}
            index={i}
            count={NAV_APPS.length}
            visible={expanded}
          />
        ))}
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={tilesId}
        onClick={() => setOpen((o) => !o)}
        className="cursor-pointer rounded-full bg-white/70 px-5 py-2 text-sm font-medium uppercase tracking-[0.2em] text-(--hint-text) shadow-[0_6px_16px_-8px_rgba(0,0,0,0.4)] backdrop-blur transition-colors hover:bg-white/90"
      >
        مسیریابی
      </button>
    </footer>
  )
}
