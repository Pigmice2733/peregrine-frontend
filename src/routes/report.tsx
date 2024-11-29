import { getReport } from '@/api/report/get-report'
import Loader from '@/components/loader'
import { useState, useEffect } from 'preact/hooks'
import { Report } from '@/api/report'
import { ReportPage } from '@/components/report-pages'

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
