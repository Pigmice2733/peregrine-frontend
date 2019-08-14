export interface Stat {
  attempts: {
    max: number
    avg: number
  }
  successes: {
    max: number
    avg: number
  }
  type: 'boolean' | 'number'
}

export interface TeamStats {
  team: string
  auto: { [statName: string]: Stat }
  teleop: { [statName: string]: Stat }
}
