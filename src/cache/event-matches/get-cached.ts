import { transaction } from '..'
import { ProcessedMatchInfo } from '@/api/match-info'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'

export const getCachedEventMatches = (eventKey: string, team?: string) =>
  transaction<ProcessedMatchInfo[]>('matches', matchStore =>
    matchStore.getAll(IDBKeyRange.bound(`${eventKey}-`, `${eventKey}-z`)),
  )
    .then(results =>
      team
        ? results.filter(
            r => r.redAlliance.includes(team) || r.blueAlliance.includes(team),
          )
        : results,
    )
    .then(preventEmptyArrResolve)
