import { request } from './base'

// Only authenticated users can star events
export const starEvent = (eventKey: string, starred: boolean) =>
  request<null>('PUT', `events/${eventKey}/star`, {}, starred)
