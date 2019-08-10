import { getEventMatches } from '@/api/match-info/get-event-matches'
import { transaction } from '.'
import { ProcessedMatch } from '@/api/match-info'
import { useNetworkCache } from '@/utils/use-network-cache'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import { createMatchDbKey } from '@/utils/create-match-db-key'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'
import { createPromiseRace } from '@/utils/fastest-promise'
import { preventUndefinedResolve } from '@/utils/prevent-undefined-resolve'

const getCachedEventMatches = (eventKey: string, team?: string) =>
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

const getCachedEventMatchInfo = (eventKey: string, matchKey: string) =>
  transaction<ProcessedMatch | undefined>('matches', async matchStore => {
    return matchStore.get(createMatchDbKey(eventKey, matchKey))
  }).then(preventUndefinedResolve)

export const getFastestEventMatchInfo = createPromiseRace(
  getEventMatchInfo,
  getCachedEventMatchInfo,
)

export const useEventMatches = useNetworkCache(
  getEventMatches,
  getCachedEventMatches,
)

export const useEventMatchInfo = useNetworkCache(
  getEventMatchInfo,
  getCachedEventMatchInfo,
)
