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

export type ProcessedEventInfo = Merge<
  EventInfo,
  { startDate: Date; endDate: Date }
>

export const processEvent = (e: EventInfo): ProcessedEventInfo => ({
  ...e,
  startDate: new Date(e.startDate),
  endDate: new Date(e.endDate),
})
