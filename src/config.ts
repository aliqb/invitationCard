/** Swap this for your own artwork (any aspect ratio - it is never cropped). */
export const IMAGE_SRC = '/invitation.svg'

/* Geometry shared between the CSS layout (InvitationCard) and the reveal math
   (measureReveal). The card is CARD_WIDTH_PCT wide inside the envelope and, once
   pulled out, sits RISE_PCT of its own height above its resting spot. */
export const CARD_WIDTH_PCT = 62
export const CARD_INSET_PCT = (100 - CARD_WIDTH_PCT) / 2
export const RISE_PCT = -175
export const CARD_SCALE_IN = 0.78

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
