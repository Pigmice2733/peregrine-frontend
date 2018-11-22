import { request } from './base'

export const getTeamAutoModes = (team: string) =>
  request<string[]>('GET', `teams/${team}/automodes`)
