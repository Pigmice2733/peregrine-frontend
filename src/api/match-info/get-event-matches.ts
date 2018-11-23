import { request } from '../base'
import { MatchList, processMatch } from '.'
import { compareMatches } from '@/utils/compare-matches'

export const getEventMatches = (eventKey: string) =>
  request('GET', `events/${eventKey}/matches`, (matches: MatchList) =>
    matches.map(processMatch).sort(compareMatches),
  )
