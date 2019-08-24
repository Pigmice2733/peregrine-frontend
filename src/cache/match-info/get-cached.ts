import { transaction } from '..'
import { ProcessedMatchInfo } from '@/api/match-info'
import { createMatchDbKey } from '@/utils/create-match-db-key'
import { preventUndefinedResolve } from '@/utils/prevent-undefined-resolve'

export const getCachedMatchInfo = (eventKey: string, matchKey: string) =>
  transaction<ProcessedMatchInfo | undefined>('matches', async matchStore => {
    return matchStore.get(createMatchDbKey(eventKey, matchKey))
  }).then(preventUndefinedResolve)
