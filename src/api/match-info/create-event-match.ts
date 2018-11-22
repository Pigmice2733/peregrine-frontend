import { request } from '../base'
import { MatchInfo } from '.'

// Only admins can create matches
export const createEventMatch = (
  eventKey: string,
  match: MatchInfo & {
    // UTC Date - scheduled match time
    time: string
  },
) => request<null>('PUT', `events/${eventKey}/matches`, match)
