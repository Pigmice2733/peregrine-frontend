import { request } from '../base'
import { processMatch, MatchInfo, ProcessedMatchInfo } from '.'
import { createMatchDbKey } from 'src/utils/create-match-db-key'
import { transaction } from 'src/cache'
import { requestIdleCallback } from 'src/utils/request-idle-callback'
import { getAllCachedEventMatches } from 'src/cache/event-matches/get-cached'
import { idbPromise } from 'src/utils/idb-promise'
import { matchHasTeam } from 'src/utils/match-has-team'
import { compareMatches } from 'src/utils/compare-matches'

const updateCachedEventMatches = (
  eventKey: string,
  matches: ProcessedMatchInfo[],
  team?: string,
) =>
  transaction(
    'matches',
    (matchStore) => {
      idbPromise(getAllCachedEventMatches(matchStore, eventKey)).then(
        (cachedMatches) => {
          cachedMatches.forEach((match) => {
            const missingFromResponse = !matches.some(
              (m) => m.key === match.key,
            )
            const teamWasInMatch = team ? matchHasTeam(team)(match) : true
            if (missingFromResponse && teamWasInMatch) {
              matchStore.delete(createMatchDbKey(eventKey, match.key))
            }
          })
        },
      )
      matches.forEach((match) =>
        matchStore.put(match, createMatchDbKey(eventKey, match.key)),
      )
    },
    'readwrite',
  )

export const getEventMatches = (eventKey: string, team?: string) =>
  request<MatchInfo[]>('GET', `events/${eventKey}/matches`, { team }).then(
    (matches) => {
      const processed = matches.map(processMatch).sort(compareMatches)
      requestIdleCallback(() =>
        updateCachedEventMatches(eventKey, processed, team),
      )
      return processed
    },
  )
