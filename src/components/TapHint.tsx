/** "Tap to open" prompt. Overlay chrome: lives outside the scene so the reveal does not scale it. */
export function TapHint({ visible }: { visible: boolean }) {
  return (
    <div
      className={[
        'pointer-events-none absolute inset-x-0 bottom-[max(1.75rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-2 px-6 text-center transition-opacity duration-500',
        visible ? 'opacity-100' : 'opacity-0',
      ].join(' ')}
    >
      <span className="font-display text-xl uppercase tracking-[0.3em] text-[#e9d9bb]">Tap to open</span>
      <span className="h-6 w-px animate-pulse bg-[#c9a96a]" />
    </div>
  )
}
