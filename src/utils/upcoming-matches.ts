import { ProcessedMatchInfo } from '@/api/match-info'
// import { useCurrentTime } from './use-current-time'

export const getUpcomingMatches = (
  matches: ProcessedMatchInfo[],
  currentTime: number,
) => {
  const retArr = []
  for (const match of matches) {
    if (
      match.time &&
      match.time.getTime() < currentTime + 1000 * 60 * 15 &&
      match.time.getTime() > currentTime - 1000 * 60 * 4
    ) {
      retArr.push(match)
    }
  }
  return retArr
}
