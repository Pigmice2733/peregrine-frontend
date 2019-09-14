import { FunctionComponent, h, Fragment } from 'preact'
import Page from '@/components/page'
import {
  SavedReport,
  getSavedReports,
  useSavedReports,
  uploadSavedReports,
} from '@/api/report/submit-report'
import { useState, useEffect } from 'preact/hooks'
import Card from '@/components/card'
import { css } from 'linaria'
import { useEventInfo } from '@/cache/event-info/use'
import { formatMatchKey } from '@/utils/format-match-key'
import { formatTeamNumber } from '@/utils/format-team-number'
import Button from '@/components/button'

const savedReportCardStyle = css`
  padding: 1rem;
  width: 20rem;
  margin: 1rem;
`

const SavedReportCard: FunctionComponent<{ report: SavedReport }> = ({
  report,
}) => {
  const eventInfo = useEventInfo(report.eventKey)
  const matchKey = formatMatchKey(report.matchKey)
  const formattedMatchKey = matchKey.num
    ? `${matchKey.group} Match ${matchKey.num}`
    : matchKey.group
  return (
    <Card class={savedReportCardStyle}>{`${formatTeamNumber(
      report.team,
    )} in ${formattedMatchKey} @ ${
      eventInfo ? eventInfo.name : report.eventKey
    }`}</Card>
  )
}

const savedReportsPageStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const SavedReportsPage: FunctionComponent = () => {
  const savedReports = useSavedReports()

  return (
    <Page name="Saved Reports" back="/" class={savedReportsPageStyle}>
      {savedReports.length > 0 ? (
        <Fragment>
          {savedReports.map(report => (
            <SavedReportCard
              report={report}
              key={report.eventKey + report.matchKey + report.team}
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
}

export default SavedReportsPage
