import { request } from '../base'
import { Report } from '.'

export const getMatchTeamReports = (
  eventKey: string,
  matchKey: string,
  team: string,
) =>
  request<Report[]>(
    'GET',
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
  )
