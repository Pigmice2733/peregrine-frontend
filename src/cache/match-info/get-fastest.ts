import { createPromiseRace } from 'src/utils/fastest-promise'
import { getEventMatchInfo } from 'src/api/match-info/get-event-match-info'
import { getCachedMatchInfo } from './get-cached'

export const getFastestMatchInfo = createPromiseRace(
  getEventMatchInfo,
  getCachedMatchInfo,
)
