interface PartialEvent {
  startDate: Date
  endDate: Date
}

/**
 * Compares 2 events by date. Returns negative if a comes first, positive if b comes first
 * @param a First Event
 * @param b Second Event
 */
export const compareEvents = (a: PartialEvent, b: PartialEvent) => {
  const now = new Date()

  const aDiff = Number(now) - Number(a.endDate)
  const bDiff = Number(now) - Number(b.endDate)

  if (aDiff < 0 && bDiff >= 0) {
    return -1
  }

  if (bDiff < 0 && aDiff >= 0) {
    return 1
  }

  return Math.abs(Number(now) - Number(a.startDate)) <
    Math.abs(Number(now) - Number(b.startDate))
    ? -1
    : 1
}
