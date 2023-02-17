import { ProcessedMatchInfo } from '@/api/match-info'
// import { useCurrentTime } from './use-current-time'

export const getUpcomingMatches = (
  matches: ProcessedMatchInfo[],
  currentTime: number,
) => {
  /* matches.reduce<ProcessedMatchInfo | null>((prev, match) => {
    // if match has started, it is not a candidate
    if (!match.time || match.time.getTime() < useCurrentTime().getTime())
      return prev
    // nothing to compare against so this one must be the best so far
    if (!prev) return match
    return compareMatches(prev, match) > 0 ? match : prev
  }, null) */
  const retArr = []
  for (const match of matches) {
    /* if (match.redScore) {
      retArr = []
    } else */ if (
      match.time &&
      match.time.getTime() < currentTime + 1000 * 60 * 90 &&
      match.time.getTime() > currentTime - 1000 * 60 * 45
    ) {
      retArr.push(match)
    }
  }
  return retArr.slice(3)
}
