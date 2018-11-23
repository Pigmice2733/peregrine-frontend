import { request } from '../base'
import { EventInfo, processEvent } from '.'

// Only TBA events, and custom events from their realm are available to
// non-super-admins.
export const getEventInfo = (eventKey: string) =>
  request('GET', `events/${eventKey}`, (e: EventInfo) => processEvent(e))
