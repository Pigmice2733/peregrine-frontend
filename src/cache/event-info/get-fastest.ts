import { createPromiseRace } from 'src/utils/fastest-promise'
import { getEventInfo } from 'src/api/event-info/get-event-info'
import { getCachedEventInfo } from './get-cached'

export const getFastestEventInfo = createPromiseRace(
  getEventInfo,
  getCachedEventInfo,
)
