import { request } from '../base'
import { Stat } from '.'

export const getMatchTeamStats = (
  eventKey: string,
  matchKey: string,
  team: string,
) =>
  request<{ team: string; summary: Stat[] | null }>(
    'GET',
    `events/${eventKey}/matches/${matchKey}/teams/${team}/stats`,
  )
