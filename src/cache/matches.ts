import { getEventMatches } from '@/api/match-info/get-event-matches'
import { transaction } from '.'
import { ProcessedMatch } from '@/api/match-info'
import { useNetworkCache } from '@/utils/use-network-cache'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import { createMatchDbKey } from '@/utils/create-match-db-key'
import { preventEmptyArrResolve } from '@/utils/prevent-empty-arr-resolve'
import { createPromiseRace } from '@/utils/fastest-promise'

const getCachedEventMatches = (eventKey: string) =>
  transaction('matches', async matchStore => {
    return matchStore.getAll(
      IDBKeyRange.bound(`${eventKey}-`, `${eventKey}-z`),
    ) as IDBRequest<ProcessedMatch[]>
  }).then(preventEmptyArrResolve)

const getCachedEventMatchInfo = (eventKey: string, matchKey: string) =>
  transaction('matches', async matchStore => {
    return matchStore.get(createMatchDbKey(eventKey, matchKey)) as IDBRequest<
      ProcessedMatch
    >
  })

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
