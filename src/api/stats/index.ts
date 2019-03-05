export interface Stat {
  name: string
  attempts: {
    max: number
    avg: number
  }
  successes: {
    max: number
    avg: number
  }
}

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
  teleop: { [key: string]: Stat }
  auto: { [key: string]: Stat }
}
