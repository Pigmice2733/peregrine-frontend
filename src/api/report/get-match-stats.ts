import { request } from '../base'
import { TeamStatsWithAlliance } from '.'

// Stats for the teams in a match.
// These stats describe a team's performance in all matches at this event,
// not just this match.
export const getMatchStats = (eventKey: string, matchKey: string) =>
  request<TeamStatsWithAlliance[]>(
    'GET',
    `events/${eventKey}/matches/${matchKey}/stats`,
  )
