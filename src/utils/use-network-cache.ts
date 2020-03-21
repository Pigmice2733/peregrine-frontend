import { useState, useEffect } from 'preact/hooks'
import { CancellablePromise } from './cancellable-promise'

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
    (...args: ArgsType): DataType | undefined
    (
      ...args: {
        [K in keyof ArgsType]: K extends '0'
          ? ArgsType[K] | undefined // first parameter can be undefined to skip fetching
          : ArgsType[K]
      }
    ): DataType | undefined
  }
  /* eslint-disable caleb/react-hooks/rules-of-hooks, caleb/react-hooks/exhaustive-deps */
  const resultingFunction: ResultingFunction = (...args: any[]) => {
    const [data, setData] = useState<DataType | undefined>(undefined)

    useEffect(() => {
      // When the args change, reset the data
      setData(undefined)

      // Allow us to pass a single parameter of undefined to skip getting the data
      if (args.length >= 1 && args[0] === undefined) return
      cacheGetter(...(args as ArgsType)).then((cachedData) =>
        // don't update state using the cached data if network has already returned
        setData((data) => data || cachedData),
      )

      const p = networkGetter(...(args as ArgsType)).then((networkData) =>
        setData(networkData),
      )

      return () => p.cancel()
    }, args)

    return data
  }
  return resultingFunction
  /* eslint-enable caleb/react-hooks/rules-of-hooks, caleb/react-hooks/exhaustive-deps */
}
