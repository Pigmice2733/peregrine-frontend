import { request } from '../base'
import { GetReport } from '.'

export const getReports = (filters: {
  event?: string
  team?: string
  match?: string
  reporter?: number | string
}) => request<GetReport[]>('GET', 'reports', filters)
