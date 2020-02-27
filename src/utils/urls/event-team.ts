import { encodeQs } from '../encode-qs'

export const eventTeamUrl = (
  eventKey: string,
  teamNum: string,
  stat?: string,
) => `/events/${eventKey}/teams/${teamNum}${encodeQs({ stat })}`
