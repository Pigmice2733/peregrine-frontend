interface PartialEvent {
  startDate: Date
  endDate: Date
  week?: number
  name: string
}

const now = new Date().getTime()

/**
 * Compares 2 events by date. Returns negative if a comes first, positive if b comes first
 * @param a First Event
 * @param b Second Event
 */
export const compareEvents = (a: PartialEvent, b: PartialEvent) => {
  if (a.week === b.week && a.week !== undefined) {
    return a.name < b.name ? -1 : 1
  }

  const aDiff = now - Number(a.endDate)
  const bDiff = now - Number(b.endDate)

  if (aDiff < 0 && bDiff >= 0) {
    return -1
  }

  if (bDiff < 0 && aDiff >= 0) {
    return 1
  }

  return Math.abs(now - Number(a.startDate)) <
    Math.abs(now - Number(b.startDate))
    ? -1
    : 1
}
