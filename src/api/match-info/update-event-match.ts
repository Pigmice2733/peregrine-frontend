import { request } from '../base'
import { MatchInfo } from '.'

export const updateEventMatch = (
  eventKey: string,
  match: MatchInfo & {
    // UTC Date - scheduled match time
    time: string
  },
) =>
  request<null>('PATCH', `events/${eventKey}/matches/${match.key}`, {}, match)
