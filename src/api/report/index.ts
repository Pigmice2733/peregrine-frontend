// a stat is a summary representation of a field
interface BaseStat {
  statName: string
}

// a field is the details of something specific that happened during a match
interface BaseField {
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

interface BooleanField extends BaseField {
  attempted: boolean
  succeeded: boolean
}

interface NumberField extends BaseField {
  attempts: number
  successes: number
}

type Stat = NumberStat | BooleanStat

type Field = NumberField | BooleanField
type GraphableField = {
  // qm1
  match: string
} & (NumberField | BooleanField)
export interface SubmittedReport {
  teleop: Field[]
  auto: Field[]
  autoName: string
}

export interface Report extends SubmittedReport {
  reporter: string
  reporterId?: string
}

type EventKey = {
  // 2018orwil
  eventKey: string
}

export type TeamTeleopStats = (EventKey & GraphableField)[]
export type TeamAutoStats = ({
  modeName: string
  // in order by match time
  stats: (EventKey & GraphableField)[]
})[]

export type EventTeamTeleopStats = GraphableField[]
export type EventTeamAutoStats = ({
  modeName: string
  // in order by match time
  stats: GraphableField[]
})[]

export interface TeamStats {
  team: string
  teleop: Stat[]
  auto: Stat[]
}

export interface TeamStatsWithAlliance extends TeamStats {
  alliance: 'red' | 'blue'
}
