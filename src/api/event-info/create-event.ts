import { request } from '../base'
import { EventInfo } from '.'

// Only admins can create custom events on their realm
export const createEvent = (event: EventInfo, eventKey: string) =>
  request<null>('PUT', `events/${eventKey}`, {}, event)
