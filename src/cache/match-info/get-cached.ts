import { transaction } from '..'
import { ProcessedMatch } from '@/api/match-info'
import { createMatchDbKey } from '@/utils/create-match-db-key'
import { preventUndefinedResolve } from '@/utils/prevent-undefined-resolve'

export const getCachedMatchInfo = (eventKey: string, matchKey: string) =>
  transaction<ProcessedMatch | undefined>('matches', async matchStore => {
    return matchStore.get(createMatchDbKey(eventKey, matchKey))
  }).then(preventUndefinedResolve)
