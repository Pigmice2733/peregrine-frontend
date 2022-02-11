import { ProcessedMatchInfo } from '@/api/match-info'
import { GetReport } from '@/api/report'
import { formatTeamNumber } from '@/utils/format-team-number'
import Card from './card'
import { css } from 'linaria'
import clsx from 'clsx'
import { mdiChevronDown, mdiClipboardText } from '@mdi/js'
import IconButton from './icon-button'
import { useState } from 'preact/hooks'
import Button from './button'
import Icon from './icon'
import { ProfileLink } from './profile-link'

// !important is used because rollup orders the CSS so that the default card background
// has a higher priority than this
const matchReportsStyle = css`
  background: #d5d5d5 !important;
`

interface Props {
  match: ProcessedMatchInfo
  reports: GetReport[]
  class?: string
  eventKey: string
}

const matchReportsHeadingStyle = css`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  padding: 0.5rem;
  grid-gap: 0.5rem;
  white-space: nowrap;

  & > h1 {
    margin: 0;
    min-width: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 1.4rem;
    font-weight: 500;
  }
`

const matchReportStyle = css`
  display: grid;
  grid-template-columns: auto 4rem 1fr;
  padding: 0.5rem;
  grid-gap: 0.5rem;
  align-items: center;
`

const matchReportListStyle = css`
  display: grid;
  margin: 0;
  padding: 0 0.6rem 0.7rem;
  grid-gap: 0.6rem;
`

const teamNumberStyle = css`
  justify-self: center;
`

export const MatchReports = ({
  match,
  reports,
  class: className,
  eventKey,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false)
  return (
    <Card class={clsx(matchReportsStyle, className)}>
      <div class={matchReportsHeadingStyle}>
        <h1>{`${reports.length} Report${reports.length === 1 ? '' : 's'}`}</h1>
        <Button href={`/events/${eventKey}/matches/${match.key}/scout`}>
          Scout Match
        </Button>
        <IconButton
          onClick={() => setIsExpanded((isExpanded) => !isExpanded)}
          icon={mdiChevronDown}
        />
      </div>
      {isExpanded && (
        <ul class={matchReportListStyle}>
          {reports.map((report) => {
            return (
              <Card
                key={report.id}
                href={`/reports/${report.id}`}
                class={matchReportStyle}
              >
                <Icon icon={mdiClipboardText} />
                <div class={teamNumberStyle}>
                  {formatTeamNumber(report.teamKey)}
                </div>
                <ProfileLink link={false} reporterId={report.reporterId} />
              </Card>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
