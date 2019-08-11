import { useEffect, useState } from 'preact/hooks'
import { EMPTY_PROMISE, noop } from './empty-promise'

const apiKey = process.env.IPDATA_API_KEY
const apiUrl =
  apiKey && `https://api.ipdata.co/?api-key=${apiKey}&fields=latitude,longitude`

export interface LatLong {
  latitude: number
  longitude: number
}

const getIpLocation = () =>
  apiUrl
    ? fetch(apiUrl)
        .then(result => result.json())
        .then(
          (data): Promise<LatLong> =>
            data.latitude && data.longitude ? data : EMPTY_PROMISE,
        )
    : EMPTY_PROMISE

const getGeoLocation = () =>
  new Promise<LatLong>(resolve =>
    navigator.geolocation.getCurrentPosition(
      result =>
        resolve({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        }),
      // If there is an error, just use IP
      () => resolve(getIpLocation()),
    ),
  )

const getLocation = async (): Promise<LatLong> => {
  if (navigator.permissions) {
    const geoPermission = await navigator.permissions.query({
      name: 'geolocation',
    })
    if (geoPermission.state === 'granted') return getGeoLocation()
    // user has not granted location, so we will prompt for location after a certain amount of time
    setTimeout(() => navigator.geolocation.getCurrentPosition(noop), 3 * 1000)
  }
  return getIpLocation()
}

const locationKey = 'geolocation'

const getLocationFromLocalStorage = () => {
  const result = localStorage.getItem(locationKey)
  if (result) return JSON.parse(result) as LatLong
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<LatLong | undefined>(
    getLocationFromLocalStorage(),
  )
  useEffect(() => {
    const locationPromise = getLocation()
    locationPromise.then(loc =>
      localStorage.setItem(locationKey, JSON.stringify(loc)),
    )
    locationPromise.then(setLocation)
  }, [])
  return location
}
