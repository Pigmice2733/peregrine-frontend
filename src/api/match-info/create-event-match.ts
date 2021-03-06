import { request } from '../base'
import { MatchInfo } from '.'

// Only admins can create matches for their realm
export const createEventMatch = (
  eventKey: string,
  match: MatchInfo & {
    // UTC Date - scheduled match time
    time: string
  },
) => request<null>('POST', `events/${eventKey}/matches`, {}, match)
