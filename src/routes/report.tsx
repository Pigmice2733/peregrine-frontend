import Page from '@/components/page'
import { ReportViewer } from '@/components/report-viewer'
import Card from '@/components/card'
import { css } from 'linaria'
import { getReport } from '@/api/report/get-report'
import Loader from '@/components/loader'
import { useState, useEffect } from 'preact/hooks'
import { useJWT } from '@/jwt'
import { route } from '@/router'
import { Report } from '@/api/report'

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
            canEdit ? () => route(`/reports/${report.id}/edit`) : undefined
          }
        />
      </Card>
    </Page>
  )
}

const ReportRoute = ({ reportId }: { reportId: number }) => {
  const [report, setReport] = useState<Report | undefined>(undefined)
  useEffect(() => {
    setReport(undefined)
    getReport(reportId).then((report) => {
      setReport(report)
    })
  }, [reportId])
  return report ? (
    // shows a page from cache or from network
    <ReportPage report={report} />
  ) : (
    // loading page if it hasn't been loaded from cache/network
    <Loader />
  )
}

export default ReportRoute
