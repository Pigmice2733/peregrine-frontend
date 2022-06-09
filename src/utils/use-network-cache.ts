import { useState, useEffect } from 'preact/hooks'
import { CancellablePromise } from './cancellable-promise'
import { NetworkError } from '@/api/base'

/**
 * Returns a hook that executes a network promise and a cache promise.
 * Prefers the data returned from the network but falls back to the cached data.
 * Renders using cached data and then re-renders once more up-to-date network data resolves
 * You can pass a single parameter of undefined to the resulting function to skip everything
 * @param networkGetter Function that resolves to the network data
 * @param cacheGetter Function that resolves to the cache data
 */
export const useNetworkCache = <DataType, ArgsType extends any[]>(
  networkGetter: (...args: ArgsType) => CancellablePromise<DataType>,
  cacheGetter: (...args: ArgsType) => Promise<DataType>,
) => {
  interface ResultingFunction {
    (...args: ArgsType): DataType | undefined | Error
    (
      ...args: {
        // Pass the first parameter as `undefined` to skip fetching
        [K in keyof ArgsType]: ArgsType[K] | undefined
      }
    ): DataType | undefined | Error
  }
  /* eslint-disable caleb/react-hooks/rules-of-hooks, caleb/react-hooks/exhaustive-deps */
  const resultingFunction: ResultingFunction = (...args: any[]) => {
    const [networkData, setNetworkData] = useState<
      DataType | undefined | Error
    >(undefined)
    const [cacheData, setCacheData] = useState<DataType | undefined>(undefined)

    useEffect(() => {
      // When the args change, reset the data
      setNetworkData(undefined)

      // Allow us to pass a single parameter of undefined to skip getting the data
      if (args.length >= 1 && args[0] === undefined) return
      cacheGetter(...(args as ArgsType)).then((cachedData) =>
        setCacheData(cachedData),
      )

      const p = networkGetter(...(args as ArgsType))
        .then((networkData) => setNetworkData(networkData))
        .catch((error) => {
          if (error instanceof Error) {
            setNetworkData(error)
          }
        })

      return () => p.cancel()
    }, args)

    if (networkData) {
      if (networkData instanceof NetworkError && cacheData) {
        return cacheData
      }
      return networkData
    }
    if (!cacheData) {
      return networkData
    }
    return cacheData
  }
  return resultingFunction
  /* eslint-enable caleb/react-hooks/rules-of-hooks, caleb/react-hooks/exhaustive-deps */
}
