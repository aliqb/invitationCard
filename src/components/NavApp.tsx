import { CONFIG } from '../config'
import type { NavigationApp } from '../navigations'

type Props = {
  app: NavigationApp
  /** Resolved destination URL for this app. */
  href: string
  /** Position in the row; sets the stagger so tiles appear one after another. */
  index: number
  /** How many tiles there are; used to reverse the stagger when hiding. */
  count: number
  visible: boolean
}

/** One navigation-app tile: opens the venue in that app. */
export function NavApp({ app, href, index, count, visible }: Props) {
  // Appear left-to-right; disappear right-to-left, a bit quicker.
  const { navStaggerIn, navStaggerOut } = CONFIG.timing.chrome
  const delay = visible ? index * navStaggerIn : (count - 1 - index) * navStaggerOut

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Navigate with ${app.title}`}
      className={[
        'flex w-[min(19vw,84px)] flex-col items-center gap-1.5 rounded-2xl bg-white/80 p-2 shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)] backdrop-blur transition-[opacity,translate,scale] duration-(--t-nav-tile) ease-out active:scale-95',
        visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-90 opacity-0',
      ].join(' ')}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <img src={app.image} alt="" draggable={false} className="aspect-square w-full rounded-xl object-contain" />
      <span className="text-xs capitalize leading-none text-(--hint-text)">{app.title}</span>
    </a>
  )
}
