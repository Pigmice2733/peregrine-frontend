import { getSavedReports } from '@/api/report/submit-report'
import { ReportPage } from './report'
import Page from '@/components/page'
import { css } from 'linaria'
import { route, createAlert } from '@/router'
import { useState, useEffect } from 'preact/hooks'
import { Report } from '@/api/report'
import { AlertType } from '@/components/alert'

const missingReportStyle = css`
  padding: 2rem;
  text-align: center;
`

const SavedReportsPage = ({ reportKey }: { reportKey: string }) => {
  const [report, setReport] = useState<undefined | Report>(undefined)

  useEffect(() => {
    setReport(getSavedReports().find((report) => reportKey === report.key))
  }, [reportKey])

  if (!report) {
    return (
      <Page
        back="/saved-reports"
        name="Offline Report"
        class={missingReportStyle}
      >
        This Report Does Not Exist.
      </Page>
    )
  }

  return (
    <ReportPage
      report={report}
      onSaveSuccess={(report) => {
        route(`/reports/${report.id}`, {
          type: AlertType.Success,
          message: 'Report was uploaded!',
        })
      }}
      onSaveLocally={(report) => {
        setReport(report)
        createAlert({
          type: AlertType.Success,
          message: 'Report was updated locally!',
        })
      }}
      onDelete={() => {
        route('/saved-reports', {
          type: AlertType.Success,
          message: 'Report was deleted locally!',
        })
      }}
      back="/saved-reports"
    />
  )
}

export default SavedReportsPage
