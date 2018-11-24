import { request } from '../base'
import { TeamTeleopStats } from '.'

export const getTeamTeleopStats = (team: string) =>
  request<TeamTeleopStats>('GET', `teams/${team}/stats/teleop`)
