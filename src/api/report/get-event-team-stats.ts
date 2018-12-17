import { request } from '../base'
import { EventSingleTeamStats } from '.'

export const getEventTeamAutoStats = (eventKey: string, team: string) =>
  request<EventSingleTeamStats>('GET', `events/${eventKey}/teams/${team}/stats`)
