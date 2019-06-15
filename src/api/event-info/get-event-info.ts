import { request } from '../base'
import { EventInfo, processEvent, ProcessedEventInfo } from '.'
import { transaction } from '@/cache'
import { requestIdleCallback } from '@/utils/request-idle-callback'

const updateCachedEventInfo = (
  eventKey: string,
  eventInfo: ProcessedEventInfo,
) =>
  transaction(
    'events',
    eventStore => {
      eventStore.put(eventInfo, eventKey)
    },
    'readwrite',
  )

// Only TBA events, and custom events from their realm are available to
// non-super-admins.
export const getEventInfo = (eventKey: string) =>
  request<EventInfo>('GET', `events/${eventKey}`)
    .then(processEvent)
    .then(eventInfo => {
      requestIdleCallback(() => updateCachedEventInfo(eventKey, eventInfo))
      return eventInfo
    })
