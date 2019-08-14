import { LatLong } from './use-geo-location'

/** Earth's radius in meters */
const R = 6371e3

const toRadians = (deg: number) => deg * (Math.PI / 180)

/**
 * Distance between two points in meters
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 */
export const distanceBetweenCoordinates = (a: LatLong, b: LatLong) => {
  const φ1 = toRadians(a.latitude)
  const φ2 = toRadians(b.latitude)
  const Δφ = toRadians(b.latitude - a.latitude)
  const Δλ = toRadians(b.longitude - a.longitude)

  /** Square of half chord length */
  const e =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  /** Angular distance in radians */
  const c = 2 * Math.atan2(Math.sqrt(e), Math.sqrt(1 - e))

  return R * c
}
