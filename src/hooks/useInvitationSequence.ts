import { useCallback, useEffect, useRef, useState } from 'react'
import { measureReveal, type Reveal } from '../reveal'
import { at, type Stage } from '../stages'

/** The stage machine: owns the timeline, the reveal transform and the refs it measures. */
export function useInvitationSequence() {
  const [stage, setStage] = useState<Stage>('hidden')
  const [reveal, setReveal] = useState<Reveal | null>(null)

  const envelopeRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

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

  /* Click-driven act: the flap opens, the card rises, then the scene zooms onto it. */
  const open = useCallback(() => {
    if (stage !== 'ready') return
    setStage('opening')
    after(700, () => setStage('rising'))
    after(1150, () => {
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
    entered: at(stage, 'entering'),
    flipped: at(stage, 'flipping'),
    ready: stage === 'ready',
    opened: at(stage, 'opening'),
    risen: at(stage, 'rising'),
    presented: stage === 'presented',
  }
}
