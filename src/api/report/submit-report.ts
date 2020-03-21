import { request } from '../base'
import { Report } from '.'
import { useEffect, useState } from 'preact/hooks'

const uploadReport = ({ eventKey, matchKey, team, report }: SavedReport) =>
  request<null>(
    'PUT',
    `events/${eventKey}/matches/${matchKey}/reports/${team}`,
    {},
    report,
  )

const SAVED_REPORTS = 'savedReports'

export interface SavedReport {
  eventKey: string
  matchKey: string
  team: string
  report: Report
}

export const getSavedReports = (): SavedReport[] =>
  JSON.parse(localStorage.getItem(SAVED_REPORTS) || '[]')

export const useSavedReports = () => {
  const [savedReports, setSavedReports] = useState<SavedReport[]>([])
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
    [] as SavedReport[] | Promise<SavedReport[]>,
  )
  localStorage.setItem(SAVED_REPORTS, JSON.stringify(unsuccessfulReports))
}

export const saveReportLocally = (report: SavedReport) => {
  const savedReports = getSavedReports()
  savedReports.push(report)
  localStorage.setItem(SAVED_REPORTS, JSON.stringify(savedReports))
}

export const submitReport = (
  eventKey: string,
  matchKey: string,
  team: string,
  report: Report,
) =>
  new Promise<null>((resolve) => {
    let succeeded = false
    const reportData: SavedReport = { eventKey, matchKey, team, report }
    const fallback = () => {
      if (!succeeded) saveReportLocally(reportData)
      succeeded = true
      resolve(null)
    }
    setTimeout(fallback, 1000)
    return uploadReport(reportData)
      .then(() => {
        succeeded = true
      })
      .catch(fallback)
  })
