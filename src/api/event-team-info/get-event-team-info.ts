import { request } from '../base'
import { EventTeamInfo } from '.'

export const getEventTeamInfo = (eventKey: string, team: string) =>
  request<EventTeamInfo>('GET', `events/${eventKey}/teams/${team}`)
