interface BaseStat {
  statName: string
}

interface BooleanStat extends BaseStat {
  // total
  attempts: number
  // total
  successes: number
}

interface NumberStat extends BaseStat {
  attempts: {
    max: number
    avg: number
  }
  successes: {
    max: number
    avg: number
  }
}

export type Stat = NumberStat | BooleanStat

export interface NormalizedStat {
  attempts: {
    max: number
    avg: number
    type: 'percent' | 'number'
  }
  successes: {
    max: number
    avg: number
    type: 'percent' | 'number'
  }
}

export interface TeamStats {
  team: string
  teleop: Stat[]
  auto: Stat[]
}

export interface TeamStatsWithAlliance extends TeamStats {
  alliance: 'red' | 'blue'
}
