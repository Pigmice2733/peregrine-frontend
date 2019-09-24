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
