/* Ordered: `at()` compares indices, so flags are cumulative. Insert new stages
   at the right position or every `at()` check silently changes meaning. */
export const STAGES = ['hidden', 'entering', 'flipping', 'ready', 'unsealing', 'opening', 'rising', 'presented'] as const

export type Stage = (typeof STAGES)[number]

export const at = (stage: Stage, name: Stage) => STAGES.indexOf(stage) >= STAGES.indexOf(name)
