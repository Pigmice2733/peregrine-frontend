import { useJWT } from '@/jwt'
import Card from './card'
import Page from './page'
import { ReportViewer } from './report-viewer'
import { OfflineReport, Report } from '@/api/report'
import { css } from '@linaria/core'
import { ReportEditor } from './report-editor'

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

export const ReportPage = ({ report }: { report: Report }) => {
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
          reportEditorLink={
            canEdit ? `/saved-reports/${report.key}/edit` : undefined
          }
        />
      </Card>
    </Page>
  )
}

export const ReportEditPage = ({
  report,
  onSaveSuccess,
  onSaveLocally,
  onDelete,
}: {
  report: Report
  onSaveSuccess: (report: Report) => void
  onSaveLocally: (report: OfflineReport) => void
  onDelete: () => void
}) => {
  return (
    <Page name="Edit Report" class={reportPageStyle}>
      <ReportEditor
        initialReport={report}
        onSaveSuccess={onSaveSuccess}
        onSaveLocally={onSaveLocally}
        onDelete={onDelete}
      />
    </Page>
  )
}
