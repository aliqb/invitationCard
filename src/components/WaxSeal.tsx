/** Wax seal, centred on the flap's tip. Sized against the 3:2 envelope: 12% wide = 18% tall = a circle. */
export function WaxSeal() {
  return (
    <div
      className="absolute left-1/2 top-[70%] flex h-[18%] w-[12%] min-w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--seal-from),var(--seal-to))] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.6)]"
      // Lifted off the flap's plane (no z-fighting) and hidden once the flap swings open,
      // since the seal is on the outside face, which then points away from the viewer.
      style={{ transform: 'translateZ(1px)', backfaceVisibility: 'hidden' }}
    >
      <span className="font-display text-sm leading-none text-white/80">&amp;</span>
    </div>
  )
}
