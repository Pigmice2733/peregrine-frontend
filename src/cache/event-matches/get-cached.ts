import { transaction } from '..'
import { ProcessedMatch } from '@/api/match-info'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'

export const getCachedEventMatches = (eventKey: string, team?: string) =>
  transaction<ProcessedMatch[]>('matches', async matchStore =>
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
