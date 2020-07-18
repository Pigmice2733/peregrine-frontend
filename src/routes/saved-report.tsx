import { h } from 'preact'
import { useSavedReports } from '@/api/report/submit-report'
import { ReportPage } from './report'
import Page from '@/components/page'
import { css } from 'linaria'

const missingReportStyle = css`
  padding: 2rem;
  text-align: center;
`

const SavedReportsPage = ({ reportKey }: { reportKey: string }) => {
  const savedReports = useSavedReports()
  // TODO: Fix typescript error
  // TODO: back button needs to work
  // TODO: save reports should save offline
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

  return <ReportPage report={report} onSaveSuccess={() => {}} />
}

export default SavedReportsPage
