import { useEffect, useState } from 'preact/hooks'
import { decode, encode } from 'qss'

export const useQueryState = <T>(name: string, initialState?: T) => {
  const [value, setStateValue] = useState(initialState)
  useEffect(() => {
    if (!(name in getParams()) && initialState !== undefined) {
      setValue(initialState)
    }
    const handleUrlChange = () => {
      const newValue: T = getParams()[name] || initialState
      setStateValue(newValue)
    }
    handleUrlChange()
    window.addEventListener('popstate', handleUrlChange)
    return () => window.removeEventListener('popstate', handleUrlChange)
  }, [initialState, name])
  const setValue = (newValue: T) => {
    const params = getParams()
    params[name] = newValue
    history.replaceState(null, '', '?' + encode(params))
    setStateValue(newValue)
  }
  const getParams = () =>
    decode(
      location.search.substring(1), // removes the "?"
    )
  return [value, setValue] as const
}
