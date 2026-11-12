
/** The back of the envelope: folded flaps. (The wax seal lives on the front flap.) */
export function EnvelopeBack({ faded }: { faded: boolean }) {
  return (
    <div
      className={['absolute inset-0 transition-opacity duration-(--t-envelope-fade)', faded ? 'opacity-0' : 'opacity-100'].join(' ')}
      // translateZ lifts the back off the front face's plane. EnvelopeFront is preserve-3d, so its
      // children ignore its backface-visibility and would otherwise z-fight with this face.
      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(2px)' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,var(--back-from),var(--back-to))] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)]">

      </div>
    </div>
  )
}
