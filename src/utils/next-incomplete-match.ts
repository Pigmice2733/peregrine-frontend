import { ProcessedMatchInfo } from '@/api/match-info'
import { useCurrentTime } from './use-current-time'

export const NextMatchIndex = (matches: ProcessedMatchInfo[]) => {
  /* matches.reduce<ProcessedMatchInfo | null>((prev, match) => {
    // if match has started, it is not a candidate
    if (!match.time || match.time.getTime() < useCurrentTime().getTime())
      return prev
    // nothing to compare against so this one must be the best so far
    if (!prev) return match
    return compareMatches(prev, match) > 0 ? match : prev
  }, null) */
  const currentTime = useCurrentTime().getTime()
  for (const [i, match] of matches.entries()) {
    if (match.time && match.time.getTime() >= currentTime) {
      match.index = i
      return match
    }
  }
}
