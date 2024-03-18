import { Report, OfflineReport } from '@/api/report'
import { getSavedReports } from '@/api/report/submit-report'
import { AlertType } from '@/components/alert'
import Loader from '@/components/loader'
import Page from '@/components/page'
import { ReportEditor } from '@/components/report-editor'
import { route } from '@/router'
import { css } from '@linaria/core'
import { useEffect, useState } from 'preact/hooks'

const reportPageStyle = css`
  display: flex;
  padding: 2rem;
  justify-content: center;
`

const ReportEditPage = ({
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

const LocalReportEditorRoute = ({ reportKey }: { reportKey: string }) => {
  const [report, setReport] = useState<Report | undefined>(undefined)

  useEffect(() => {
    setReport(getSavedReports().find((report) => reportKey === report.key))
  }, [reportKey])

  return report ? (
    // shows a page from cache or from network
    <ReportEditPage
      report={report}
      onSaveSuccess={(report) => {
        setReport(report)
        route(`/reports/${report.id}`, {
          type: AlertType.Success,
          message: 'Report was uploaded.',
        })
      }}
      onSaveLocally={(report) =>
        route(`/saved-reports/${report.key}`, {
          type: AlertType.Success,
          message: 'Report was saved locally.',
        })
      }
      onDelete={() =>
        route(`/events/${report.eventKey}/matches/${report.matchKey}`, {
          type: AlertType.Success,
          message: 'Report was deleted locally.',
        })
      }
    />
  ) : (
    // loading page if it hasn't been loaded from cache/network
    <Loader />
  )
}

export default LocalReportEditorRoute
