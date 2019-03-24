import { request } from '../base'
import { Comment } from '.'

export const submitComment = (
  eventKey: string,
  matchKey: string,
  team: string,
  comment: Comment,
) =>
  request<null>(
    'PUT',
    `events/${eventKey}/matches/${matchKey}/comments/${team}`,
    {},
    comment,
  )
