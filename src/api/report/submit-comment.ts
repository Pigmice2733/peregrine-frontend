import { request } from '../base'
import { PartialComment } from '.'

export const submitComment = (
  eventKey: string,
  matchKey: string,
  team: string,
  comment: PartialComment,
) =>
  request<null>(
    'PUT',
    `events/${eventKey}/matches/${matchKey}/comments/${team}`,
    {},
    comment,
  )
