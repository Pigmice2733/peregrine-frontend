import { ProcessedMatchInfo } from '@/api/match-info'

/** Returns whether a match has a given team in it (i.e. 'frc1432') */
export const matchHasTeam = (team: string) => (match: ProcessedMatchInfo) =>
  match.redAlliance.includes(team) || match.blueAlliance.includes(team)
