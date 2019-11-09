export interface Field {
  name: string
  value: number
}

type GraphableField = {
  // qm1
  match: string
} & Field

export interface Report {
  data: Field[]
}

export interface PartialComment {
  comment: string
}

export interface Comment extends PartialComment {
  id: number
  matchKey: string
  reporterId?: string
}

export interface GetReport extends Report {
  // Not sent if the reporter account has been deleted.
  reporterId?: string
}

interface EventKey {
  // 2018orwil
  eventKey: string
}

export interface SingleTeamStats {
  auto: {
    modeName: string
    // in order by match time
    stats: (EventKey & GraphableField)[]
  }[]
  teleop: (EventKey & GraphableField)[]
}

export interface EventSingleTeamStats {
  auto: {
    modeName: string
    // in order by match time
    stats: GraphableField[]
  }[]
  teleop: GraphableField[]
}
