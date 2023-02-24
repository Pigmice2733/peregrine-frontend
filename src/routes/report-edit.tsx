import { Report, OfflineReport } from '@/api/report'
import { getReport } from '@/api/report/get-report'
import { getSavedReports } from '@/api/report/submit-report'
import { AlertType } from '@/components/alert'
import Loader from '@/components/loader'
import Page from '@/components/page'
import { ReportEditor } from '@/components/report-editor'
import { route } from '@/router'
import { css } from 'linaria'
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
        onSaveSuccess={(report) => {
          onSaveSuccess(report)
        }}
        onSaveLocally={(report) => {
          onSaveLocally(report)
        }}
        onDelete={onDelete}
      />
    </Page>
  )
}

const ReportEditorRoute = ({ reportId }: { reportId: any }) => {
  const [report, setReport] = useState<Report | undefined>(undefined)
  const [isLocalReport, setIsLocalReport] = useState<boolean>(false)

  useEffect(() => {
    setReport(undefined)
    if (typeof reportId === 'number') {
      getReport(reportId).then((report) => {
        setReport(report)
      })
    } else if (reportId instanceof String) {
      setReport(getSavedReports().find((report) => reportId === report.key))
      setIsLocalReport(true)
    }
  }, [reportId])
  return report ? (
    // shows a page from cache or from network
    <ReportEditPage
      report={report}
      onSaveSuccess={(report) => {
        setReport(report)
        route(`/report/${report.id}`, {
          type: AlertType.Success,
          message: isLocalReport
            ? 'Report was updated!'
            : 'Report was uploaded!',
        })
      }}
      onSaveLocally={(report) =>
        route(`/saved-reports/${report.key}`, {
          type: AlertType.Success,
          message: 'Report was saved locally!',
        })
      }
      onDelete={() =>
        route(`/events/${report.eventKey}/matches/${report.matchKey}`, {
          type: AlertType.Success,
          message:
            'Report was successfully deleted' +
            (isLocalReport ? '!' : 'locally!'),
        })
      }
    />
  ) : (
    // loading page if it hasn't been loaded from cache/network
    <Loader />
  )
}

export default ReportEditorRoute
