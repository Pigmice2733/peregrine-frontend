import { h } from 'preact'
import { useSavedReports } from '@/api/report/submit-report'
import { ReportPage } from './report'
import Page from '@/components/page'
import { css } from 'linaria'
import { route } from '@/router'

const missingReportStyle = css`
  padding: 2rem;
  text-align: center;
`

const SavedReportsPage = ({ reportKey }: { reportKey: string }) => {
  const savedReports = useSavedReports()
  const report = savedReports.find((report) => reportKey === report.key)

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
        route(`/reports/${report.id}`)
      }}
      onDelete={() => {
        route('/saved-reports')
      }}
      back="/saved-reports"
    />
  )
}

export default SavedReportsPage
