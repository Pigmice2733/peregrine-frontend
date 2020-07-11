import { FunctionComponent, h, Fragment } from 'preact'
import Page from '@/components/page'
import { useSavedReports, uploadSavedReports } from '@/api/report/submit-report'
import Card from '@/components/card'
import { css } from 'linaria'
import { useEventInfo } from '@/cache/event-info/use'
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTeamNumber } from '@/utils/format-team-number'
import Button from '@/components/button'
import { Report } from '@/api/report'
import { useState } from 'preact/hooks'
import { ReportPage } from './report'

const savedReportCardStyle = css`
  padding: 1rem;
  width: 20rem;
  margin: 1rem;
`

const SavedReportCard = ({
  report,
  onClick,
}: {
  report: Report
  onClick: () => void
}) => {
  const eventInfo = useEventInfo(report.eventKey)
  const matchKey = formatMatchKey(report.matchKey)
  const formattedMatchKey = matchKey.num
    ? `${matchKey.group} Match ${matchKey.num}`
    : matchKey.group
  const eventName = eventInfo ? eventInfo.name : report.eventKey
  const teamName = formatTeamNumber(report.teamKey)
  return (
    <Card class={savedReportCardStyle} onClick={onClick}>
      {`${teamName} in ${formattedMatchKey} @ ${eventName}`}
    </Card>
  )
}

const savedReportsPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SavedReportsPage = () => {
  const savedReports = useSavedReports()
  const [selectedReportIndex, setSelectedReportIndex] = useState<number | null>(
    null,
  )
  if (selectedReportIndex === null)
    return (
      <Page name="Offline Saved Reports" back="/" class={savedReportsPageStyle}>
        {savedReports.length > 0 ? (
          <Fragment>
            {savedReports.map((report, i) => (
              <SavedReportCard
                report={report}
                onClick={() => setSelectedReportIndex(i)}
                key={report.eventKey + report.matchKey + report.teamKey}
              />
            ))}
            <Button onClick={uploadSavedReports}>Sync now</Button>
          </Fragment>
        ) : (
          <p
            class={css`
              padding: 1rem;
            `}
          >
            No offline saved reports
          </p>
        )}
      </Page>
    )
  // TODO: Fix typescript error
  // TODO: back button needs to work
  // TODO: save reports should save offline
  return <ReportPage report={savedReports[selectedReportIndex]} />
}

export default SavedReportsPage
