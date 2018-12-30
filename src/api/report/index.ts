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
