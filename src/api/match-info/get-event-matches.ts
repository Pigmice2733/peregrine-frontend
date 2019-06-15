import { request } from '../base'
import { processMatch, MatchInfo, ProcessedMatch } from '.'
import { createMatchDbKey } from '@/utils/create-match-db-key'
import { transaction } from '@/cache'
import { requestIdleCallback } from '@/utils/request-idle-callback'

const updateCachedEventMatches = (
  eventKey: string,
  matches: ProcessedMatch[],
) =>
  transaction(
    'matches',
    matchStore => {
      matches.forEach(match =>
        matchStore.put(match, createMatchDbKey(eventKey, match.key)),
      )
    },
    'readwrite',
  )

export const getEventMatches = (eventKey: string, team?: string) =>
  request<MatchInfo[]>('GET', `events/${eventKey}/matches`, { team })
    .then(matches => matches.map(processMatch))
    .then(matches => {
      requestIdleCallback(() => updateCachedEventMatches(eventKey, matches))
      return matches
    })
