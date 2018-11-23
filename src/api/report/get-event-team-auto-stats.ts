import { request } from '../base'
import { EventTeamAutoStats } from '.'

export const getEventTeamAutoStats = (eventKey: string, team: string) =>
  request<EventTeamAutoStats>(
    'GET',
    `events/${eventKey}/teams/${team}/stats/auto`,
  )
