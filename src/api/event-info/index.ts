import { Merge } from '@/type-utils'

export interface BasicEventInfo {
  key: string
  // the ID of the realm the event belongs to
  realmId?: string
  // from TBA short name
  name: string
  // abbreviated district name
  district?: string
  week?: number
  // UTC date
  startDate: string
  // UTC date
  endDate: string
  location: {
    lat: number
    lon: number
  }
}

export interface EventInfo extends BasicEventInfo {
  webcasts: {
    type: 'twitch' | 'youtube'
    url: string
  }[]
  // the ID of the schema attached to the event
  schemaId: string
  // district "display_name" from TBA
  fullDistrict?: string
  location: {
    name: string
    lat: number
    lon: number
  }
}

export const processEvent = <T extends EventInfo | BasicEventInfo>(e: T) =>
  ({
    ...e,
    startDate: new Date(e.startDate),
    endDate: new Date(e.endDate),
  } as Merge<T, { startDate: Date; endDate: Date }>)
// need this coercion otherwise ts will have startDate as string & Date
// rest spread creates intersection types which is slightly inaccurate
// https://github.com/Microsoft/TypeScript/pull/28234
// https://github.com/Microsoft/TypeScript/issues/10727
