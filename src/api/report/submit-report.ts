import { request } from '../base'
import { Report } from '.'

export const submitReport = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: Report,
) =>
  request<null>(
    'PUT',
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
    {},
    report,
  )
