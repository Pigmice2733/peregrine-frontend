import { request } from '../base'
import { PutReport } from '.'

export const submitReport = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: PutReport,
) =>
  request<null>(
    'PUT',
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
    {},
    report,
  )
