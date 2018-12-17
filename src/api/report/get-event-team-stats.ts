import { request } from '../base'
import { EventSingleTeamStats } from '.'

export const getEventTeamStats = (eventKey: string, team: string) =>
  request<EventSingleTeamStats>('GET', `events/${eventKey}/teams/${team}/stats`)
