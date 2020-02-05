import { request } from '../base'
import { TeamStats } from '.'

export const getMatchTeamStats = (
  eventKey: string,
  matchKey: string,
  team: string,
) =>
  request<TeamStats>(
    'GET',
    `events/${eventKey}/matches/${matchKey}/teams/${team}/stats`,
  )
