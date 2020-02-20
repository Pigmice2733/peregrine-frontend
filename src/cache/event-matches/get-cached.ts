import { transaction } from '..'
import { ProcessedMatchInfo } from '@/api/match-info'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'
import { matchHasTeam } from '@/utils/match-has-team'

export const getCachedEventMatches = (eventKey: string, team?: string) =>
  transaction<ProcessedMatchInfo[]>('matches', matchStore =>
    matchStore.getAll(IDBKeyRange.bound(`${eventKey}-`, `${eventKey}-z`)),
  )
    .then(results => (team ? results.filter(matchHasTeam(team)) : results))
    .then(preventEmptyArrResolve)
