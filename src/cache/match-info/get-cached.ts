import { transaction } from '..'
import { ProcessedMatchInfo } from 'src/api/match-info'
import { createMatchDbKey } from 'src/utils/create-match-db-key'
import { preventUndefinedResolve } from 'src/utils/prevent-undefined-resolve'

export const getCachedMatchInfo = (eventKey: string, matchKey: string) =>
  transaction<ProcessedMatchInfo | undefined>('matches', (matchStore) =>
    matchStore.get(createMatchDbKey(eventKey, matchKey)),
  ).then(preventUndefinedResolve)
