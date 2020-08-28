import { ProcessedMatchInfo } from '@/api/match-info'
import { GetReport } from '@/api/report'
import { h, Fragment } from 'preact'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from './card'
import { css } from 'linaria'
import { blue, red } from '@/colors'
import clsx from 'clsx'

interface MatchTeamReportsProps {
  reportsForTeam: GetReport[]
  teamNum: string
  isRed: boolean
}

const matchTeamReportsStyle = css`
  padding: 0.5rem;
  color: white;
  & > a {
    color: white;
  }
`
const redStyle = css`
  background: ${red};
`

const blueStyle = css`
  background: ${blue};
`

const MatchTeamReports = ({
  reportsForTeam,
  teamNum,
  isRed,
}: MatchTeamReportsProps) => {
  return (
    <li
      key={teamNum}
      class={clsx(matchTeamReportsStyle, isRed ? redStyle : blueStyle)}
    >
      {formatTeamNumber(teamNum)}:{' '}
      {reportsForTeam.length === 0 ? (
        'no reports'
      ) : reportsForTeam.length === 1 ? (
        <a href={`/reports/${reportsForTeam[0].id}`}> 1 report </a>
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
}

const matchReportsStyle = css`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

interface Props {
  match: ProcessedMatchInfo
  reports: GetReport[]
  class?: string
}

export const MatchReports = ({ match, reports, class: className }: Props) => {
  return (
    <Card as="ul" class={clsx(matchReportsStyle, className)}>
      {match.redAlliance.map((teamNum) => {
        const reportsForTeam = reports.filter(
          (report) => report.teamKey === teamNum,
        )
        return (
          <MatchTeamReports
            reportsForTeam={reportsForTeam}
            teamNum={teamNum}
            isRed
            key={teamNum}
          />
        )
      })}
      {match.blueAlliance.map((teamNum) => {
        const reportsForTeam = reports.filter(
          (report) => report.teamKey === teamNum,
        )
        return (
          <MatchTeamReports
            reportsForTeam={reportsForTeam}
            teamNum={teamNum}
            isRed={false}
            key={teamNum}
          />
        )
      })}
    </Card>
  )
}
