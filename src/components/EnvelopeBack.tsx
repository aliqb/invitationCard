const SEAM = 'absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(0,0,0,0.08))]'

/** The sealed back of the envelope: folded flaps and the wax seal. */
export function EnvelopeBack({ faded }: { faded: boolean }) {
  return (
    <div
      className={['absolute inset-0 transition-opacity duration-700', faded ? 'opacity-0' : 'opacity-100'].join(' ')}
      style={{ backfaceVisibility: 'hidden' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,var(--paper-from),var(--paper-to))] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)]">
        {/* side and bottom flaps, folded in */}
        <div className={SEAM} style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }} />
        <div className={SEAM} style={{ clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)' }} />
        <div className={SEAM} style={{ clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)' }} />
        {/* top flap, folded down over the rest */}
        <div
          className="absolute inset-0 bg-[linear-gradient(175deg,var(--flap-from),var(--flap-to))]"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 52%)' }}
        />
      </div>
      <WaxSeal />
    </div>
  )
}

function WaxSeal() {
  return (
    <div className="absolute left-1/2 top-1/2 flex h-[18%] w-[12%] min-w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,var(--seal-from),var(--seal-to))] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.6)]">
      <span className="font-display text-sm leading-none text-white/80">&amp;sadsadsa</span>
    </div>
  )
}
