import { request } from '../base'
import { MatchInfo, processMatch, ProcessedMatchInfo } from '.'
import { transaction } from 'src/cache'
import { createMatchDbKey } from 'src/utils/create-match-db-key'
import { requestIdleCallback } from 'src/utils/request-idle-callback'

const updateCachedEventMatchInfo = (
  eventKey: string,
  match: ProcessedMatchInfo,
) =>
  transaction(
    'matches',
    (matchStore) => {
      matchStore.put(match, createMatchDbKey(eventKey, match.key))
    },
    'readwrite',
  )

export const getEventMatchInfo = (eventKey: string, matchKey: string) =>
  request<MatchInfo>('GET', `events/${eventKey}/matches/${matchKey}`)
    .then(processMatch)
    .then((match) => {
      requestIdleCallback(() => updateCachedEventMatchInfo(eventKey, match))
      return match
    })
