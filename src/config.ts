/** URL for a file in public/, prefixed with Vite's `base` ('/' in dev, '/invitationCard/' when
    built for GitHub Pages). Always use this - a bare '/path' works locally but 404s on Pages. */
export const asset = (path: string) => import.meta.env.BASE_URL + path

/** Swap this for your own artwork (any aspect ratio - it is never cropped). */
export const IMAGE_SRC = asset('feri_rotated.jpg')

/** Venue location passed to each NAV_APPS resolver (navigations.ts). Neshan's link is fixed
    and ignores this, so update it in navigations.ts separately if the venue changes. */
export const VENUE = { lat: '35.7722086', long: '51.3747414' }

/** Height (px) kept clear at the bottom of the reveal so the Footer never covers the card. */
export const FOOTER_RESERVE_PX = 72

/** Wax seal on the flap's tip. Transparent PNG; keep it small (it renders ~70px wide).
    If the new image has a different aspect ratio, update `aspect-[…]` in WaxSeal.tsx. */
export const SEAL_SRC = asset('seal.png')

/* Geometry shared between the CSS layout (InvitationCard) and the reveal math
   (measureReveal). The card is CARD_WIDTH_PCT wide inside the envelope and, once
   pulled out and turned upright, sits RISE_PCT of its own height above its resting spot.
   Only that final pose matters to measureReveal; the in-between poses are free. */
export const CARD_WIDTH_PCT = 62
export const CARD_INSET_PCT = (100 - CARD_WIDTH_PCT) / 2
export const RISE_PCT = -175

/* While tucked in and while sliding out, the card lies sideways (landscape).
   Tucked fit, envelope 3:2, card 3:4: across = 62% x 4/3 x scale of the envelope width,
   tall = 62% x 3/2 x scale of its height - both must stay under 100%. At 0.9: 74% and 84%. */
export const CARD_SCALE_IN = 0.9
export const CARD_TUCKED_DEG = -90
/** Where the sideways card stops once slid out: just clear of the envelope's top edge. */
export const RISE_FLAT_PCT = -135
export const CARD_RISE_MS = 700
export const CARD_TURN_MS = 850
/** Ease-in-out for the turn upright. */
export const CARD_TURN_EASE = 'cubic-bezier(0.65, 0, 0.35, 1)'

export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

/* The flap opening, in two moves. Positive rotateX swings the flap's free edge toward the
   viewer; 188deg lands it just past flat, slightly *behind* the envelope plane, so the rising
   card is painted in front of it. */
export const FLAP_UNSEAL_MS = 320
export const FLAP_UNSEAL_DEG = 14
export const FLAP_OPEN_MS = 1000
export const FLAP_OPEN_DEG = 188
/** Slow start (paper resists), fast swing, and a tiny overshoot as it settles. */
export const FLAP_OPEN_EASE = 'cubic-bezier(0.55, 0, 0.2, 1.06)'
