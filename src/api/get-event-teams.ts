import { request } from './base'

export const getEventTeams = (eventKey: string) =>
  request<string[]>('GET', `events/${eventKey}/teams`)
