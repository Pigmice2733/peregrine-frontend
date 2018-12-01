interface BooleanStat {
  // total
  attempts: number
  // total
  successes: number
}

interface NumberStat {
  attempts: {
    max: number
    avg: number
  }
  successes: {
    max: number
    avg: number
  }
}

interface BooleanField {
  attempted: boolean
  succeeded: boolean
}

interface NumberField {
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

interface BaseReport {
  teleop: Field[]
  auto: Field[]
  autoName: string
}

export interface GetReport extends BaseReport {
  reporter: string
  // Not sent if the reporter account has been deleted.
  reporterId?: string
}

export interface PutReport extends BaseReport {
  reporter: string
  reporterId: string
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
