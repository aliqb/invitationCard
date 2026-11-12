/** Mutes / unmutes the background music. Overlay chrome: lives outside the scene so the reveal
    does not scale it. Styled to match ReplayButton, mirrored to the top-left corner. */
export function MuteButton({ visible, muted, onClick }: { visible: boolean; muted: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={muted ? 'پخش موسیقی' : 'قطع موسیقی'}
      aria-pressed={muted}
      className={[
        'absolute left-3 top-[max(0.75rem,env(safe-area-inset-top))] flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/70 backdrop-blur transition-opacity duration-500 hover:text-white',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
        {muted ? (
          <path d="m22 9-6 6m0-6 6 6" />
        ) : (
          <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" />
        )}
      </svg>
    </button>
  )
}
