import { createPromiseRace } from '@/utils/fastest-promise'
import { getEventMatchInfo } from '@/api/match-info/get-event-match-info'
import { getCachedMatchInfo } from './get-cached'

export const getFastestMatchInfo = createPromiseRace(
  getEventMatchInfo,
  getCachedMatchInfo,
)
