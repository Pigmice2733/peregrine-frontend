import { getSavedReports } from '@/api/report/submit-report'
import Page from '@/components/page'
import { css } from '@linaria/core'
import { useState, useEffect } from 'preact/hooks'
import { Report } from '@/api/report'
import { ReportPage } from '@/components/report-pages'

const missingReportStyle = css`
  padding: 2rem;
  text-align: center;
`

const SavedReportsRoute = ({ reportKey }: { reportKey: string }) => {
  const [report, setReport] = useState<undefined | Report>(undefined)

  useEffect(() => {
    setReport(getSavedReports().find((report) => reportKey === report.key))
  }, [reportKey])

  return report ? (
    <ReportPage report={report} />
  ) : (
    <Page name="Offline Report" class={missingReportStyle}>
      This Report Does Not Exist.
    </Page>
  )
}

export default SavedReportsRoute
