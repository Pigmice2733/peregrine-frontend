import { request } from '../base'
import { Report } from '.'
import { useEffect, useState } from 'preact/hooks'
import { CancellablePromise } from '@/utils/cancellable-promise'

export const uploadReport = (report: Report): CancellablePromise<number> => {
  if (report.id === undefined) {
    return request<number>('POST', 'reports', {}, report)
  }
  const id = report.id
  return request<null>('PUT', `reports/${id}`, {}, report).then(() => id)
}

// The 2 is the version number
// There were breaking changes to the report shape in
// https://github.com/Pigmice2733/peregrine-backend/pull/266
const SAVED_REPORTS = 'savedReports2'

const getSavedReports = (): Report[] =>
  JSON.parse(localStorage.getItem(SAVED_REPORTS) || '[]')

export const useSavedReports = () => {
  const [savedReports, setSavedReports] = useState<Report[]>([])
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

export const saveReportLocally = (report: Report) => {
  const savedReports = getSavedReports()
  savedReports.push(report)
  localStorage.setItem(SAVED_REPORTS, JSON.stringify(savedReports))
}
