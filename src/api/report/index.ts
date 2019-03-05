export interface Field {
  name: string
  attempts: number
  successes: number
}

type GraphableField = {
  // qm1
  match: string
} & Field

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
