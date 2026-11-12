import { useCallback, useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { measureReveal, type Reveal } from '../reveal'
import { at, type Stage } from '../stages'

/** The stage machine: owns the timeline, the reveal transform and the refs it measures. */
export function useInvitationSequence() {
  const [stage, setStage] = useState<Stage>('hidden')
  const [reveal, setReveal] = useState<Reveal | null>(null)

  const envelopeRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const music = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(false)

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      if (music.current) music.current.muted = !m
      return !m
    })
  }, [])

  /* Created once and preloaded, so play() inside the click starts without a download delay. */
  useEffect(() => {
    const audio = new Audio(CONFIG.music.src)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = CONFIG.music.volume
    music.current = audio
    return () => {
      audio.pause()
      music.current = null
    }
  }, [])

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms))
  }, [])

  const measure = useCallback(() => {
    const card = cardRef.current
    const envelope = envelopeRef.current
    return card && envelope ? measureReveal(card, envelope) : null
  }, [])

  /* Opening act: the back of the envelope drifts in, then it flips to the front.
     Also the Replay handler, so it must stay re-entrant. */
  const start = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    if (music.current) {
      music.current.pause()
      music.current.currentTime = 0
    }
    setReveal(null)
    setStage('hidden')
    const { flipDelay, flip } = CONFIG.timing.intro
    // a frame or two after mount, so the hidden pose is painted and the drift-in transitions
    after(60, () => setStage('entering'))
    after(flipDelay, () => setStage('flipping'))
    after(flipDelay + flip, () => setStage('ready'))
  }, [after])

  useEffect(() => {
    start()
    return () => timers.current.forEach(clearTimeout)
  }, [start])

  /* Click-driven act: the seal cracks, the flap swings open, the card slides out sideways,
     turns upright, then the scene zooms onto it. Delays are built from the durations in
     CONFIG.timing (config.ts) so the stages stay in step with the transitions. */
  const open = useCallback(() => {
    if (stage !== 'ready') return
    const { unseal, riseDelay, rise, turnOverlap, turn } = CONFIG.timing.open
    // the card starts rising once the flap is well past upright, not when it has landed
    const riseAt = unseal + riseDelay
    // start turning just before the slide fully settles, so the two moves flow together
    const turnAt = riseAt + rise - turnOverlap
    const presentAt = turnAt + turn
    // must be called synchronously in the click handler, or mobile browsers block autoplay
    music.current?.play().catch(() => {})
    setStage('unsealing')
    after(unseal, () => setStage('opening'))
    after(riseAt, () => setStage('rising'))
    after(turnAt, () => setStage('turning'))
    after(presentAt, () => {
      setReveal(measure())
      setStage('presented')
    })
  }, [after, measure, stage])

  useEffect(() => {
    if (stage !== 'presented') return
    const onResize = () => setReveal(measure())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [measure, stage])

  return {
    reveal,
    envelopeRef,
    cardRef,
    start,
    open,
    muted,
    toggleMute,
    entered: at(stage, 'entering'),
    flipped: at(stage, 'flipping'),
    ready: stage === 'ready',
    unsealed: at(stage, 'unsealing'),
    opened: at(stage, 'opening'),
    risen: at(stage, 'rising'),
    turned: at(stage, 'turning'),
    presented: stage === 'presented',
  }
}
