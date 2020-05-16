import { h } from 'preact'
import Page from '@/components/page'
import { GetReport } from '@/api/report'
import { ReportEditor } from '@/components/report-editor'
import { ReportViewer } from '@/components/report-viewer'
import Card from '@/components/card'
import { css } from 'linaria'
import { getReport } from '@/api/report/get-report'
import { usePromise } from '@/utils/use-promise'
import Spinner from '@/components/spinner'
import { useState } from 'preact/hooks'
import { useJWT } from '@/jwt'

const reportPageStyle = css`
  display: flex;
  padding: 2rem;
`

const Report = ({ reportId }: { reportId: number }) => {
  const report = usePromise(() => getReport(reportId), [reportId])
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
      name="Report"
      back={() => window.history.back()}
      class={reportPageStyle}
    >
      {report ? (
        <Card>
          {isEditing ? (
            <ReportEditor
              initialReport={report}
              onSaveSuccess={() => setIsEditing(false)}
            />
          ) : (
            <ReportViewer
              report={report}
              onEditClick={canEdit ? () => setIsEditing(true) : undefined}
            />
          )}
        </Card>
      ) : (
        <Spinner />
      )}
    </Page>
  )
}

export default Report
