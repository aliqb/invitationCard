# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server with HMR
npm run build    # tsc -b type-check, then production build to dist/
npm run preview  # serve the built dist/
npm run lint     # oxlint (NOT eslint — there is no eslint config)
```

There is no test setup in this project: no test runner, no test files, no `test` script.

## What this is

A single-page online invitation card: an envelope animates in showing its back, flips to its
front, and on click the flap opens and the invitation card rises out and scales up to fill the
viewport. Mobile-first. Vite + React 19 + Tailwind v4.

### File map

- [src/App.tsx](src/App.tsx) — composition only: the viewport-filling scene div (which carries
  the reveal transform) plus the overlay chrome.
- [src/hooks/useInvitationSequence.ts](src/hooks/useInvitationSequence.ts) — the stage machine:
  timers, `start()` / `open()`, the reveal state, the resize listener, and the two refs it
  measures. It returns the derived boolean flags; components never see `stage` itself.
- [src/stages.ts](src/stages.ts) — `STAGES`, the `Stage` type and `at()`.
- [src/config.ts](src/config.ts) — `IMAGE_SRC`, the shared geometry constants and `EASE`.
- [src/theme.ts](src/theme.ts) — `THEME`: background, envelope, wax-seal and hint colours. `App`
  sets it on `<main>` as CSS custom properties (`themeVars()`); components read them as
  `var(--paper-from)` etc. inside Tailwind arbitrary values. Don't hardcode colours in components.
  The `theme-color` meta in [index.html](index.html) is static and should match `background.edge`.
- [src/reveal.ts](src/reveal.ts) — `measureReveal(card, envelope)`, a pure function.
- [src/components/](src/components/) — `Envelope` (clickable wrapper + flip container) →
  `EnvelopeBack` (folded flaps) and `EnvelopeFront` (paper, pocket, flap, and a `children`
  slot for the card); `WaxSeal`, which sits on the flap's tip (outside the flap's clip-path
  div so it isn't cut off) with `backface-visibility: hidden` so it vanishes as the flap opens; `InvitationCard`; `TapHint`; `ReplayButton`.

`App` passes `InvitationCard` as `Envelope`'s children, which forwards it into `EnvelopeFront`'s
slot between the paper and the pocket — that slot position is the layering contract below.
Refs are passed as plain `ref` props (React 19), not `forwardRef`.

## Animation architecture

The whole sequence is **one ordered stage machine driving CSS transitions** — no keyframes, no
animation library, no per-frame JS.

- `STAGES` is an ordered array and `at(stage, name)` compares array indices, so stage flags are
  *cumulative*: once `risen` is true it stays true. A new stage must be **inserted into `STAGES`
  at the right position**, or every `at()` check silently changes meaning.
- `start()` schedules the opening acts (`entering` → `flipping` → `ready`); `open()` schedules the
  click-driven acts (`opening` → `rising` → `presented`). All timings are the `setTimeout` delays
  in those two functions — that is the only place to retune pacing.
- Every timer handle is collected in `timers.current` and cleared by `start()`. `start()` is also
  the Replay button's handler, so it must stay re-entrant.

### The JS ↔ CSS geometry contract

`CARD_WIDTH_PCT` / `CARD_INSET_PCT` / `RISE_PCT` / `CARD_SCALE_IN` are consumed **both** by the
card's inline styles and by `measureReveal()`. They are a shared contract, not local constants.

`measureReveal()` computes the final scene transform that centres the card in the viewport and
scales it to fit whole. It depends on two layout facts:

1. The scene div fills the viewport and centres the envelope, so the envelope's **untransformed**
   centre is always the viewport centre (that is why the viewport centre is used directly instead
   of measuring the envelope's position).
2. It reads `offsetWidth`/`offsetHeight` only — layout values, unaffected by transforms — so it
   stays correct even when the scene already carries the reveal transform (needed for the
   resize/orientation recompute).

Changing the scene to not be viewport-filling and centred, or repositioning the card, breaks this
function. It is re-run on `resize` and `orientationchange` while `presented`.

### Two invariants that are easy to break

- **Nothing is clipped anywhere.** The tucked-away card is hidden purely by being *covered*, so it
  must fit inside the envelope: with the envelope at `aspect-[3/2]`, `CARD_WIDTH_PCT × 4/3 ×
  CARD_SCALE_IN` must stay under the envelope height, or the card peeks out before the reveal.
- **The closed flap and the front pocket must tile the whole envelope face.** Their `clipPath`
  polygons are complementary (flap bottom edge runs 34% at the edges → 70% at the centre; pocket
  top edge runs 34% at the edges → 0% at the centre). The flap's bottom edge must sit at or below
  the pocket's top edge at every x, or the card shows through the gap.

### Layering inside the front face

`zIndex` order is base paper (auto) → card `10` → pocket `20` → flap `30`. The flap drops to `5`
once `opened`, so the risen card is not painted behind the opened flap's plane.

### The deliberate double rotation

The flip container rotates `rotateY(180deg)` *and* the front face is permanently
`rotateY(180deg)`. The two compose to the identity, which is what keeps the front face's content
from rendering mirrored. This is correct — do not "simplify" it away. Both the container and the
front face need `transformStyle: preserve-3d` for the nested flap rotation to work.

Because the front face is `preserve-3d`, its children live in the shared 3D context and ignore the
front face's own `backface-visibility: hidden` — they render (mirrored) behind the back face, on
the same plane. `EnvelopeBack` therefore carries `translateZ(2px)` to win the depth test; removing
it brings back z-fighting (the back face flickers with the mirrored front layers before the flip).

### Overlay chrome

The "Tap to open" hint and the Replay button are rendered **outside** the scene div so the reveal
transform does not scale them. Anything that should stay at viewport scale belongs there.

## Swapping the artwork

`IMAGE_SRC` in [src/config.ts](src/config.ts) points at `public/invitation.svg`, a
placeholder. The image uses `object-contain` inside an `aspect-[3/4]` card, so any aspect ratio
renders uncropped — but a landscape image will letterbox unless the card's `aspect-[3/4]` is
changed to match.

## Styling

Tailwind v4 through `@tailwindcss/vite` ([vite.config.ts](vite.config.ts)) — there is no
`tailwind.config.js` and adding one will not be picked up. Theme tokens live in the `@theme` block
in [src/index.css](src/index.css); the display font is loaded by a `<link>` in
[index.html](index.html).

Visual detail (envelope paper, folded flaps, wax seal) is Tailwind arbitrary-value gradients and
`clipPath` polygons — no images. Keep sizing proportional (`%`, `vw`, `min()`) rather than fixed
pixels; the reveal math and the mobile-first layout both depend on it. Safe-area insets are
already handled for the hint and Replay button.

`src/assets/` (`hero.png`, `vite.svg`) and `public/icons.svg` are unused Vite template leftovers.
