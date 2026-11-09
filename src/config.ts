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
