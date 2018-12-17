import { request } from '../base'
import { SingleTeamStats } from '.'

export const getTeamAutoStats = (team: string) =>
  request<SingleTeamStats>('GET', `teams/${team}/stats`)
