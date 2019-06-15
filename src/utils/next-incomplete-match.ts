import { ProcessedMatch } from '@/api/match-info'
import { compareMatches } from './compare-matches'

export const nextIncompleteMatch = (matches: ProcessedMatch[]) =>
  matches.reduce<ProcessedMatch | null>((prev, match) => {
    // if match is complete, it is not a candidate
    if (match.redScore !== undefined) return prev
    // nothing to compare against so this one must be the best so far
    if (!prev) return match
    return compareMatches(prev, match) > 1 ? match : prev
  }, null)
