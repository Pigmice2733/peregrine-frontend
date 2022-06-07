import Page from '@/components/page'
import { useSavedReports, uploadSavedReports } from '@/api/report/submit-report'
import Card from '@/components/card'
import { css } from 'linaria'
import { useEventInfo } from '@/cache/event-info/use'
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTeamNumber } from '@/utils/format-team-number'
import Button from '@/components/button'
import { OfflineReport } from '@/api/report'

const savedReportCardStyle = css`
  padding: 1rem;
  width: 20rem;
  margin: 1rem;
`

const SavedReportCard = ({ report }: { report: OfflineReport }) => {
  const eventInfo = useEventInfo(report.eventKey)
  const matchKey = formatMatchKey(report.matchKey)
  const formattedMatchKey = matchKey.num
    ? `${matchKey.group} Match ${matchKey.num}`
    : matchKey.group
  const eventName = eventInfo ? eventInfo.name : report.eventKey
  const teamName = formatTeamNumber(report.teamKey)
  return (
    <Card class={savedReportCardStyle} href={`/saved-reports/${report.key}`}>
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
  return (
    <Page name="Offline Saved Reports" back="/" class={savedReportsPageStyle}>
      {savedReports.length > 0 ? (
        <>
          {savedReports.map((report) => (
            <SavedReportCard
              report={report}
              key={report.eventKey + report.matchKey + report.teamKey}
            />
          ))}
          <Button onClick={uploadSavedReports}>Sync now</Button>
        </>
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
}

export default SavedReportsPage
