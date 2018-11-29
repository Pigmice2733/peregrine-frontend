import { request } from '../base'
import { GetReport } from '.'

export const getMatchTeamReports = (
  eventKey: string,
  matchKey: string,
  team: string,
) =>
  request<GetReport[]>(
    'GET',
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
  )
