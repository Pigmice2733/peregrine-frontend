import { request } from '../base'
import { BaseReport } from '.'

export const submitReport = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: BaseReport,
) =>
  request<null>(
    'PUT',
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
    {},
    report,
  )
