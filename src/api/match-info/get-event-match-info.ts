import { request } from '../base'
import { MatchInfo, processMatch, ProcessedMatchInfo } from '.'
import { transaction } from '@/cache'
import { createMatchDbKey } from '@/utils/create-match-db-key'
import { requestIdleCallback } from '@/utils/request-idle-callback'

const updateCachedEventMatchInfo = (
  eventKey: string,
  match: ProcessedMatchInfo,
) =>
  transaction(
    'matches',
    matchStore => {
      matchStore.put(match, createMatchDbKey(eventKey, match.key))
    },
    'readwrite',
  )

export const getEventMatchInfo = (eventKey: string, matchKey: string) =>
  request<MatchInfo>('GET', `events/${eventKey}/matches/${matchKey}`)
    .then(processMatch)
    .then(match => {
      requestIdleCallback(() => updateCachedEventMatchInfo(eventKey, match))
      return match
    })
