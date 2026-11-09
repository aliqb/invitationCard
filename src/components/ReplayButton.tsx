/** Restarts the sequence. Overlay chrome: lives outside the scene so the reveal does not scale it. */
export function ReplayButton({ visible, onClick }: { visible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs uppercase tracking-widest text-white/70 backdrop-blur transition-opacity duration-500 hover:text-white',
        visible ? 'opacity-100' : 'pointer-events-none opacity-0',
      ].join(' ')}
    >
      Replay
    </button>
  )
}
