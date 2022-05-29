import { SetRequired } from '@/type-utils'

export interface Field {
  name: string
  value: number
}

type GraphableField = {
  // qm1
  match: string
} & Field

export interface Report {
  id?: number
  key?: string
  eventKey: string
  matchKey: string
  teamKey: string
  realmId?: number
  /**
   * Doesn't exist if the reporter account has been deleted.
   * Admins can set this to a different userid than themself
   */
  reporterId?: number | null
  data: Field[]
  comment: string
}

/** Getting reports from the server results in this interface */
export type GetReport = SetRequired<Report, 'data' | 'comment' | 'id'>

export type OfflineReport = SetRequired<Report, 'data' | 'comment' | 'key'>

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
