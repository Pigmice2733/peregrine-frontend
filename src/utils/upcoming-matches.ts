import { ProcessedMatchInfo } from '@/api/match-info'

const ONE_DAY = 24 * 60 * 60 * 1000

/** Return the first three matches of the given set that haven't finished yet (no scores posted)
 * and are less than one day past their expected start times. */
export const getUpcomingMatches = (
  matches: ProcessedMatchInfo[],
  currentTime: number,
) =>
  matches
    .filter((match) => match.redScore === undefined)
    .filter(
      (match) => match.time && match.time.getTime() > currentTime - ONE_DAY,
    )
    .slice(0, 3)
