interface BaseField {
  statName: string
}

interface BooleanField extends BaseField {
  attempted: boolean
  succeeded: boolean
}

interface NumberField extends BaseField {
  attempts: number
  successes: number
}

export type Field = NumberField | BooleanField

interface BooleanStat extends BaseField {
  // total
  attempts: number
  // total
  successes: number
}

interface NumberStat extends BaseField {
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

type GraphableField = {
  // qm1
  match: string
} & (NumberField | BooleanField)

export interface BaseReport {
  data: {
    teleop: Field[]
    auto: Field[]
  }
  autoName: string
}

export interface GetReport extends BaseReport {
  // Not sent if the reporter account has been deleted.
  reporterId?: string
}

type EventKey = {
  // 2018orwil
  eventKey: string
}

export type SingleTeamStats = {
  auto: ({
    modeName: string
    // in order by match time
    stats: (EventKey & GraphableField)[]
  })[]
  teleop: (EventKey & GraphableField)[]
}

export type EventSingleTeamStats = {
  auto: ({
    modeName: string
    // in order by match time
    stats: GraphableField[]
  })[]
  teleop: GraphableField[]
}

export interface TeamStats {
  team: string
  teleop: Stat[]
  auto: Stat[]
}

export interface TeamStatsWithAlliance extends TeamStats {
  alliance: 'red' | 'blue'
}
