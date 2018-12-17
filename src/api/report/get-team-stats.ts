import { request } from '../base'
import { SingleTeamStats } from '.'

export const getTeamStats = (team: string) =>
  request<SingleTeamStats>('GET', `teams/${team}/stats`)
