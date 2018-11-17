import { request } from '../base'
import { MatchInfo, processMatch } from '.'

export const getEventMatchInfo = (eventKey: string, matchKey: string) =>
  request('GET', `events/${eventKey}/matches/${matchKey}`, (m: MatchInfo) =>
    processMatch(m),
  )
