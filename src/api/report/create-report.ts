import { request } from '../base'
import { SubmittedReport } from '.'

export const submitReport = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: SubmittedReport,
) =>
  request<null>(
    'PUT',
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
    {},
    report,
  )
