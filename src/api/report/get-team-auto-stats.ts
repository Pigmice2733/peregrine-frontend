import { request } from '../base'
import { TeamAutoStats } from '.'

export const getTeamAutoStats = (team: string) =>
  request<TeamAutoStats>('GET', `teams/${team}/stats/auto`)
