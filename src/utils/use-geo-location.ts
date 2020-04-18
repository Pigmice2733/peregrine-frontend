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
        .then((result) => result.json())
        .then(
          (data): Promise<LatLong> =>
            data.latitude && data.longitude ? data : EMPTY_PROMISE,
        )
    : EMPTY_PROMISE

const getGeoLocation = () =>
  new Promise<LatLong>((resolve) =>
    navigator.geolocation.getCurrentPosition(
      (result) =>
        resolve({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        }),
      // If there is an error, just use IP
      () => resolve(getIpLocation()),
    ),
  )

const locationKey = 'geolocation'

const getLocationFromLocalStorage = () => {
  const result = localStorage.getItem(locationKey)
  if (result) return JSON.parse(result) as LatLong
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<LatLong | undefined>(
    getLocationFromLocalStorage(),
  )
  const [canPrompt, setCanPrompt] = useState<boolean>(
    navigator.permissions === undefined,
  )
  useEffect(() => {
    const locationPromise = getGeoLocation()
    locationPromise.then((loc) =>
      localStorage.setItem(locationKey, JSON.stringify(loc)),
    )
    locationPromise.then(setLocation)
  }, [])

  useEffect(() => {
    let geoPermission: PermissionStatus | undefined
    const onPositionChange = () => {
      if (geoPermission) setCanPrompt(geoPermission.state === 'prompt')
    }
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permission) => {
          geoPermission = permission
          geoPermission.addEventListener('change', onPositionChange)
          onPositionChange()
        })
    }

    return () => {
      if (geoPermission)
        geoPermission.removeEventListener('change', onPositionChange)
    }
  }, [])

  const prompt =
    canPrompt &&
    (() => {
      navigator.geolocation.getCurrentPosition(() => {
        getGeoLocation().then(setLocation)
      })
    })

  return [location, prompt] as const
}
