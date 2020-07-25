import { h } from 'preact'
import Page from '@/components/page'
import { ReportEditor } from '@/components/report-editor'
import { ReportViewer } from '@/components/report-viewer'
import Card from '@/components/card'
import { css } from 'linaria'
import { getReport } from '@/api/report/get-report'
import Spinner from '@/components/spinner'
import { useState, useEffect } from 'preact/hooks'
import { useJWT } from '@/jwt'
import { route } from '@/router'
import { Report, OfflineReport } from '@/api/report'

const reportPageStyle = css`
  display: flex;
  padding: 2rem;
  justify-content: center;
`
const reportCardBlock = css`
  width: 30rem;
  padding: 2rem;
  display: grid;
  justify-items: center;
  grid-gap: 1rem;
`

export const ReportPage = ({
  report,
  onSaveSuccess,
  onSaveLocally,
  onDelete,
  back,
}: {
  report: Report
  onSaveSuccess: (report: Report) => void
  onSaveLocally: (report: OfflineReport) => void
  onDelete: () => void
  back: string | (() => void)
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const { jwt } = useJWT()
  const canEdit =
    jwt &&
    report &&
    (report.reporterId === Number.parseInt(jwt.sub) ||
      (jwt.peregrineRoles.isAdmin && report.realmId === jwt.peregrineRealm) ||
      jwt.peregrineRoles.isSuperAdmin)
  return (
    <Page
      name={isEditing ? 'Edit Report' : 'Report'}
      back={isEditing ? () => setIsEditing(false) : back}
      class={reportPageStyle}
    >
      <Card class={reportCardBlock}>
        {isEditing ? (
          <ReportEditor
            initialReport={report}
            onSaveSuccess={(report) => {
              onSaveSuccess(report)
              setIsEditing(false)
            }}
            onSaveLocally={(report) => {
              onSaveLocally(report)
              setIsEditing(false)
            }}
            onDelete={onDelete}
          />
        ) : (
          <ReportViewer
            report={report}
            onEditClick={canEdit ? () => setIsEditing(true) : undefined}
          />
        )}
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
    <ReportPage
      report={report}
      onSaveSuccess={setReport}
      onSaveLocally={(report) => {
        route(`/saved-reports/${report.key}`)
      }}
      onDelete={() =>
        route(`/events/${report.eventKey}/matches/${report.matchKey}`)
      }
      back={() => window.history.back()}
    />
  ) : (
    <Spinner />
  )
}

export default ReportRoute
