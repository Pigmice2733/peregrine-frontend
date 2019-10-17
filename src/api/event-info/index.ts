import { Merge } from '@/type-utils'

export interface EventInfo {
  webcasts: string[]
  // the ID of the schema attached to the event
  schemaId: number
  // district "display_name" from TBA
  fullDistrict?: string
  locationName: string
  gmapsUrl?: string
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

/** Offset from UTC in ms */
const offset = new Date().getTimezoneOffset() * 60 * 1000

const parseDateInCurrentTZ = (str: string) => {
  const originalDate = new Date(str)
  return new Date(originalDate.getTime() + offset)
}

export const processEvent = (e: EventInfo): ProcessedEventInfo => {
  const startDate = parseDateInCurrentTZ(e.startDate)
  // Force it to beginning of the day
  startDate.setHours(0, 0, 0, 0)
  const endDate = parseDateInCurrentTZ(e.endDate)
  // Force it to end of day, so the event is active for the whole day
  endDate.setHours(23, 59, 59, 999)
  return { ...e, startDate, endDate }
}
