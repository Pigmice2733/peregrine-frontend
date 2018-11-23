import { request } from '../base'
import { EventTeamTeleopStats } from '.'

export const getEventTeamTeleopStats = (eventKey: string, team: string) =>
  request<EventTeamTeleopStats>(
    'GET',
    `events/${eventKey}/teams/${team}/stats/teleop`,
  )
