import { request } from '../base'
import { MatchInfo, processMatch } from '.'

export const getEventMatchInfo = (eventKey: string, matchKey: string) =>
  request<MatchInfo>('GET', `events/${eventKey}/matches/${matchKey}`).then(
    processMatch,
  )
