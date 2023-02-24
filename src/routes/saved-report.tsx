import { getSavedReports } from '@/api/report/submit-report'
import Page from '@/components/page'
import { css } from 'linaria'
import { route } from '@/router'
import { useState, useEffect } from 'preact/hooks'
import { Report } from '@/api/report'
import Card from '@/components/card'
import { ReportViewer } from '@/components/report-viewer'
import { useJWT } from '@/jwt'

const missingReportStyle = css`
  padding: 2rem;
  text-align: center;
`

const reportPageStyle = css`
  display: flex;
  padding: 2rem;
  justify-content: center;
`

const reportViewerCardStyle = css`
  padding: 2rem;
  display: grid;
  justify-items: center;
  grid-gap: 1rem;
  max-width: 30rem;
`

const ReportPage = ({ report }: { report: Report }) => {
  const { jwt } = useJWT()
  const canEdit =
    jwt &&
    (report.reporterId === Number.parseInt(jwt.sub) ||
      (jwt.peregrineRoles.isAdmin && report.realmId === jwt.peregrineRealm) ||
      jwt.peregrineRoles.isSuperAdmin)
  return (
    <Page name="Report" class={reportPageStyle}>
      {/* shows the report */}
      <Card class={reportViewerCardStyle}>
        <ReportViewer
          report={report}
          onEditClick={
            canEdit
              ? () => route(`/saved-reports/${report.key}/edit`)
              : undefined
          }
        />
      </Card>
    </Page>
  )
}

const SavedReportsPage = ({ reportKey }: { reportKey: string }) => {
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

export default SavedReportsPage
