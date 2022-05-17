import { request } from '../base'
import { GetReport } from '.'

export const getReport = (id: number) =>
  request<GetReport>('GET', `reports/${id}`)
