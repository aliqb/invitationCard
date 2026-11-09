import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'

/** Swap this for your own artwork (any aspect ratio - it is never cropped). */
const IMAGE_SRC = '/invitation.svg'

/* Geometry shared between the CSS layout and the reveal math.
   The card is CARD_WIDTH_PCT wide inside the envelope and, once pulled out,
   sits RISE_PCT of its own height above its resting spot. */
const CARD_WIDTH_PCT = 62
const CARD_INSET_PCT = (100 - CARD_WIDTH_PCT) / 2
const RISE_PCT = -175
const CARD_SCALE_IN = 0.78

const STAGES = ['hidden', 'entering', 'flipping', 'ready', 'opening', 'rising', 'presented'] as const
type Stage = (typeof STAGES)[number]
const at = (stage: Stage, name: Stage) => STAGES.indexOf(stage) >= STAGES.indexOf(name)

type Reveal = Pick<CSSProperties, 'transform' | 'transformOrigin'>

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export default function App() {
  const [stage, setStage] = useState<Stage>('hidden')
  const [reveal, setReveal] = useState<Reveal | null>(null)

  const envelopeRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  /* Opening act: the back of the envelope drifts in, then it flips to the front. */
  const start = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setReveal(null)
    setStage('hidden')
    after(60, () => setStage('entering'))
    after(1500, () => setStage('flipping'))
    after(2800, () => setStage('ready'))
  }, [after])

  useEffect(() => {
    start()
    return () => timers.current.forEach(clearTimeout)
  }, [start])

  /* Where the card ends up: centred in the viewport and scaled to fit it whole.
     Everything here is layout geometry (offsetWidth / offsetHeight), so it stays
     correct even while the scene already carries a transform. */
  const measureReveal = useCallback((): Reveal | null => {
    const card = cardRef.current
    const envelope = envelopeRef.current
    if (!card || !envelope) return null

    const vw = window.innerWidth
    const vh = window.innerHeight
    const cw = card.offsetWidth
    const ch = card.offsetHeight

    // The scene fills the viewport and centres the envelope, so the envelope's
    // untransformed centre is always the viewport centre.
    const left = vw / 2 - envelope.offsetWidth / 2 + (CARD_INSET_PCT / 100) * envelope.offsetWidth
    const top = vh / 2 + (RISE_PCT / 100) * ch
    const originX = left + cw / 2
    const originY = top + ch / 2

    const pad = Math.min(20, vw * 0.04)
    const scale = Math.min((vw - pad * 2) / cw, (vh - pad * 2) / ch)

    return {
      transform: `translate(${vw / 2 - originX}px, ${vh / 2 - originY}px) scale(${scale})`,
      transformOrigin: `${originX}px ${originY}px`,
    }
  }, [])

  const open = useCallback(() => {
    if (stage !== 'ready') return
    setStage('opening')
    after(700, () => setStage('rising'))
    after(1150, () => {
      setReveal(measureReveal())
      setStage('presented')
    })
  }, [after, measureReveal, stage])

  useEffect(() => {
    if (stage !== 'presented') return
    const onResize = () => setReveal(measureReveal())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [measureReveal, stage])

  const entered = at(stage, 'entering')
  const flipped = at(stage, 'flipping')
  const ready = stage === 'ready'
  const opened = at(stage, 'opening')
  const risen = at(stage, 'rising')
  const presented = stage === 'presented'

  return (
    <main className="fixed inset-0 overflow-hidden select-none bg-[radial-gradient(120%_120%_at_50%_0%,#3a2b22_0%,#1b1410_60%,#120d0a_100%)]">
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-[1300ms]"
        style={{ transitionTimingFunction: EASE, ...(reveal ?? {}) }}
      >
        <div
          ref={envelopeRef}
          role="button"
          tabIndex={ready ? 0 : -1}
          aria-label="Open the invitation"
          onClick={open}
          onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              open()
            }
          }}
          className={[
            'relative aspect-[3/2] w-[min(86vw,420px)] outline-none transition-[opacity,transform] duration-[900ms]',
            entered ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-8 scale-90 opacity-0',
            ready ? 'cursor-pointer' : 'cursor-default',
          ].join(' ')}
          style={{ perspective: '1600px', transitionTimingFunction: EASE }}
        >
          <div
            className="relative h-full w-full transition-transform duration-[1300ms]"
            style={{
              transformStyle: 'preserve-3d',
              transitionTimingFunction: EASE,
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            <EnvelopeBack faded={presented} />

            <div
              className="absolute inset-0"
              style={{
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              {/* paper behind the card */}
              <div
                className={[
                  'absolute inset-0 rounded-[14px] bg-[linear-gradient(160deg,#f6ecdb,#e3d2b8)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] transition-opacity duration-700',
                  presented ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
              />

              {/* the invitation itself */}
              <div
                ref={cardRef}
                className="absolute top-1/2 aspect-[3/4] rounded-[10px] bg-white p-[3.5%] shadow-[0_24px_50px_-18px_rgba(0,0,0,0.6)] transition-transform duration-[1300ms] will-change-transform"
                style={{
                  left: `${CARD_INSET_PCT}%`,
                  width: `${CARD_WIDTH_PCT}%`,
                  zIndex: 10,
                  transitionTimingFunction: EASE,
                  transform: risen
                    ? `translateY(${RISE_PCT}%) scale(1)`
                    : `translateY(-50%) scale(${CARD_SCALE_IN})`,
                }}
              >
                <img
                  src={IMAGE_SRC}
                  alt="Invitation"
                  draggable={false}
                  className="h-full w-full rounded-[6px] object-contain"
                />
              </div>

              {/* front pocket, overlapping the card while it is tucked away */}
              <div
                className={[
                  'absolute inset-0 rounded-[14px] bg-[linear-gradient(190deg,#efe2cb,#d9c5a6)] transition-opacity duration-700',
                  presented ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
                style={{
                  zIndex: 20,
                  clipPath: 'polygon(0% 34%, 50% 0%, 100% 34%, 100% 100%, 0% 100%)',
                }}
              />

              {/* flap, hinged on the top edge */}
              <div
                className={[
                  'absolute inset-x-0 top-0 h-full transition-[transform,opacity] duration-[900ms]',
                  presented ? 'opacity-0' : 'opacity-100',
                ].join(' ')}
                style={{
                  zIndex: opened ? 5 : 30,
                  transformOrigin: '50% 0%',
                  transformStyle: 'preserve-3d',
                  transitionTimingFunction: EASE,
                  transform: opened ? 'rotateX(-172deg)' : 'rotateX(0deg)',
                }}
              >
                <div
                  className="h-full w-full rounded-t-[14px] bg-[linear-gradient(175deg,#f8efe0,#e0cdae)] shadow-[0_6px_14px_-8px_rgba(0,0,0,0.45)]"
                  style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 34%, 50% 70%, 0% 34%)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* overlay chrome - stays at viewport scale */}
      <div
        className={[
          'pointer-events-none absolute inset-x-0 bottom-[max(1.75rem,env(safe-area-inset-bottom))] flex flex-col items-center gap-2 px-6 text-center transition-opacity duration-500',
          ready ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
      >
        <span className="font-display text-xl uppercase tracking-[0.3em] text-[#e9d9bb]">Tap to open</span>
        <span className="h-6 w-px animate-pulse bg-[#c9a96a]" />
      </div>

      <button
        type="button"
        onClick={start}
        className={[
          'absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs uppercase tracking-widest text-white/70 backdrop-blur transition-opacity duration-500 hover:text-white',
          presented ? 'opacity-100' : 'pointer-events-none opacity-0',
        ].join(' ')}
      >
        Replay
      </button>
    </main>
  )
}

function EnvelopeBack({ faded }: { faded: boolean }) {
  const seam = 'absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.35),rgba(0,0,0,0.08))]'
  return (
    <div
      className={['absolute inset-0 transition-opacity duration-700', faded ? 'opacity-0' : 'opacity-100'].join(' ')}
      style={{ backfaceVisibility: 'hidden' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-[linear-gradient(160deg,#f3e8d5,#ddc9a9)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)]">
        {/* side and bottom flaps, folded in */}
        <div className={seam} style={{ clipPath: 'polygon(0% 0%, 50% 50%, 0% 100%)' }} />
        <div className={seam} style={{ clipPath: 'polygon(100% 0%, 50% 50%, 100% 100%)' }} />
        <div className={seam} style={{ clipPath: 'polygon(0% 100%, 50% 50%, 100% 100%)' }} />
        {/* top flap, folded down over the rest */}
        <div
          className="absolute inset-0 bg-[linear-gradient(175deg,#f9f0e1,#e6d4b6)]"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 52%)' }}
        />
      </div>
      {/* wax seal */}
      <div className="absolute left-1/2 top-1/2 flex h-[18%] w-[12%] min-w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#c5453f,#7e1f1f)] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.6)]">
        <span className="font-display text-sm leading-none text-white/80">&amp;</span>
      </div>
    </div>
  )
}
