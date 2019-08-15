import { createPromiseRace } from '@/utils/fastest-promise'
import { getEventInfo } from '@/api/event-info/get-event-info'
import { getCachedEventInfo } from './get-cached'

export const getFastestEventInfo = createPromiseRace(
  getEventInfo,
  getCachedEventInfo,
)
