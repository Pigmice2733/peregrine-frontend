import { Report } from '@/api/report'
import { getReport } from '@/api/report/get-report'
import { AlertType } from '@/components/alert'
import Loader from '@/components/loader'
import { ReportEditPage } from '@/components/report-pages'
import { route } from '@/router'
import { useEffect, useState } from 'preact/hooks'

const ReportEditorRoute = ({ reportId }: { reportId: number }) => {
  const [report, setReport] = useState<Report | undefined>(undefined)

  useEffect(() => {
    setReport(undefined)
    getReport(reportId).then((report) => {
      setReport(report)
    })
  }, [reportId])

  return report ? (
    // shows a page from cache or from network
    <ReportEditPage
      report={report}
      onSaveSuccess={(report) => {
        setReport(report)
        route(`/reports/${report.id}`, {
          type: AlertType.Success,
          message: 'Report was updated.',
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
          message: 'Report was successfully deleted.',
        })
      }
    />
  ) : (
    // loading page if it hasn't been loaded from cache/network
    <Loader />
  )
}

export default ReportEditorRoute
