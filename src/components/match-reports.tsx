import { ProcessedMatchInfo } from '@/api/match-info'
import { GetReport } from '@/api/report'
import { h, Fragment } from 'preact'
import { formatTeamNumber } from '@/utils/format-team-number'

interface Props {
  match: ProcessedMatchInfo
  reports: GetReport[]
}
export const MatchReports = ({ match, reports }: Props) => {
  return (
    <ul>
      {' '}
      {match.redAlliance.map((teamNum) => {
        const reportsForTeam = reports.filter(
          (report) => report.teamKey === teamNum,
        )
        return (
          <li key={teamNum}>
            {formatTeamNumber(teamNum)}:{' '}
            {reportsForTeam.length === 0 ? (
              'no reports'
            ) : reportsForTeam.length === 1 ? (
              <a href={`/reports/${reportsForTeam[0].id}`}> one report </a>
            ) : (
              <Fragment>
                {reportsForTeam.length} reports{' '}
                {reportsForTeam.map((report, i) => {
                  return (
                    <Fragment key={report.id}>
                      {' '}
                      <a href={`/reports/${report.id}`}>{i + 1}</a>
                      {i === reportsForTeam.length - 1 ? '' : ', '}
                    </Fragment>
                  )
                })}
              </Fragment>
            )}
          </li>
        )
      })}
    </ul>
  )
}
