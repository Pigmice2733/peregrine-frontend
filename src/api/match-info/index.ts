import { parseDateProps } from '@/utils/parse-date-props'

export interface MatchInfo {
  redAlliance: string[]
  blueAlliance: string[]
  // UTC date - predicted match time
  time?: string
  // example: qm3
  key: string
  redScore?: number
  blueScore?: number
}

export type MatchList = (MatchInfo & {
  // UTC date - scheduled match time
  scheduledTime?: string
})[]

export const processMatch = <T extends MatchInfo | MatchList[0]>(match: T) =>
  parseDateProps(match, ['time', 'scheduledTime'])
