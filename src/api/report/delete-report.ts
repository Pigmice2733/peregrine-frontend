import { request } from '../base'

export const deleteReport = (id: number) =>
  request<void>('DELETE', `reports/${id}`)
