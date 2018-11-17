import { request } from '../base'
import { MatchList, processMatch } from '.'

export const getEventMatches = (eventKey: string) =>
  request('GET', `events/${eventKey}/matches`, (matches: MatchList) =>
    matches
      .map(processMatch)
      .sort(
        (a, b) =>
          ((a.scheduledTime as unknown) as number) -
          ((b.scheduledTime as unknown) as number),
      ),
  )
