import type { CSSProperties } from 'react'

/** URL for a file in public/, prefixed with Vite's `base` ('/' in dev, '/invitationCard/' when
    built for GitHub Pages). Always use this - a bare '/path' works locally but 404s on Pages. */
export const asset = (path: string) => import.meta.env.BASE_URL + path

/** Everything you might want to tweak, in one place. */
export const CONFIG = {
  /** The invitation artwork. Any aspect ratio - it is never cropped. */
  image: asset('feri_final.jpg'),

  /** Background music, started when the envelope is opened (the click lets browsers allow it). */
  music: {
    src: asset('musics/Taknavazi-Kamkar.mp3'),
    volume: 0.6,
  },

  /** Wax seal on the flap's tip. Transparent PNG; keep it small (it renders ~70px wide).
      If the new image has a different aspect ratio, update `aspect-[…]` in WaxSeal.tsx. */
  seal: asset('seal.png'),

  /** Venue location passed to each NAV_APPS resolver (navigations.ts). Neshan's link is fixed
      and ignores this, so update it in navigations.ts separately if the venue changes. */
  venue: { lat: '35.7722086', long: '51.3747414' },

  /** Height (px) kept clear at the bottom of the reveal so the Footer never covers the card. */
  footerReservePx: 72,

  /** Card geometry, shared between the CSS layout (InvitationCard) and the reveal math
      (measureReveal). Only the final pose (widthPct, risePct) matters to measureReveal. */
  card: {
    /** Card width as % of the envelope width. */
    widthPct: 62,
    /** Final upright pose: this % of its own height above its resting spot. */
    risePct: -175,
    /** Scale while tucked in. The card lies sideways inside the 3:2 envelope, so
        widthPct x 4/3 x scaleIn and widthPct x 3/2 x scaleIn must both stay under 100
        (at 62 and 0.9: 74 and 84), or the card pokes past the envelope edges. */
    scaleIn: 0.9,
    /** Sideways angle while tucked in and while sliding out. */
    tuckedDeg: -90,
    /** Where the sideways card stops once slid out: just clear of the envelope's top edge. */
    riseFlatPct: -135,
  },

  /** The flap opening, in two moves. Positive rotateX swings the flap's free edge toward the
      viewer; 188deg lands it just past flat, slightly *behind* the envelope plane, so the
      rising card is painted in front of it. */
  flap: {
    unsealDeg: 14,
    openDeg: 188,
  },

  /** Every animation timing, in milliseconds (plus the easing curves). The stage delays in
      useInvitationSequence are derived from these, so the stages stay in step with the CSS
      transitions - change a duration here and the sequence follows. */
  timing: {
    /** Page load: the envelope's back drifts in (fixed, see Envelope.tsx), then flips to its front. */
    intro: {
      /** Page load -> flip starts. The envelope becomes clickable once the flip ends. */
      flipDelay: 1500,
      flip: 2000,
    },
    /** After the click: seal tug, flap swing, card slides out sideways, then turns upright. */
    open: {
      /** The flap's small first tug loose. */
      unseal: 320,
      /** The flap's full swing open. */
      flap: 1000,
      /** End of the tug -> card starts sliding out (the flap is well past upright by then). */
      riseDelay: 700,
      rise: 700,
      /** The turn starts this long before the slide ends, so the two moves flow together. */
      turnOverlap: 100,
      turn: 850,
    },
    /** End of the turn: the scene zooms onto the card while the envelope fades away. */
    reveal: {
      zoom: 1300,
      envelopeFade: 700,
    },
    /** Overlay chrome (hint, Replay/Mute buttons, footer, navigation tiles). */
    chrome: {
      /** Tap hint and the Replay / Mute buttons fading in and out. */
      fade: 500,
      footer: 600,
      /** Presented -> footer slides in (lets the zoom mostly finish first). */
      footerDelay: 900,
      navTile: 400,
      /** Per-tile delay as the navigation tiles appear, and (quicker) as they hide. */
      navStaggerIn: 90,
      navStaggerOut: 40,
    },
    ease: {
      /** Soft ease-out used by most moves. */
      default: 'cubic-bezier(0.22, 1, 0.36, 1)',
      /** Slow start (paper resists), fast swing, and a tiny overshoot as it settles. */
      flapOpen: 'cubic-bezier(0.55, 0, 0.2, 1.06)',
      /** Ease-in-out for the card's turn upright. */
      cardTurn: 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
} as const

/** Derived from CONFIG.card.widthPct (the card is centred horizontally) - not a setting. */
export const CARD_INSET_PCT = (100 - CONFIG.card.widthPct) / 2

/* The timings used by Tailwind classes, exposed as CSS custom properties on <main> (like
   themeVars). Components use them as e.g. duration-(--t-fade). */
export function timingVars(): CSSProperties {
  const { intro, reveal, chrome } = CONFIG.timing
  const vars: Record<string, string> = {
    '--t-flip': `${intro.flip}ms`,
    '--t-zoom': `${reveal.zoom}ms`,
    '--t-envelope-fade': `${reveal.envelopeFade}ms`,
    '--t-fade': `${chrome.fade}ms`,
    '--t-footer': `${chrome.footer}ms`,
    '--t-footer-delay': `${chrome.footerDelay}ms`,
    '--t-nav-tile': `${chrome.navTile}ms`,
  }
  return vars as CSSProperties
}

