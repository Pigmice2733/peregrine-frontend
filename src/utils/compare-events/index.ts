import { LatLong } from '../use-geo-location'
import { distanceBetweenCoordinates } from '../distance-between-coordinates'

export interface PartialEvent {
  startDate: Date
  endDate: Date
  week?: number
  name: string
  lat?: number
  lon?: number
}

export interface EventWithLocation extends PartialEvent {
  lat: number
  lon: number
}

const aFirst = -1
const bFirst = 1
const equal = 0

const eventHasLocation = (event: PartialEvent): event is EventWithLocation =>
  event.lat !== undefined && event.lon !== undefined

export const compareEvents = (now: Date, userLocation?: LatLong) => {
  const compareByDate = (a: PartialEvent, b: PartialEvent) => {
    const isCurrent = (event: PartialEvent): boolean =>
      event.startDate <= now && now <= event.endDate

    const aIsCurrent = isCurrent(a)
    const bIsCurrent = isCurrent(b)
    const sameWeek = a.week === b.week && a.week !== undefined
    const bothAreCurrent = aIsCurrent && bIsCurrent

    if (bothAreCurrent) return equal
    if (aIsCurrent) return aFirst
    if (bIsCurrent) return bFirst

    if (sameWeek) return equal

    // For two future events, they should be sorted by soonest start
    if (a.startDate > now && b.startDate > now) {
      // @ts-expect-error
      return a.startDate - b.startDate
    }

    // Sort by most recent end
    // @ts-expect-error
    return b.endDate - a.endDate
  }

  const compareByDistance = (a: PartialEvent, b: PartialEvent) => {
    if (userLocation && eventHasLocation(a) && eventHasLocation(b)) {
      return (
        distanceBetweenCoordinates(userLocation, {
          latitude: a.lat,
          longitude: a.lon,
        }) -
        distanceBetweenCoordinates(userLocation, {
          latitude: b.lat,
          longitude: b.lon,
        })
      )
    }
  }

  return (a: PartialEvent, b: PartialEvent) => {
    const comparedDate = compareByDate(a, b)
    if (comparedDate) return comparedDate
    const comparedDistance = compareByDistance(a, b)
    if (comparedDistance) return comparedDistance
    return a.name > b.name ? bFirst : aFirst
  }
}
