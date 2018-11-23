import { request } from '../base'
import { EventInfo } from '.'

// Only admins can create custom events on their realm
export const createEvent = (event: EventInfo) =>
  request<null>('POST', `events`, event)
