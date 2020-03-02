import { request } from '../base'
import { EventTeamInfo } from '.'

export const getEventTeams = (eventKey: string) =>
  request<EventTeamInfo[]>('GET', `events/${eventKey}/teams`)
