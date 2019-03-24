import { request } from '../base'
import { Comment } from '.'

export const getMatchTeamComments = (eventKey: string, team: string) =>
  request<Comment[]>('GET', `events/${eventKey}/teams/${team}/comments`)
