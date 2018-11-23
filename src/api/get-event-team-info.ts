import { request } from './base'
import { MatchInfo } from './match-info'

interface EventTeamInfo {
  // only if they have future matches at this event
  nextMatch?: MatchInfo
  rank?: number
  rankingScore?: number
}

export const getEventTeamInfo = (eventKey: string, team: string) =>
  request<EventTeamInfo>('GET', `events/${eventKey}/teams/${team}`)
