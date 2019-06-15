import { request } from '../base'
import { MatchInfo, processMatch, ProcessedMatch } from '.'
import { transaction } from '@/cache'
import { createMatchDbKey } from '@/utils/create-match-db-key'

const updateCachedEventMatchInfo = (eventKey: string, match: ProcessedMatch) =>
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
      updateCachedEventMatchInfo(eventKey, match)
      return match
    })
