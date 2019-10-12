import { useEffect, useState } from 'preact/hooks'
import { decode, encode } from 'qss'

const getParams = () =>
  decode(
    location.search.substring(1), // removes the "?"
  )
const updateQueryParam = (newValue: any, name: string) => {
  const params = getParams()
  params[name] = newValue
  history.replaceState(null, '', '?' + encode(params))
}
export const useQueryState = <T>(name: string, initialState?: T) => {
  const [value, setStateValue] = useState(initialState)
  useEffect(() => {
    if (!(name in getParams()) && initialState !== undefined) {
      updateQueryParam(initialState, name)
    }
    const handleUrlChange = () => {
      const newValue: T = getParams()[name] || initialState
      setStateValue(newValue)
    }
    handleUrlChange()
    window.addEventListener('popstate', handleUrlChange)
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [initialState, name])
  return [
    value,
    (newValue: T) => {
      updateQueryParam(newValue, name)
      setStateValue(newValue)
    },
  ] as const
}
