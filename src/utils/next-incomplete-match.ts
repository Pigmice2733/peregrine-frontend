import { ProcessedMatchInfo } from '@/api/match-info'
import { compareMatches } from './compare-matches'

export const nextIncompleteMatch = (matches: ProcessedMatchInfo[]) =>
  matches.reduce<ProcessedMatchInfo>(
    (prev, match) => {
      // if match is complete, it is not a candidate
      if (match.redScore !== undefined) return prev
      return compareMatches(prev, match) > 1 ? match : prev
    },
    { redAlliance: [], blueAlliance: [], key: '' },
  )
