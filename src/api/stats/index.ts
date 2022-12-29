import { formatTeamNumber } from 'src/utils/format-team-number'

export interface Stat {
  name: string
  max: number
  avg: number
}

export interface TeamStats {
  team: string
  summary: Stat[]
}

export interface ProcessedTeamStats {
  team: string
  summary: { [name: string]: Stat }
}

export const processTeamStats = (
  singleTeamStats: TeamStats,
): ProcessedTeamStats => ({
  team: formatTeamNumber(singleTeamStats.team),
  summary: singleTeamStats.summary.reduce((acc, val) => {
    acc[val.name] = val
    return acc
  }, {} as { [key: string]: Stat }),
})
