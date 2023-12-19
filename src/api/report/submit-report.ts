import { request } from '../base'
import { Report, OfflineReport } from '.'
import { useEffect, useState } from 'preact/hooks'
import { CancellablePromise } from '@/utils/cancellable-promise'

/**
 * Uploads a report via PUT or POST, depending on if the report already has an ID
 * @returns a promise that resolves to the new report's ID
 */
export const uploadReport = (report: Report): CancellablePromise<number> => {
  const id = report.id
  const req =
    id === undefined
      ? request<number>('POST', 'reports', {}, report)
      : request<null>('PUT', `reports/${id}`, {}, report).then(() => id)
  return req.then((id) => {
    if (report.key) {
      deleteReportLocally(report.key)
    }
    return id
  })
}

// The 3 is the version number
// Increment whenever there are breaking changes to the stored data
const SAVED_REPORTS = 'savedReports3'

export const getSavedReports = (): OfflineReport[] =>
  JSON.parse(localStorage.getItem(SAVED_REPORTS) || '[]')

export const useSavedReports = () => {
  const [savedReports, setSavedReports] = useState<OfflineReport[]>([])
  const refreshSavedReports = () => setSavedReports(getSavedReports())

  useEffect(() => {
    refreshSavedReports()
    const id = setInterval(refreshSavedReports, 1000)
    return () => clearInterval(id)
  }, [])

  return savedReports
}

export const uploadSavedReports = async () => {
  const savedReports = getSavedReports()
  const unsuccessfulReports = await savedReports.reduce(
    async (unsuccessfulReports, report) => {
      await uploadReport(report).catch(async () =>
        (await unsuccessfulReports).push(report),
      )
      return unsuccessfulReports
    },
    [] as Report[] | Promise<Report[]>,
  )
  localStorage.setItem(SAVED_REPORTS, JSON.stringify(unsuccessfulReports))
}

/** Only used for offline reports */
export const generateReportKey = () => Math.random().toString(36).slice(2, 10)

export const saveReportLocally = (report: OfflineReport) => {
  const savedReports = getSavedReports()
  const existingReportIndex = savedReports.findIndex(
    (savedReport) => savedReport.key === report.key,
  )
  if (existingReportIndex === -1) {
    savedReports.push(report)
  } else {
    savedReports[existingReportIndex] = report
  }
  localStorage.setItem(SAVED_REPORTS, JSON.stringify(savedReports))
}
export const deleteReportLocally = (reportKey: string) => {
  const savedReports = getSavedReports()
  const filteredReports = savedReports.filter(
    (savedReport) => savedReport.key !== reportKey,
  )

  localStorage.setItem(SAVED_REPORTS, JSON.stringify(filteredReports))
}
