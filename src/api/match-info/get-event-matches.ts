import { request } from '../base'
import { MatchList, processMatch } from '.'
import { compareMatches } from '@/utils/compare-matches'

export const getEventMatches = (eventKey: string, team?: string) =>
  request<MatchList>('GET', `events/${eventKey}/matches`, { team }).then(
    matches => matches.map(processMatch).sort(compareMatches),
  )
