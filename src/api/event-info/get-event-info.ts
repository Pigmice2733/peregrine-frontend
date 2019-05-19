import { request } from '../base'
import { EventInfo, processEvent } from '.'
import { updateCachedEventInfo } from '@/cache/event-info'

// Only TBA events, and custom events from their realm are available to
// non-super-admins.
export const getEventInfo = (eventKey: string) =>
  request<EventInfo>('GET', `events/${eventKey}`)
    .then(processEvent)
    .then(eventInfo => {
      updateCachedEventInfo(eventKey, eventInfo)
      return eventInfo
    })
