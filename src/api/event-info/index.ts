import { Merge } from '@/type-utils'

export interface EventInfo {
  webcasts: string[]
  // the ID of the schema attached to the event
  schemaId: number
  // district "display_name" from TBA
  fullDistrict?: string
  locationName: string
  lat: number
  lon: number
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
}

export const processEvent = (
  e: EventInfo,
): Merge<EventInfo, { startDate: Date; endDate: Date }> => ({
  ...e,
  startDate: new Date(e.startDate),
  endDate: new Date(e.endDate),
})
// need this coercion otherwise ts will have startDate as string & Date
// rest spread creates intersection types which is slightly inaccurate
// startDate will be string & Date instead of just Date
// https://github.com/Microsoft/TypeScript/pull/28234
// https://github.com/Microsoft/TypeScript/issues/10727
