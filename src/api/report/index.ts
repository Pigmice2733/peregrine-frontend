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

export interface PartialComment {
  comment: string
}

export interface Comment extends PartialComment {
  id: number
  matchKey: string
  reporterId?: string
}

export interface GetReport extends BaseReport {
  // Not sent if the reporter account has been deleted.
  reporterId?: string
}

interface EventKey {
  // 2018orwil
  eventKey: string
}

export interface SingleTeamStats {
  auto: ({
    modeName: string
    // in order by match time
    stats: (EventKey & GraphableField)[]
  })[]
  teleop: (EventKey & GraphableField)[]
}

export interface EventSingleTeamStats {
  auto: ({
    modeName: string
    // in order by match time
    stats: GraphableField[]
  })[]
  teleop: GraphableField[]
}
