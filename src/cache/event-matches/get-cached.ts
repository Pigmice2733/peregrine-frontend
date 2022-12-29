import { transaction } from '..'
import { ProcessedMatchInfo } from 'src/api/match-info'
import { preventEmptyArrResolve } from 'src/utils/prevent-empty-arr-resolve'
import { matchHasTeam } from 'src/utils/match-has-team'
import { compareMatches } from 'src/utils/compare-matches'

export const getAllCachedEventMatches = (
  matchStore: IDBObjectStore,
  eventKey: string,
): IDBRequest<ProcessedMatchInfo[]> =>
  matchStore.getAll(IDBKeyRange.bound(`${eventKey}-`, `${eventKey}-z`))

export const getCachedEventMatches = (eventKey: string, team?: string) =>
  transaction('matches', (matchStore) =>
    getAllCachedEventMatches(matchStore, eventKey),
  )
    .then((results) =>
      (team ? results.filter(matchHasTeam(team)) : results).sort(
        compareMatches,
      ),
    )
    .then(preventEmptyArrResolve)
