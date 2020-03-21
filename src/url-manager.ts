import { useEffect, useState } from 'preact/hooks'
import { decode, Val as URLVal, QueryObj } from 'qss'
import { encodeQs } from './utils/encode-qs'

const urlListeners = new Set<() => void>()

export const addUrlListener = (cb: () => void) => urlListeners.add(cb)

const handleUrlChange = () => urlListeners.forEach((l) => l())

window.addEventListener('popstate', handleUrlChange)

/**
 * @param newPartialUrl The new URL for the page to have (could be a partial url such as a hash, path, or query string)
 * @param replace Whether the previous url should be replaced rather than creating a new history entry
 */
export const updateUrl = (newPartialUrl: string, replace = false) => {
  history[replace ? 'replaceState' : 'pushState'](null, '', newPartialUrl)
  handleUrlChange()
}

/** Returns a URL object when the URL changes */
export const useUrl = <T>(urlPartGetter: (location: Location) => T): T => {
  const [value, setValue] = useState<T>(urlPartGetter(location))
  useEffect(() => {
    const listener = () => setValue(urlPartGetter(location))
    urlListeners.add(listener)
    return () => urlListeners.delete(listener)
  }, [urlPartGetter])
  return value
}

const getQueryParams = (): QueryObj =>
  decode(
    // removes the ?
    location.search.slice(1),
  )

export const useQueryParam = (name: string) =>
  useUrl(() => getQueryParams()[name])

export const updateQueryParam = (name: string, value: URLVal) => {
  updateUrl(encodeQs({ ...getQueryParams(), [name]: value }))
}
