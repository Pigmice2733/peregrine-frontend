import { useState, useEffect } from 'preact/hooks'

/**
 * Returns a hook that executes a network promise and a cache promise. Prefers
 * the data returned from the network but falls back to the cached data.
 * Useful for rendering the cached data and then re-rendering once more
 * up-to-date network data returns
 * @param networkGetter Function that resolves to the network data
 * @param cacheGetter Function that resolves to the cache data
 */
export const useNetworkCache = <DataType, ArgsType extends any[]>(
  networkGetter: (...args: ArgsType) => Promise<DataType>,
  cacheGetter: (...args: ArgsType) => Promise<DataType>,
) =>
  /* eslint-disable caleb/react-hooks/rules-of-hooks, caleb/react-hooks/exhaustive-deps */
  (...args: ArgsType) => {
    const [data, setData] = useState<DataType | undefined>(undefined)

    useEffect(() => {
      cacheGetter(...args).then(cachedData =>
        // don't update state using the cached data if network has already returned
        setData(data => data || cachedData),
      )

      networkGetter(...args).then(networkData => {
        setData(networkData)
      })
    }, args)

    return data
  }
/* eslint-enable caleb/react-hooks/rules-of-hooks, caleb/react-hooks/exhaustive-deps */
