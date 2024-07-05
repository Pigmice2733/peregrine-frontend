import { Report } from '@/api/report'
import { getSavedReports } from '@/api/report/submit-report'
import { AlertType } from '@/components/alert'
import Loader from '@/components/loader'
import { ReportEditPage } from '@/components/report-pages'
import { route } from '@/router'
import { useEffect, useState } from 'preact/hooks'

const SavedReportEditorRoute = ({ reportKey }: { reportKey: string }) => {
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

export default SavedReportEditorRoute
